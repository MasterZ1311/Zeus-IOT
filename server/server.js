/**
 * Zeus IoT — static frontend server.
 *
 * The site is a self-contained WhatsApp funnel: all customer interaction happens
 * on WhatsApp, so there is no database, auth, or data collection here. This server
 * only builds-serves the React app (client/dist) with SPA fallback routing.
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();

// Security headers. CSP is left off because the SPA ships inline styles,
// JSON-LD, and the PWA service-worker registration snippet.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// The React app is built to client/dist.
const FRONTEND_DIR = path.join(__dirname, '../client/dist');

// Health check (handy for uptime monitors / Render health checks)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── Live presence ────────────────────────────────────────────
// Tracks currently-active viewers in memory via client heartbeats.
// No database: a Map of sessionId → lastSeen, pruned on each request.
// (Render runs a single instance by default, so this count is consistent.)
const viewers = new Map();
const PRESENCE_TTL = 20000; // a viewer is "active" if seen within 20s

app.get('/api/presence', (req, res) => {
  const now = Date.now();
  const id = String(req.query.id || '').slice(0, 64);
  if (id) viewers.set(id, now);
  // Prune stale viewers
  for (const [key, seen] of viewers) {
    if (now - seen > PRESENCE_TTL) viewers.delete(key);
  }
  res.setHeader('Cache-Control', 'no-store');
  // Floor at 1 so a lone visitor still sees themselves
  res.json({ count: Math.max(1, viewers.size) });
});

// Service worker must never be cached, so PWA updates are picked up immediately.
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.sendFile(path.join(FRONTEND_DIR, 'sw.js'), (err) => {
    if (err) res.status(404).end();
  });
});

// Serve built static assets (hashed filenames → safe to cache long-term).
app.use(express.static(FRONTEND_DIR));

// SPA fallback — every other route serves index.html so client-side routing
// (BrowserRouter) works on direct load and refresh.
app.use((req, res) => {
  const indexPath = path.join(FRONTEND_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Frontend not built. Run "cd client && npm run build".');
  }
});

const server = app.listen(PORT, () => {
  console.log('=======================================================');
  console.log(`🚀 ZEUS IOT SITE IS LIVE ON PORT ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log('=======================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`FATAL: Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

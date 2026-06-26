/**
 * LiveViewers
 * Tiny social-proof widget showing how many people are viewing the site right now.
 * Sends a heartbeat to /api/presence every 10s and reads back the live count.
 * Gracefully hides itself if the presence endpoint isn't reachable (e.g. local
 * dev without the server running), so it never shows a broken state.
 *
 * Position: bottom-left on desktop, top-left (under the nav) on mobile — keeps
 * clear of the WhatsApp FAB (bottom-right) and the mobile sticky bar (bottom).
 */
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Stable per-tab id so the same visitor isn't counted twice across heartbeats.
function getSessionId() {
  try {
    let id = sessionStorage.getItem('zeus_presence_id');
    if (!id) {
      id = (crypto.randomUUID?.() || String(Math.random()).slice(2)) + Date.now().toString(36);
      sessionStorage.setItem('zeus_presence_id', id);
    }
    return id;
  } catch {
    return 'anon-' + Math.random().toString(36).slice(2);
  }
}

export default function LiveViewers() {
  const [count, setCount] = useState(null);     // null = not loaded yet / hidden
  const [failed, setFailed] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const idRef = useRef(getSessionId());
  const location = useLocation();

  // Hide the pill when the footer is near, so it never overlaps footer content.
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const full = document.documentElement.scrollHeight;
      setNearBottom(full - scrolled < 240);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let alive = true;
    let timer;

    const ping = async () => {
      try {
        const res = await fetch(`/api/presence?id=${encodeURIComponent(idRef.current)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('bad status');
        const data = await res.json();
        if (alive) {
          setCount(typeof data.count === 'number' ? data.count : 1);
          setFailed(false);
        }
      } catch {
        if (alive) setFailed(true);
      }
    };

    ping();
    timer = setInterval(ping, 10000);

    // Send a final-ish ping when the tab becomes visible again
    const onVisible = () => { if (document.visibilityState === 'visible') ping(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Keep the heartbeat running site-wide (so the count stays accurate), but only
  // SHOW the pill on the home page where it has room and acts as social proof —
  // on inner pages it would overlap the page heading. Also hide it near the footer.
  if (failed || count === null || location.pathname !== '/' || nearBottom) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="live-viewers"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 22 }}
        className="fixed z-[115] flex items-center gap-2 rounded-full select-none pointer-events-none"
        style={{
          // Mobile: top-left under the nav. Desktop: bottom-left.
          top: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          left: 'max(12px, env(safe-area-inset-left))',
          padding: '6px 12px',
          background: 'rgba(7, 12, 30, 0.72)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        data-position="adaptive"
      >
        {/* Live pulse dot */}
        <span className="relative flex items-center justify-center" style={{ width: 8, height: 8 }}>
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: '#25d366', opacity: 0.5, animation: 'livePulse 1.8s ease-out infinite' }} />
          <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: '#25d366', boxShadow: '0 0 6px rgba(37,211,102,0.9)' }} />
        </span>

        <span className="font-code-sm tracking-wide" style={{ fontSize: 11, color: '#e0e3e5' }}>
          <span style={{ color: '#25d366', fontWeight: 700 }}>{count}</span>
          {' '}<span className="text-on-surface-variant">{count === 1 ? 'person' : 'people'} viewing</span>
        </span>

        <style>{`
          @keyframes livePulse {
            0%   { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(2.6); opacity: 0; }
          }
          /* Desktop: move to bottom-left */
          @media (min-width: 768px) {
            [data-position="adaptive"] {
              top: auto !important;
              bottom: calc(env(safe-area-inset-bottom, 0px) + 24px) !important;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes livePulse { 0%,100% { opacity: 0; } }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

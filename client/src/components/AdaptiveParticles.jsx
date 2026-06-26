/**
 * AdaptiveParticles
 * - Desktop: a vibrant, MOUSE-INTERACTIVE constellation network that connects
 *   to the cursor — uses the extra desktop horsepower for a "WOW" living backdrop.
 * - Mobile (unchanged): the original lightweight canvas / CSS ambient glow.
 * Frame-throttled to 60fps, GPU-composited, respects reduced motion.
 */
import { useEffect, useRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

/* ── CSS fallback (low tier) — unchanged ─────────────────────── */
function AmbientGlow() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" style={{ contain: 'strict' }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,210,255,0.07) 0%, transparent 70%)', animation: 'ambientDrift1 20s ease-in-out infinite alternate', willChange: 'transform' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,169,60,0.06) 0%, transparent 70%)', animation: 'ambientDrift2 25s ease-in-out infinite alternate', willChange: 'transform' }} />
      <style>{`
        @keyframes ambientDrift1 { 0% { transform: translate(0,0) scale(1);} 100% { transform: translate(5vw,8vh) scale(1.15);} }
        @keyframes ambientDrift2 { 0% { transform: translate(0,0) scale(1);} 100% { transform: translate(-5vw,-6vh) scale(1.1);} }
      `}</style>
    </div>
  );
}

/* ── Mobile canvas — UNCHANGED behavior ──────────────────────── */
const PARTICLE_CONFIG = {
  high: { count: 80, connectDist: 120, opacity: 0.5 },
  mid:  { count: 40, connectDist: 90,  opacity: 0.35 },
};
function mkParticle(w, h) {
  return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, r: Math.random() * 1.5 + 0.5, color: Math.random() > 0.6 ? '0,210,255' : '229,169,60' };
}
function CanvasParticles({ tier }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], raf: null, lastTime: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cfg = PARTICLE_CONFIG[tier] ?? PARTICLE_CONFIG.mid;
    let width = 0, height = 0, lastWidth = -1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (width !== lastWidth) { lastWidth = width; stateRef.current.particles = Array.from({ length: cfg.count }, () => mkParticle(width, height)); }
    };
    resize();
    let resizeTimer;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };
    window.addEventListener('resize', onResize, { passive: true });
    const FRAME_MS = 1000 / 60;
    const tick = (now) => {
      stateRef.current.raf = requestAnimationFrame(tick);
      if (now - stateRef.current.lastTime < FRAME_MS * 0.85) return;
      stateRef.current.lastTime = now;
      ctx.clearRect(0, 0, width, height);
      const pts = stateRef.current.particles;
      for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1; }
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.connectDist) { ctx.strokeStyle = `rgba(0,210,255,${(1 - dist / cfg.connectDist) * cfg.opacity * 0.4})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.color},${cfg.opacity})`; ctx.fill(); }
    };
    stateRef.current.raf = requestAnimationFrame(tick);
    const state = stateRef.current;
    return () => { cancelAnimationFrame(state.raf); clearTimeout(resizeTimer); window.removeEventListener('resize', onResize); };
  }, [tier]);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', contain: 'strict', willChange: 'transform' }} />;
}

/* ── Desktop interactive constellation — bright + cursor-reactive ── */
function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const ref = useRef({ particles: [], raf: 0, last: 0, mx: -9999, my: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, lastW = -1;
    const COUNT = 110;
    const CONNECT = 150;
    const MOUSE = 220;

    const mk = () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.6 + 0.9,
      c: Math.random() > 0.5 ? '0,210,255' : '229,169,60',
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w !== lastW) { lastW = w; ref.current.particles = Array.from({ length: COUNT }, mk); }
    };
    resize();
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(resize, 150); };
    const onMove = (e) => { ref.current.mx = e.clientX; ref.current.my = e.clientY; };
    const onLeave = () => { ref.current.mx = -9999; ref.current.my = -9999; };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    const FR = 1000 / 60;
    const tick = (now) => {
      ref.current.raf = requestAnimationFrame(tick);
      if (now - ref.current.last < FR * 0.85) return;
      ref.current.last = now;
      ctx.clearRect(0, 0, w, h);
      const pts = ref.current.particles;
      const mx = ref.current.mx, my = ref.current.my;

      // move
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // particle-to-particle links
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT) {
            ctx.strokeStyle = `rgba(0,210,255,${(1 - dist / CONNECT) * 0.32})`;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }

      // cursor links (bright gold) + glow nearby dots
      if (mx > -9000) {
        for (const p of pts) {
          const dx = mx - p.x, dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE) {
            const a = (1 - dist / MOUSE);
            ctx.strokeStyle = `rgba(229,169,60,${a * 0.55})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
        }
      }

      // dots (brighter + glow near cursor)
      for (const p of pts) {
        const dx = mx - p.x, dy = my - p.y;
        const near = (mx > -9000) ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / MOUSE) : 0;
        const rad = p.r + near * 1.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${0.6 + near * 0.4})`;
        ctx.fill();

        if (near > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c},${near * 0.16})`;
          ctx.fill();
        }
      }
    };
    ref.current.raf = requestAnimationFrame(tick);

    const r = ref.current;
    return () => {
      cancelAnimationFrame(r.raf); clearTimeout(rt);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', willChange: 'transform' }} />;
}

export default function AdaptiveParticles() {
  const { tier, isDesktop, canRunParticles, shouldReduceAnimations } = useDeviceCapabilities();

  if (shouldReduceAnimations) return null;
  if (isDesktop) return <InteractiveCanvas />;            // desktop: vibrant + interactive
  if (canRunParticles || tier === 'mid') return <CanvasParticles tier={tier} />; // mobile (unchanged)
  return <AmbientGlow />;
}

/**
 * AdaptiveParticles
 * GPU-accelerated canvas particle field for high-end devices.
 * Uses requestAnimationFrame with frame-rate throttling to stay at 60fps.
 * Automatically degrades to a CSS-only ambient glow on mid/low-end devices.
 */
import { useEffect, useRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

// ── CSS fallback for mid/low tier ──────────────────────────────
function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,210,255,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'ambientDrift1 20s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,169,60,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'ambientDrift2 25s ease-in-out infinite alternate',
          willChange: 'transform',
        }}
      />
      <style>{`
        @keyframes ambientDrift1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5vw, 8vh) scale(1.15); }
        }
        @keyframes ambientDrift2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-5vw, -6vh) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// ── Canvas particle engine ─────────────────────────────────────
const PARTICLE_CONFIG = {
  high: { count: 80, maxSpeed: 0.4, connectDist: 120, opacity: 0.5 },
  mid:  { count: 40, maxSpeed: 0.3, connectDist: 90,  opacity: 0.35 },
};

function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    r: Math.random() * 1.5 + 0.5,
    // Alternate between cyan and gold
    color: Math.random() > 0.6 ? '0,210,255' : '229,169,60',
  };
}

function CanvasParticles({ tier }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], raf: null, lastTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cfg = PARTICLE_CONFIG[tier] ?? PARTICLE_CONFIG.mid;

    let width = 0;
    let height = 0;
    let lastWidth = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only re-seed particles when the WIDTH changes. This avoids re-seeding
      // (and visible jumps) when mobile browser URL bars collapse/expand on scroll,
      // which only changes the height.
      if (width !== lastWidth) {
        lastWidth = width;
        stateRef.current.particles = Array.from({ length: cfg.count }, () =>
          createParticle(width, height)
        );
      }
    };

    resize();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const TARGET_FPS = 60;
    const FRAME_MS = 1000 / TARGET_FPS;

    const tick = (now) => {
      stateRef.current.raf = requestAnimationFrame(tick);
      const dt = now - stateRef.current.lastTime;
      if (dt < FRAME_MS * 0.85) return; // Skip frame if ahead of target
      stateRef.current.lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const pts = stateRef.current.particles;
      // Update
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cfg.connectDist) {
            const alpha = (1 - dist / cfg.connectDist) * cfg.opacity * 0.4;
            ctx.strokeStyle = `rgba(0,210,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${cfg.opacity})`;
        ctx.fill();
      }
    };

    stateRef.current.raf = requestAnimationFrame(tick);

    const state = stateRef.current;
    return () => {
      cancelAnimationFrame(state.raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [tier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        contain: 'strict',
        willChange: 'transform', // hint GPU compositing layer
      }}
    />
  );
}

// ── Public component ──────────────────────────────────────────
export default function AdaptiveParticles() {
  const { tier, canRunParticles, shouldReduceAnimations } = useDeviceCapabilities();

  if (shouldReduceAnimations) return null;
  if (canRunParticles || tier === 'mid') return <CanvasParticles tier={tier} />;
  return <AmbientGlow />;
}

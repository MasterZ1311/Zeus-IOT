/**
 * ScrollProgress — thin gradient beam at the very top showing scroll depth.
 * Desktop-only (returns null otherwise). Updated via ref in a rAF-guarded
 * scroll handler → no React re-renders.
 */
import { useEffect, useRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export default function ScrollProgress() {
  const { isDesktop, shouldReduceAnimations } = useDeviceCapabilities();
  const barRef = useRef(null);

  useEffect(() => {
    if (!isDesktop) return;
    const bar = barRef.current;
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? (el.scrollTop / max) : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop, shouldReduceAnimations]);

  if (!isDesktop) return null;

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[160]" style={{ height: 3, pointerEvents: 'none' }}>
      <div
        ref={barRef}
        style={{
          height: '100%', width: '100%',
          transform: 'scaleX(0)', transformOrigin: '0 50%',
          background: 'linear-gradient(90deg, #e5a93c, #00d2ff)',
          boxShadow: '0 0 10px rgba(0,210,255,0.5)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

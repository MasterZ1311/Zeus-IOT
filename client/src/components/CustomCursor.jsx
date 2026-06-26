/**
 * CustomCursor — desktop-only glowing cursor.
 * A bright gold dot tracks the pointer instantly; a cyan ring eases behind it
 * and grows/colors over interactive elements. Native cursor is hidden on desktop
 * (text inputs keep their caret). Returns null on touch/reduced-motion → mobile
 * is completely unaffected. Animated via refs → 60fps, zero React re-renders.
 */
import { useEffect, useRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export default function CustomCursor() {
  const { isDesktop, shouldReduceAnimations } = useDeviceCapabilities();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!isDesktop || shouldReduceAnimations) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, raf;

    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (dot.style.opacity !== '1') { dot.style.opacity = '1'; ring.style.opacity = '1'; }
    };
    const loop = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const interactiveSel = 'a, button, [role="button"], label, input, select, textarea';
    const over = (e) => { if (e.target.closest(interactiveSel)) ring.classList.add('cursor-ring-hover'); };
    const out  = (e) => { if (e.target.closest(interactiveSel)) ring.classList.remove('cursor-ring-hover'); };
    const down = () => ring.classList.add('cursor-ring-down');
    const up   = () => ring.classList.remove('cursor-ring-down');
    const leave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const enter = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mouseout', out, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    document.body.classList.add('has-custom-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout', out);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isDesktop, shouldReduceAnimations]);

  if (!isDesktop || shouldReduceAnimations) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

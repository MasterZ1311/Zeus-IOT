/**
 * CustomCursor
 * Desktop-only glowing cursor with a trailing spotlight ring that enlarges
 * over interactive elements. Pure transform animation → stays at 60fps.
 * Disabled on touch devices and reduced-motion.
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

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // Ring follows with easing
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Grow ring over interactive elements
    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.add('cursor-ring-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        ring.classList.remove('cursor-ring-hover');
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.body.classList.add('has-custom-cursor');

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
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

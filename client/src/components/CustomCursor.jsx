/**
 * CustomCursor
 * Desktop-only AMBIENT spotlight ring that softly trails the real cursor.
 * It does NOT hide or replace the native cursor — so clicking, text selection,
 * and precision stay perfect. Pure transform animation → 60fps.
 * Disabled on touch devices and reduced-motion.
 */
import { useEffect, useRef } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export default function CustomCursor() {
  const { isDesktop, shouldReduceAnimations } = useDeviceCapabilities();
  const ringRef = useRef(null);

  useEffect(() => {
    if (!isDesktop || shouldReduceAnimations) return;

    const ring = ringRef.current;
    if (!ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;
    let visible = false;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) { ring.style.opacity = '1'; visible = true; }
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"]')) ring.classList.add('cursor-ring-hover');
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"]')) ring.classList.remove('cursor-ring-hover');
    };
    const onLeave = () => { ring.style.opacity = '0'; visible = false; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [isDesktop, shouldReduceAnimations]);

  if (!isDesktop || shouldReduceAnimations) return null;

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}

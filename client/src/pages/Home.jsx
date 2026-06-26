/**
 * Home — thin platform router.
 *
 * Splits cleanly into two fully-isolated compositions:
 *   • MobileHome  — the touch-native experience (sacred; do not regress)
 *   • DesktopHome — the wide-canvas cinematic experience
 *
 * Each is lazy-loaded, so a phone never downloads the desktop chunk (and vice
 * versa). The only shared piece is the once-per-session boot preloader, kept
 * here so both platforms boot identically.
 */
import { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import HomePreloader from './home/HomePreloader';

const MobileHome  = lazy(() => import('./MobileHome'));
const DesktopHome = lazy(() => import('./DesktopHome'));

export default function Home() {
  const [preloading, setPreloading] = useState(() => {
    // Show the cinematic preloader only on the first Home visit per session,
    // so returning to Home mid-session doesn't replay the 1.8s intro.
    try { return !sessionStorage.getItem('zeus_booted'); } catch { return true; }
  });

  const finishPreload = () => {
    try { sessionStorage.setItem('zeus_booted', '1'); } catch { /* ignore */ }
    setPreloading(false);
  };

  const { isMobile } = useDeviceCapabilities();

  return (
    <div className="relative">
      <AnimatePresence>
        {preloading && <HomePreloader onDone={finishPreload} />}
      </AnimatePresence>

      <Suspense fallback={<div className="min-h-screen" />}>
        {isMobile ? <MobileHome /> : <DesktopHome />}
      </Suspense>
    </div>
  );
}

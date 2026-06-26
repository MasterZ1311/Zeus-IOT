/**
 * App — persistent Layout + animated page transitions + code splitting.
 *
 * Layout (nav, footer, WhatsApp button, live counter, cursor) is mounted ONCE
 * and persists across navigation. Only the routed page content animates in/out.
 */
import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { initSound } from './lib/sound';

// Lazy-load all page-level components
const Home    = lazy(() => import('./pages/Home'));
const Projects= lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const Pay     = lazy(() => import('./pages/Pay'));
const Report  = lazy(() => import('./pages/Report'));
const Terms   = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Support = lazy(() => import('./pages/Support'));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

/**
 * RouteProgress — NProgress-style top bar that shows while a lazy page chunk
 * downloads. Driven by the `loading` prop; animates via direct DOM manipulation
 * so it never triggers React re-renders during the bar animation.
 */
function RouteProgress({ loading }) {
  const barRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    clearTimeout(timerRef.current);

    if (loading) {
      bar.style.display = 'block';
      bar.style.opacity = '1';
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = 'width 8s cubic-bezier(0.1, 0.8, 0.2, 1)';
          bar.style.width = '85%';
        });
      });
    } else {
      bar.style.transition = 'width 0.18s ease-out';
      bar.style.width = '100%';
      timerRef.current = setTimeout(() => {
        bar.style.transition = 'opacity 0.25s ease';
        bar.style.opacity = '0';
        setTimeout(() => { bar.style.display = 'none'; bar.style.width = '0%'; }, 260);
      }, 180);
    }
    return () => clearTimeout(timerRef.current);
  }, [loading]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[170] pointer-events-none hidden md:block"
      style={{ height: 3 }}
    >
      <div
        ref={barRef}
        style={{
          display: 'none',
          height: '100%',
          width: '0%',
          background: 'linear-gradient(90deg, #e5a93c, #00d2ff)',
          boxShadow: '0 0 10px rgba(0,210,255,0.6)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
}

// Dark-themed loading skeleton shown while a page chunk downloads
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo-loader.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain rounded-xl opacity-40 animate-pulse" />
        <div className="rounded-full overflow-hidden" style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full skeleton" style={{ background: 'linear-gradient(90deg, #e5a93c, #00d2ff)' }} />
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <RouteProgress loading={false} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ willChange: 'transform, opacity' }}
        >
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location}>
              <Route path="/"         element={<Home    />} />
              <Route path="/projects" element={<Projects/>} />
              <Route path="/contact"  element={<Contact />} />
              <Route path="/pay"      element={<Pay     />} />
              <Route path="/report"   element={<Report  />} />
              <Route path="/terms"    element={<Terms   />} />
              <Route path="/privacy"  element={<Privacy />} />
              <Route path="/support"  element={<Support />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function App() {
  // Play a welcome thunderclap on the first user gesture (browser autoplay policy).
  // Thunder only fires ONCE — not on every page navigation, which is jarring.
  useEffect(() => { initSound(); }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;

/**
 * App — persistent Layout + animated page transitions + code splitting.
 *
 * Layout (nav, footer, WhatsApp button, live counter, cursor) is mounted ONCE
 * and persists across navigation. Only the routed page content animates in/out,
 * so the chrome never flickers or re-initialises on page change.
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-load all page-level components (each becomes its own cached chunk)
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

// Dark-themed loading skeleton shown while a page chunk downloads
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true" aria-label="Loading page">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="" aria-hidden="true" className="w-16 h-16 object-contain rounded-xl opacity-40 animate-pulse" />
        <div className="rounded-full overflow-hidden" style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full skeleton" style={{ background: 'linear-gradient(90deg, #e5a93c, #00d2ff)' }} />
        </div>
      </div>
    </div>
  );
}

// A single keyed motion wrapper animates page transitions. The Routes are bound
// to `location` so the exiting snapshot keeps showing the previous page correctly.
function AnimatedRoutes() {
  const location = useLocation();

  return (
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
            <Route path="/"         element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/pay"      element={<Pay />} />
            <Route path="/report"   element={<Report />} />
            <Route path="/terms"    element={<Terms />} />
            <Route path="/privacy"  element={<Privacy />} />
            <Route path="/support"  element={<Support />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
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

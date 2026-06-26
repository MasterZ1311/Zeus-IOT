/**
 * Layout
 * - Desktop: standard top nav + content + footer
 * - Mobile:  top bar + content + floating bottom tab bar
 *            Bottom bar uses native iOS-style glass + safe-area padding
 */
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFab from './WhatsAppFab';
import ExitIntentNudge from './ExitIntentNudge';
import CustomCursor from './CustomCursor';
import LiveViewers from './LiveViewers';
import AdaptiveParticles from './AdaptiveParticles';
import ScrollProgress from './ScrollProgress';
import { Home, LayoutGrid, MessageSquare, CreditCard } from 'lucide-react';

const BOTTOM_TABS = [
  { icon: Home,          label: 'Home',     path: '/' },
  { icon: LayoutGrid,    label: 'Projects', path: '/projects' },
  { icon: MessageSquare, label: 'Contact',  path: '/contact' },
  { icon: CreditCard,    label: 'Pay',      path: '/pay' },
];

function BottomTab({ icon: Icon, label, path, isActive }) {
  return (
    <Link
      to={path}
      className="relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 active:scale-90"
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator pill */}
      {isActive && (
        <motion.div
          layoutId="bottom-tab-pill"
          className="absolute inset-x-2 top-0 h-[2px] rounded-full"
          style={{ background: '#e5a93c' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}

      <div
        className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
        style={isActive ? {
          background: 'rgba(229,169,60,0.1)',
          boxShadow: '0 0 12px rgba(229,169,60,0.12)',
        } : {}}
      >
        <Icon
          className="w-5 h-5 transition-colors"
          style={{ color: isActive ? '#e5a93c' : 'rgba(198,198,205,0.6)', strokeWidth: isActive ? 2.5 : 1.5 }}
        />
        <span
          className="font-label-caps transition-colors"
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: isActive ? '#e5a93c' : 'rgba(198,198,205,0.5)',
            fontWeight: isActive ? 700 : 400,
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function Layout({ children }) {
  const location = useLocation();

  // Scroll to top on every route change (otherwise you land mid-page).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <div
      className="min-h-screen flex flex-col font-body-lg text-on-surface circuit-bg relative"
      style={{ minHeight: '100svh' }}
    >
      {/* Adaptive animated background — renders once, persists across all pages */}
      <AdaptiveParticles />

      {/* Desktop scroll-progress beam */}
      <ScrollProgress />

      <Navbar />

      {/* Main content — animated page routes are passed in as children */}
      <main className="flex-grow z-10" style={{ paddingTop: '3.5rem' }}>
        {children}
      </main>

      <Footer />

      {/* Floating WhatsApp button + mobile sticky bar */}
      <WhatsAppFab />

      {/* Live viewer count */}
      <LiveViewers />

      {/* Exit-intent / deep-scroll WhatsApp nudge */}
      <ExitIntentNudge />

      {/* Desktop custom cursor */}
      <CustomCursor />

      {/* ── MOBILE BOTTOM TAB BAR ──────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch"
        style={{
          background: 'rgba(7, 12, 30, 0.88)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(0, 210, 255, 0.1)',
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.4), 0 -1px 0 rgba(0,210,255,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 4px)',
          minHeight: 56,
          contain: 'layout style',
        }}
        aria-label="Main navigation"
      >
        {BOTTOM_TABS.map(tab => (
          <BottomTab key={tab.path} {...tab} isActive={isActive(tab.path)} />
        ))}
      </nav>
    </div>
  );
}

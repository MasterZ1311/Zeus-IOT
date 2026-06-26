/**
 * Navbar
 * - Desktop: transparent → frosted glass on scroll, magnetic hover underlines
 * - Mobile: minimal top bar (just logo + hamburger) — main nav lives in bottom tab bar
 *           Full-screen slide-in menu on hamburger tap
 */
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const NAV_LINKS = [
  { name: 'HOME',     path: '/' },
  { name: 'PROJECTS', path: '/projects' },
  { name: 'CONTACT',  path: '/contact' },
  { name: 'PAY',      path: '/pay' },
];

// Desktop nav link with animated underline
function NavLink({ name, path, isActive }) {
  return (
    <Link
      to={path}
      className="relative font-label-caps transition-colors"
      style={{
        fontSize: 12,
        color: isActive ? '#e5a93c' : '#c6c6cd',
        letterSpacing: '0.1em',
      }}
    >
      {name}
      {/* Animated underline */}
      <motion.span
        layoutId="nav-underline"
        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
        style={{ background: '#e5a93c', originX: 0 }}
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </Link>
  );
}

// Full-screen mobile menu overlay
function MobileMenuOverlay({ isOpen, onClose }) {
  const location = useLocation();

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200]"
          style={{ background: 'rgba(3, 5, 12, 0.97)', backdropFilter: 'blur(20px)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 px-6 pt-6">
            <img src="/logo-loader.png" alt="Zeus IoT" className="w-10 h-10 object-contain rounded-xl" />
            <span className="font-headline-xl text-secondary glow-text" style={{ fontSize: 20, letterSpacing: '0.05em' }}>
              ZEUS IOT
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-col px-6 pt-10 gap-1">
            {NAV_LINKS.map((link, i) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 border-b font-label-caps"
                    style={{
                      fontSize: 14,
                      letterSpacing: '0.15em',
                      borderColor: 'rgba(255,255,255,0.06)',
                      color: isActive ? '#e5a93c' : '#c6c6cd',
                    }}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-secondary" style={{ boxShadow: '0 0 6px rgba(229,169,60,0.8)' }} />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom contact strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="absolute bottom-0 inset-x-0 p-6 pb-10"
          >
            <a
              href={waLink(messages.generic)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('mobile-menu')}
              className="flex items-center justify-center gap-3 py-4 rounded-xl font-label-caps text-xs uppercase tracking-widest"
              style={{
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#25d366',
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
              </svg>
              CHAT ON WHATSAPP
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const location    = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <>
      {/* ── DESKTOP NAV ──────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-50 hidden md:flex items-center justify-between px-16 h-16 transition-all duration-500"
        style={{
          background: isScrolled ? 'rgba(7, 12, 30, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(0,210,255,0.1)' : 'none',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
          contain: 'layout style',
        }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo-loader.png" alt="Zeus IoT" className="w-8 h-8 object-contain rounded-md" />
          <span className="font-headline-xl text-secondary glow-text tracking-tight" style={{ fontSize: 18 }}>
            ZEUS IOT
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <NavLink key={link.path} {...link} isActive={isActive(link.path)} />
          ))}
        </nav>
      </header>

      {/* ── MOBILE TOP BAR ───────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-[150] flex md:hidden items-center justify-between px-4 h-14 transition-all duration-300"
        style={{
          background: isScrolled ? 'rgba(7, 12, 30, 0.9)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(0,210,255,0.08)' : 'none',
          paddingTop: 'env(safe-area-inset-top, 0)',
          contain: 'layout style',
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-loader.png" alt="Zeus IoT" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-headline-md text-secondary glow-text" style={{ fontSize: 16 }}>ZEUS IOT</span>
        </Link>

        <button
          onClick={() => setMenuOpen(true)}
          className="w-11 h-11 flex items-center justify-center rounded-xl touch-ripple"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <Menu className="w-5 h-5 text-on-surface-variant" />
        </button>
      </header>

      {/* Mobile full-screen menu */}
      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

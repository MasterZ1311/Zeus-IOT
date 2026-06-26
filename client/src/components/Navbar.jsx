/**
 * Navbar
 * - Desktop: transparent → frosted glass on scroll, magnetic hover underlines
 * - Mobile: minimal top bar (just logo + hamburger) — main nav lives in bottom tab bar
 *           Full-screen slide-in menu on hamburger tap
 */
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false);
  const location    = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      </header>
    </>
  );
}

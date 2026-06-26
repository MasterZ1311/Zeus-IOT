/**
 * MobileHero
 * Immersive, touch-native hero experience for mobile devices.
 * - Full-viewport "edge to edge" layout
 * - Gyroscope/tilt parallax on devices that support it
 * - Touch ripple on CTA
 * - Animated gradient mesh behind logo
 * - Stats counter strip
 */
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

// Animated mesh gradient background
function MeshBackground({ tiltX, tiltY }) {
  const bg1X = useTransform(tiltX, [-15, 15], ['-8%', '8%']);
  const bg1Y = useTransform(tiltY, [-15, 15], ['-8%', '8%']);
  const bg2X = useTransform(tiltX, [-15, 15], ['8%', '-8%']);
  const bg2Y = useTransform(tiltY, [-15, 15], ['8%', '-8%']);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[#03050c]" />

      {/* Cyan orb — moves with gyro */}
      <motion.div
        style={{
          x: bg1X, y: bg1Y,
          position: 'absolute',
          top: '-20%', left: '-15%',
          width: '120vw', height: '120vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,210,255,0.18) 0%, rgba(0,210,255,0.04) 40%, transparent 70%)',
          filter: 'blur(30px)',
          willChange: 'transform',
        }}
      />

      {/* Gold orb */}
      <motion.div
        style={{
          x: bg2X, y: bg2Y,
          position: 'absolute',
          bottom: '-20%', right: '-15%',
          width: '100vw', height: '100vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,169,60,0.14) 0%, rgba(229,169,60,0.03) 40%, transparent 70%)',
          filter: 'blur(30px)',
          willChange: 'transform',
        }}
      />

      {/* Circuit grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 h 15 v 10 h 10 v 15' stroke='%2300d2ff' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='35' r='1.5' fill='%2300d2ff'/%3E%3Cpath d='M40 50 h 10 v -20' stroke='%23e5a93c' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='30' r='1' fill='%23e5a93c'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Horizontal scan line */}
      <div
        className="absolute inset-x-0 h-px"
        style={{
          top: '35%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,210,255,0.3) 30%, rgba(229,169,60,0.3) 70%, transparent 100%)',
          animation: 'scanLine 8s ease-in-out infinite',
          willChange: 'opacity',
        }}
      />
      <style>{`
        @keyframes scanLine {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Floating status badge
function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 self-start"
      style={{
        background: 'rgba(229,169,60,0.08)',
        border: '1px solid rgba(229,169,60,0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <span
        className="w-2 h-2 rounded-full bg-secondary"
        style={{ boxShadow: '0 0 6px rgba(229,169,60,0.8)', animation: 'pulse 2s ease-in-out infinite' }}
      />
      <span className="font-code-sm text-secondary tracking-widest" style={{ fontSize: '10px' }}>
        SYSTEM STATUS: OPTIMAL ⚡
      </span>
    </motion.div>
  );
}

// Animated stat pill
function StatPill({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col items-center px-4 py-2 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(0,210,255,0.15)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="font-headline-xl text-secondary font-bold" style={{ fontSize: '20px' }}>{value}</span>
      <span className="font-code-sm text-on-surface-variant uppercase tracking-wider" style={{ fontSize: '9px' }}>{label}</span>
    </motion.div>
  );
}

export default function MobileHero() {
  const { isIOS, shouldReduceAnimations } = useDeviceCapabilities();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const logoX = useTransform(tiltX, [-15, 15], [-12, 12]);
  const logoY = useTransform(tiltY, [-15, 15], [-10, 10]);
  const [gyroEnabled, setGyroEnabled] = useState(false);

  // Gyroscope parallax
  useEffect(() => {
    if (shouldReduceAnimations) return;

    const handleOrientation = (e) => {
      if (e.gamma === null) return;
      // gamma: left/right tilt (-90 to 90), beta: front/back (-180 to 180)
      const clampedGamma = Math.max(-15, Math.min(15, e.gamma));
      const clampedBeta  = Math.max(-15, Math.min(15, (e.beta ?? 0) - 45));
      tiltX.set(clampedGamma);
      tiltY.set(clampedBeta);
      setGyroEnabled(true);
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      // iOS 13+ requires permission
      if (isIOS && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // We don't auto-prompt; gyro activates after the user first interacts
        const tryEnable = async () => {
          try {
            const res = await DeviceOrientationEvent.requestPermission();
            if (res === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          } catch {
            /* permission denied or unsupported — touch fallback handles parallax */
          }
        };
        document.addEventListener('touchstart', tryEnable, { once: true, passive: true });
      } else {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      }
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isIOS, shouldReduceAnimations, tiltX, tiltY]);

  // Touch-based tilt fallback (when no gyro)
  useEffect(() => {
    if (gyroEnabled || shouldReduceAnimations) return;

    const handleTouch = (e) => {
      const touch = e.touches[0];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tiltX.set(((touch.clientX - cx) / cx) * 12);
      tiltY.set(((touch.clientY - cy) / cy) * 10);
    };

    const reset = () => {
      tiltX.set(0);
      tiltY.set(0);
    };

    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', reset, { passive: true });
    return () => {
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', reset);
    };
  }, [gyroEnabled, shouldReduceAnimations, tiltX, tiltY]);

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: '100svh',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <MeshBackground tiltX={tiltX} tiltY={tiltY} />

      <div className="relative z-10 flex flex-col flex-1 px-5 pt-24 pb-32">
        <StatusBadge />

        {/* Logo with parallax */}
        <motion.div
          style={{ x: logoX, y: logoY, willChange: 'transform' }}
          className="self-center mb-6"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className="relative"
            style={{ width: 160, height: 160 }}
          >
            {/* Spinning ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid rgba(0,210,255,0.2)',
                animation: 'spinSlow 18s linear infinite',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: -8,
                border: '1px dashed rgba(229,169,60,0.15)',
                animation: 'spinSlow 30s linear infinite reverse',
                willChange: 'transform',
              }}
            />
            {/* Glow halo */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(229,169,60,0.15) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />
            <img
              src="/logo.png"
              alt="Zeus IoT"
              className="absolute inset-0 w-full h-full object-contain rounded-full"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(229,169,60,0.4)) drop-shadow(0 0 40px rgba(0,210,255,0.15))',
                padding: 16,
              }}
              loading="eager"
            />
            {/* Orbiting dot */}
            <div
              className="absolute"
              style={{
                inset: 0,
                animation: 'spinSlow 6s linear infinite',
                willChange: 'transform',
              }}
            >
              <div
                className="absolute top-0 left-1/2"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#e5a93c',
                  boxShadow: '0 0 10px rgba(229,169,60,0.8)',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-headline-xl text-on-surface uppercase leading-none mb-4 text-center"
          style={{ fontSize: 'clamp(28px, 8vw, 40px)', letterSpacing: '-0.02em' }}
        >
          HARNESS<br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #e5a93c 0%, #ffdf9f 40%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              filter: 'drop-shadow(0 2px 10px rgba(229, 169, 60, 0.35))'
            }}
          >
            THE BOLT
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-body-md text-on-surface-variant text-center mb-7 leading-relaxed"
          style={{ fontSize: 14, maxWidth: 300, alignSelf: 'center' }}
        >
          Custom IoT & Software for College Students.{' '}
          <strong className="text-tertiary font-semibold">Learn, not just buy.</strong>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col gap-3 mb-8"
        >
          <Link
            to="/projects"
            className="btn-thunderbolt font-label-caps uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.96] transition-transform touch-ripple"
            style={{ fontSize: 11, padding: '14px 24px' }}
          >
            <span>EXPLORE PROJECTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={waLink(messages.hero)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('mobile-hero')}
            className="font-label-caps uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.96] transition-transform touch-ripple"
            style={{ fontSize: 11, padding: '13px 24px', borderRadius: 6, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
            CHAT ON WHATSAPP
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-2 justify-center flex-wrap"
        >
          <StatPill value="100+" label="Projects" delay={0.65} />
          <StatPill value="10+"  label="Universities" delay={0.7} />
          <StatPill value="24hr" label="Response" delay={0.75} />
          <StatPill value="99.7%" label="On-Time" delay={0.8} />
        </motion.div>
      </div>

      {/* Scroll hint — sits above the sticky WhatsApp bar + bottom nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 124px)' }}
        aria-hidden="true"
      >
        <span className="font-code-sm text-on-surface-variant" style={{ fontSize: 9 }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spinSlow { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

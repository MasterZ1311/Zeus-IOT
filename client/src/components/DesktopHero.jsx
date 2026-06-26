/**
 * DesktopHero
 * Full-bleed cinematic hero for desktop — 3D tilt logo, magnetic CTAs,
 * live telemetry badges, and multi-layer parallax background.
 */
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Wifi, Activity } from 'lucide-react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

// ── Parallax layer helper ─────────────────────────────────────
function useMouseParallax(sensitivity = 20) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * sensitivity);
      mouseY.set(((e.clientY - cy) / cy) * sensitivity);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [sensitivity, mouseX, mouseY]);

  return { springX, springY };
}

// ── Magnetic button behavior ──────────────────────────────────
function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handlers = {
    onMouseMove(e) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width  / 2) * strength);
      y.set((e.clientY - rect.top  - rect.height / 2) * strength);
    },
    onMouseLeave() {
      x.set(0);
      y.set(0);
    },
  };

  return { ref, x, y, handlers };
}

// ── 3D Tilt Logo — frames the circular emblem as a cinematic medallion ──
function TiltLogo({ springX, springY }) {
  const rotateY = useTransform(springX, [-20, 20], [-14, 14]);
  const rotateX = useTransform(springY, [-20, 20], [10, -10]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 420, height: 420, perspective: 1300, willChange: 'transform' }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
    >
      {/* Soft glow halo */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: 16,
          background: 'radial-gradient(circle at 45% 40%, rgba(229,169,60,0.22) 0%, rgba(0,210,255,0.14) 45%, transparent 72%)',
          filter: 'blur(34px)',
        }}
      />

      {/* Rotating conic sheen ring */}
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: -4,
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(229,169,60,0.55) 14%, transparent 32%, rgba(0,210,255,0.55) 62%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(closest-side, transparent 95%, #000 96.5%)',
          maskImage: 'radial-gradient(closest-side, transparent 95%, #000 96.5%)',
          animation: 'spinSlow 14s linear infinite',
          willChange: 'transform',
        }}
      />

      {/* Static decorative rings */}
      <div aria-hidden="true" className="absolute rounded-full"
        style={{ inset: -16, border: '1px solid rgba(0,210,255,0.14)', animation: 'spinSlow 34s linear infinite', willChange: 'transform' }} />
      <div aria-hidden="true" className="absolute rounded-full"
        style={{ inset: -32, border: '1px dashed rgba(229,169,60,0.12)', animation: 'spinSlow 55s linear infinite reverse', willChange: 'transform' }} />

      {/* 3D-tilting medallion */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <img
          src="/logo.png"
          alt="Zeus IoT"
          className="relative z-10 object-contain"
          style={{
            width: '92%',
            height: '92%',
            transform: 'translateZ(50px)',
            filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.55)) drop-shadow(0 0 40px rgba(229,169,60,0.35)) drop-shadow(0 0 70px rgba(0,210,255,0.18))',
            willChange: 'transform',
          }}
          loading="eager"
        />
      </motion.div>

      {/* Orbiting satellites */}
      <div aria-hidden="true" className="absolute inset-0"
        style={{ animation: 'spinSlow 9s linear infinite', willChange: 'transform' }}>
        <div className="absolute top-0 left-1/2"
          style={{ width: 12, height: 12, borderRadius: '50%', background: '#e5a93c', boxShadow: '0 0 16px rgba(229,169,60,0.9)', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div aria-hidden="true" className="absolute inset-0"
        style={{ animation: 'spinSlow 14s linear infinite reverse', willChange: 'transform' }}>
        <div className="absolute bottom-6 right-8"
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 12px rgba(0,210,255,0.9)' }} />
      </div>

      <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

// ── Live telemetry pill ────────────────────────────────────────
function TelemetryPill({ icon: Icon, label, value, color }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}30`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color }} />
      <span className="font-code-sm text-on-surface-variant" style={{ fontSize: 11 }}>
        {label}: <span style={{ color, fontWeight: 700 }}>{value}</span>
      </span>
    </div>
  );
}

// ── Stat counter card ─────────────────────────────────────────
function StatCard({ value, label, delay }) {
  const [displayed, setDisplayed] = useState('0');
  const num = parseInt(value);

  useEffect(() => {
    let start = 0;
    const step = num / 40;
    const interval = setInterval(() => {
      start += step;
      if (start >= num) {
        setDisplayed(value);
        clearInterval(interval);
      } else {
        setDisplayed(String(Math.floor(start)) + (value.includes('+') ? '+' : value.includes('%') ? '%' : ''));
      }
    }, 30);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center p-4 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,210,255,0.1)',
        borderTop: '2px solid rgba(0,210,255,0.4)',
        minWidth: 100,
      }}
    >
      <div className="font-headline-xl text-secondary" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800 }}>
        {displayed}
      </div>
      <div className="font-code-sm text-on-surface-variant uppercase tracking-wider mt-1" style={{ fontSize: 10 }}>
        {label}
      </div>
    </motion.div>
  );
}

export default function DesktopHero() {
  const { shouldReduceAnimations } = useDeviceCapabilities();
  const { springX, springY } = useMouseParallax(shouldReduceAnimations ? 0 : 18);
  const { ref: primaryRef, x: primaryX, y: primaryY, handlers: primaryHandlers } = useMagnetic(0.25);
  const { ref: ghostRef,   x: ghostX,   y: ghostY,   handlers: ghostHandlers }   = useMagnetic(0.25);

  // Parallax offsets for background layers
  const layer1X = useTransform(springX, v => v * -0.5);
  const layer1Y = useTransform(springY, v => v * -0.5);
  const layer2X = useTransform(springX, v => v * 0.3);
  const layer2Y = useTransform(springY, v => v * 0.3);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Parallax background layers */}
      <motion.div
        aria-hidden="true"
        style={{ x: layer1X, y: layer1Y, willChange: 'transform' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute"
          style={{
            top: '-25%', left: '-15%',
            width: '80vw', height: '80vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x: layer2X, y: layer2Y, willChange: 'transform' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute"
          style={{
            bottom: '-20%', right: '-10%',
            width: '60vw', height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229,169,60,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '40%', left: '45%',
            width: '30vw', height: '30vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,70,239,0.04) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Content grid */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-16 grid grid-cols-12 gap-8 items-center py-32">

        {/* Left: text content */}
        <div className="col-span-7 flex flex-col">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 w-max mb-7"
            style={{
              background: 'rgba(229,169,60,0.08)',
              border: '1px solid rgba(229,169,60,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full bg-secondary"
              style={{ boxShadow: '0 0 8px rgba(229,169,60,0.8)', animation: 'pulse 2s ease-in-out infinite' }}
            />
            <span className="font-code-sm text-secondary tracking-widest" style={{ fontSize: 11 }}>
              SYSTEM STATUS: OPTIMAL ⚡
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-headline-xl text-on-surface uppercase mb-6"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            HARNESS THE BOLT:<br />
            <span
              className="text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #e5a93c 0%, #f9bd22 40%, #00d2ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CUSTOM IOT &amp; SOFTWARE
            </span>
            <br />FOR THE NEXT GEN
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="font-body-lg text-on-surface-variant mb-8 leading-relaxed"
            style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', maxWidth: 560 }}
          >
            We architect raw power and precise engineering — from atmospheric sensor arrays to
            enterprise software ecosystems.{' '}
            <strong className="text-tertiary font-semibold">Don't just buy from us — Learn from us.</strong>
          </motion.p>

          {/* Telemetry strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 mb-8 flex-wrap"
          >
            <TelemetryPill icon={Wifi}     label="UPTIME"   value="99.98%"  color="#00d2ff" />
            <TelemetryPill icon={Activity} label="LATENCY"  value="12ms"    color="#e5a93c" />
            <TelemetryPill icon={Cpu}      label="PROJECTS" value="100+"    color="#d946ef" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-4 mb-12"
          >
            <motion.div ref={primaryRef} style={{ x: primaryX, y: primaryY }} {...primaryHandlers}>
              <Link
                to="/projects"
                className="btn-thunderbolt font-label-caps uppercase tracking-widest flex items-center gap-2"
                style={{ fontSize: 12, padding: '16px 32px' }}
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div ref={ghostRef} style={{ x: ghostX, y: ghostY }} {...ghostHandlers}>
              <a
                href={waLink(messages.hero)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsApp('desktop-hero')}
                className="font-label-caps uppercase tracking-widest flex items-center gap-2 rounded-sm"
                style={{ fontSize: 12, padding: '15px 32px', color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                CHAT ON WHATSAPP
              </a>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <div className="flex gap-4 flex-wrap">
            <StatCard value="100+" label="Projects Delivered" delay={0.6} />
            <StatCard value="10+"  label="Universities Served" delay={0.65} />
            <StatCard value="99.7%" label="On-Time Delivery" delay={0.7} />
            <StatCard value="24hr" label="Response Time" delay={0.75} />
          </div>
        </div>

        {/* Right: 3D logo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="col-span-5 flex items-center justify-center"
        >
          <TiltLogo springX={springX} springY={springY} />
        </motion.div>
      </div>
    </section>
  );
}

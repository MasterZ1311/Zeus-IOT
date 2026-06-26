/**
 * DesktopHero — desktop-only cinematic hero (never loaded on mobile).
 * Clean, confident, spacious: a bold editorial headline on the left and a grand
 * floating emblem medallion on the right, over a parallax-reactive backdrop.
 */
import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Crosshair, GraduationCap } from 'lucide-react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

// ── Mouse parallax ────────────────────────────────────────────
function useMouseParallax(sensitivity = 16) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(((e.clientX - cx) / cx) * sensitivity);
      mouseY.set(((e.clientY - cy) / cy) * sensitivity);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [sensitivity, mouseX, mouseY]);

  return { springX, springY };
}

// ── Magnetic buttons ──────────────────────────────────────────
function useMagnetic(strength = 0.25) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const handlers = {
    onMouseMove(e) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    },
    onMouseLeave() { x.set(0); y.set(0); },
  };
  return { ref, x, y, handlers };
}

// ── Emblem medallion ──────────────────────────────────────────
function TiltLogo({ springX, springY }) {
  const rotateY = useTransform(springX, [-16, 16], [-13, 13]);
  const rotateX = useTransform(springY, [-16, 16], [9, -9]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 'min(34vw, 480px)', aspectRatio: '1', perspective: 1300, willChange: 'transform' }}
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
    >
      {/* glow halo */}
      <div aria-hidden="true" className="absolute rounded-full"
        style={{ inset: 14, background: 'radial-gradient(circle at 45% 40%, rgba(229,169,60,0.24) 0%, rgba(0,210,255,0.15) 45%, transparent 72%)' }} />

      {/* rotating conic sheen ring */}
      <div aria-hidden="true" className="absolute rounded-full"
        style={{
          inset: -4,
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(229,169,60,0.6) 14%, transparent 32%, rgba(0,210,255,0.6) 62%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(closest-side, transparent 95%, #000 96.5%)',
          maskImage: 'radial-gradient(closest-side, transparent 95%, #000 96.5%)',
          animation: 'spinSlow 16s linear infinite', willChange: 'transform',
        }} />

      {/* static rings */}
      <div aria-hidden="true" className="absolute rounded-full"
        style={{ inset: -18, border: '1px solid rgba(0,210,255,0.14)', animation: 'spinSlow 38s linear infinite', willChange: 'transform' }} />
      <div aria-hidden="true" className="absolute rounded-full"
        style={{ inset: -36, border: '1px dashed rgba(229,169,60,0.12)', animation: 'spinSlow 60s linear infinite reverse', willChange: 'transform' }} />

      {/* tilting emblem */}
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
        className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative z-10 rounded-full overflow-hidden"
          style={{
            width: '94%',
            aspectRatio: '1',
            transform: 'translateZ(55px)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.55), 0 0 44px rgba(229,169,60,0.35), 0 0 80px rgba(0,210,255,0.18)',
            willChange: 'transform',
          }}
        >
          <img src="/logo.png" alt="Zeus IoT" loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* orbiting satellites */}
      <div aria-hidden="true" className="absolute inset-0" style={{ animation: 'spinSlow 9s linear infinite', willChange: 'transform' }}>
        <div className="absolute top-0 left-1/2" style={{ width: 12, height: 12, borderRadius: '50%', background: '#e5a93c', boxShadow: '0 0 16px rgba(229,169,60,0.9)', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div aria-hidden="true" className="absolute inset-0" style={{ animation: 'spinSlow 14s linear infinite reverse', willChange: 'transform' }}>
        <div className="absolute bottom-6 right-8" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 12px rgba(0,210,255,0.9)' }} />
      </div>

      <style>{`@keyframes spinSlow { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

const VALUE_PROPS = [
  { icon: ShieldCheck, label: 'Transparent builds' },
  { icon: Crosshair,   label: 'Production-grade' },
  { icon: GraduationCap, label: 'Viva-ready' },
];

export default function DesktopHero() {
  const { shouldReduceAnimations } = useDeviceCapabilities();
  const { springX, springY } = useMouseParallax(shouldReduceAnimations ? 0 : 24);
  const { ref: primaryRef, x: primaryX, y: primaryY, handlers: primaryHandlers } = useMagnetic(0.25);
  const { ref: ghostRef,   x: ghostX,   y: ghostY,   handlers: ghostHandlers }   = useMagnetic(0.25);

  const layer1X = useTransform(springX, v => v * -1.2);
  const layer1Y = useTransform(springY, v => v * -1.2);
  const layer2X = useTransform(springX, v => v * 0.8);
  const layer2Y = useTransform(springY, v => v * 0.8);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* Parallax background glows */}
      <motion.div aria-hidden="true" style={{ x: layer1X, y: layer1Y, willChange: 'transform' }} className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ top: '-28%', left: '-12%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,210,255,0.09) 0%, transparent 70%)' }} />
      </motion.div>
      <motion.div aria-hidden="true" style={{ x: layer2X, y: layer2Y, willChange: 'transform' }} className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ bottom: '-25%', right: '-12%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,169,60,0.08) 0%, transparent 70%)' }} />
        <div className="absolute" style={{ top: '35%', left: '48%', width: '28vw', height: '28vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 70%)' }} />
      </motion.div>

      {/* Content — aligned to the same 1280px / px-16 grid as the sections below */}
      <div className="relative z-10 w-full mx-auto grid lg:grid-cols-2 items-center gap-12 lg:gap-16 px-6 md:px-16"
        style={{ maxWidth: 1280, paddingTop: 120, paddingBottom: 120 }}>

        {/* Left — editorial */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 w-max mb-8"
            style={{ background: 'rgba(229,169,60,0.08)', border: '1px solid rgba(229,169,60,0.3)', backdropFilter: 'blur(8px)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" style={{ boxShadow: '0 0 8px rgba(229,169,60,0.8)', animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="font-code-sm text-secondary tracking-[0.2em]" style={{ fontSize: 11 }}>SYSTEM STATUS: OPTIMAL ⚡</span>
          </motion.div>

          {/* Big editorial headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7, ease }}
            className="font-headline-xl text-on-surface uppercase mb-7"
            style={{ fontSize: 'clamp(52px, 6.4vw, 92px)', lineHeight: 0.96, letterSpacing: '-0.03em' }}>
            HARNESS<br />
            <span className="text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #e5a93c 0%, #ffdf9f 38%, #00d2ff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 20px rgba(229, 169, 60, 0.3))' }}>
              THE BOLT
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.6, ease }}
            className="font-body-lg text-on-surface-variant mb-9 leading-relaxed"
            style={{ fontSize: 'clamp(16px, 1.25vw, 20px)', maxWidth: 520 }}>
            Custom IoT &amp; software, forged for the next generation of engineers.{' '}
            <strong className="text-tertiary font-semibold">Don't just buy from us — learn from us.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.5, ease }}
            className="flex gap-4 mb-10">
            <motion.div ref={primaryRef} style={{ x: primaryX, y: primaryY }} {...primaryHandlers}>
              <Link to="/projects" className="btn-thunderbolt font-label-caps uppercase tracking-widest flex items-center gap-2"
                style={{ fontSize: 13, padding: '18px 38px' }}>
                <span>EXPLORE PROJECTS</span><ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div ref={ghostRef} style={{ x: ghostX, y: ghostY }} {...ghostHandlers}>
              <a href={waLink(messages.hero)} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp('desktop-hero')}
                className="font-label-caps uppercase tracking-widest flex items-center gap-2 rounded-sm active:scale-95 transition-all hover:scale-105"
                style={{ fontSize: 13, padding: '17px 38px', color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)', ':hover': { boxShadow: '0 8px 24px rgba(37,211,102,0.6)' } }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                CHAT ON WHATSAPP
              </a>
            </motion.div>
          </motion.div>

          {/* Value-prop strip (honest, no invented stats) */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-6 flex-wrap">
            {VALUE_PROPS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-secondary" />
                <span className="font-code-sm text-on-surface-variant" style={{ fontSize: 12, letterSpacing: '0.04em' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9, ease }}
          className="flex items-center justify-center">
          <TiltLogo springX={springX} springY={springY} />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ bottom: 28 }} aria-hidden="true">
        <span className="font-code-sm text-on-surface-variant tracking-[0.3em]" style={{ fontSize: 9 }}>SCROLL</span>
        <div style={{ width: 1, height: 34, background: 'linear-gradient(to bottom, rgba(229,169,60,0.6), transparent)' }} />
      </motion.div>
    </section>
  );
}

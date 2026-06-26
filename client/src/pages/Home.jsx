import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Cpu, Monitor, Wifi, Activity, Thermometer, Zap, Code, Bot, FileText, ArrowRight } from 'lucide-react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import Product3DViewer from '../components/Product3DViewer';
import ProjectVisual from '../components/ProjectVisual';
import CodeOfOlympus from '../components/CodeOfOlympus';
import { PROJECTS } from '../data/projects';
import { waLink, trackWhatsApp, messages, openWhatsApp } from '../config/whatsapp';

// Lazy-load heavy hero components — desktop hero pulls in framer-motion mouse logic
// only when actually on a desktop, keeping mobile bundle lean.
const MobileHero   = lazy(() => import('../components/MobileHero'));
const DesktopHero  = lazy(() => import('../components/DesktopHero'));

// ── Shared section reveal wrapper ────────────────────────────
function RevealSection({ children, className = '' }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden:  { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ── Tech tag chip ─────────────────────────────────────────────
function TechTag({ label, color = 'tertiary' }) {
  const colors = {
    tertiary: 'bg-sky-400/10 border-sky-400/20 text-sky-400',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
  };
  return (
    <span className={`px-3 py-1 rounded text-xs font-code-sm border ${colors[color]}`}>
      {label}
    </span>
  );
}

// ── IoT Sandbox widget ────────────────────────────────────────
function IoTSandbox() {
  const [relayActive, setRelayActive] = useState(false);
  const [uptime, setUptime]           = useState(0);
  const [cpuLoad, setCpuLoad]         = useState(12);
  const [temp, setTemp]               = useState(42.5);

  useEffect(() => {
    const t = setInterval(() => setUptime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const tb = relayActive ? 68.2 : 42.5;
      const lb = relayActive ? 85 : 12;
      setCpuLoad(Math.floor(lb + (Math.random() * 4 - 2)));
      setTemp(parseFloat((tb + (Math.random() * 0.8 - 0.4)).toFixed(1)));
    }, 2000);
    return () => clearInterval(t);
  }, [relayActive]);

  const fmt = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sc = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sc}`;
  };

  const active = relayActive;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-2xl relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3 mb-4">
        <div className="font-code-sm text-sm text-on-surface font-bold tracking-widest flex items-center gap-2">
          <Wifi className="w-4 h-4 text-sky-400 animate-pulse" />
          ESP32_CORE_01
        </div>
        <div className="font-code-sm text-xs text-tertiary font-bold">
          UPTIME: {fmt(uptime)}
        </div>
      </div>

      {/* Meters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: Thermometer, label: 'Core Temp', value: `${temp}°C` },
          { icon: Activity,    label: 'CPU Load',  value: `${cpuLoad}%` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-3 rounded-lg border text-center transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderColor: active ? 'rgba(0,210,255,0.35)' : 'rgba(255,255,255,0.05)',
              boxShadow: active ? '0 0 15px rgba(0,210,255,0.1)' : 'none',
            }}
          >
            <div className="flex items-center justify-center gap-1 text-on-surface-variant mb-1.5" style={{ fontSize: 10 }}>
              <Icon className="w-3.5 h-3.5 text-secondary" />
              <span className="font-label-caps uppercase">{label}</span>
            </div>
            <div
              className="font-headline-md text-xl transition-all duration-300"
              style={{ color: active ? '#e5a93c' : 'var(--color-on-surface)', fontWeight: active ? 700 : 400 }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Relay toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-lg border transition-all duration-300"
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderColor: active ? 'rgba(0,210,255,0.5)' : 'rgba(255,255,255,0.08)',
          boxShadow: active ? '0 0 20px rgba(0,210,255,0.12)' : 'none',
        }}
      >
        <div>
          <div className="font-label-caps text-xs text-on-surface uppercase font-bold flex items-center gap-1.5 mb-0.5">
            <Zap className={`w-3.5 h-3.5 ${active ? 'text-secondary animate-bounce' : 'text-on-surface-variant'}`} />
            Main Relay Power
          </div>
          <div className="font-code-sm text-[10px] text-on-surface-variant">Controls physical hardware state</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={relayActive}
            onChange={e => setRelayActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
        </label>
      </div>
    </div>
  );
}

// ── Core Capabilities section ─────────────────────────────────
function CoreCapabilities() {
  const { isDesktop } = useDeviceCapabilities();

  return (
    <RevealSection className="mt-20 md:mt-32">
      <h2 className="font-headline-lg text-on-surface mb-10 flex items-center gap-4 px-4 md:px-16 max-w-[1280px] mx-auto"
        style={{ fontSize: 'clamp(22px, 3.6vw, 46px)' }}>
        <span className="w-8 h-1 bg-secondary flex-shrink-0" />
        CORE CAPABILITIES
      </h2>

      <div
        className={`grid px-4 md:px-16 max-w-[1280px] mx-auto gap-5 mb-8`}
        style={{ gridTemplateColumns: isDesktop ? 'repeat(12, 1fr)' : '1fr' }}
      >
        {/* Hardware card */}
        <motion.div
          whileHover={isDesktop ? { scale: 1.02, y: -6 } : {}}
          whileTap={{ scale: 0.98 }}
          className="glass-panel bolt-standby rounded-xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
          style={isDesktop ? { gridColumn: 'span 7', gridRow: 'span 2', minHeight: 300 } : {}}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)' }} />

          <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center mb-5 border border-sky-400/30 flex-shrink-0">
            <Cpu className="text-sky-400 w-6 h-6" />
          </div>
          <h3 className="font-headline-md text-on-surface mb-3 z-10" style={{ fontSize: 'clamp(18px, 2.2vw, 28px)' }}>
            Custom Hardware &amp; IoT
          </h3>
          <p className="font-body-lg text-on-surface-variant z-10 mb-5 flex-grow leading-relaxed"
            style={{ fontSize: 'clamp(14px, 1.4vw, 18px)', maxWidth: 480 }}>
            Bespoke sensor networks, microcontroller boards, and final-year IoT prototype modules.
            Built to satisfy rigorous university engineering rubrics.
          </p>
          <div className="flex gap-2 z-10 mt-auto flex-wrap">
            {['ESP32', 'Arduino', 'Raspberry Pi', 'Nvidia Jetson', 'Orange Pi', 'Radxa X4'].map(t => (
              <TechTag key={t} label={t} color="tertiary" />
            ))}
          </div>
        </motion.div>

        {/* Software card */}
        <motion.div
          whileHover={isDesktop ? { scale: 1.02, y: -6 } : {}}
          whileTap={{ scale: 0.98 }}
          className="glass-panel bolt-active rounded-xl p-6 md:p-8 flex flex-col group relative overflow-hidden"
          style={isDesktop ? { gridColumn: 'span 5', gridRow: 'span 2' } : {}}
        >
          <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, rgba(229,169,60,0.08) 0%, transparent 70%)' }} />

          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-5 border border-secondary/30 flex-shrink-0">
            <Monitor className="text-secondary w-6 h-6" />
          </div>
          <h3 className="font-headline-md text-on-surface mb-3 z-10" style={{ fontSize: 'clamp(18px, 2.2vw, 28px)' }}>
            Software Engineering
          </h3>
          <p className="font-body-md text-on-surface-variant z-10 mb-5 flex-grow leading-relaxed"
            style={{ fontSize: 'clamp(13px, 1.3vw, 17px)' }}>
            Tailored full-stack applications, secure cloud platforms, and high-performance database architectures.
          </p>
          <div className="flex gap-2 z-10 mt-auto flex-wrap">
            {['Python', 'React', 'Node.js', 'MongoDB', 'AWS', 'Django'].map(t => (
              <TechTag key={t} label={t} color="secondary" />
            ))}
          </div>
        </motion.div>
      </div>
    </RevealSection>
  );
}

// ── Sandbox section ────────────────────────────────────────────
function SandboxSection() {
  return (
    <RevealSection className="mt-16 md:mt-24 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div
        className="glass-panel bolt-active rounded-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(229,169,60,0.04) 0%, rgba(0,210,255,0.04) 100%)' }}
        />

        <div className="z-10 lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/30 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-code-sm text-secondary tracking-widest" style={{ fontSize: 11 }}>LIVE DEMO</span>
          </div>
          <h3 className="font-headline-md text-on-surface mb-3" style={{ fontSize: 'clamp(20px, 3vw, 40px)' }}>
            Interactive IoT Sandbox
          </h3>
          <p className="font-body-md text-on-surface-variant leading-relaxed" style={{ fontSize: 'clamp(13px, 1.1vw, 15px)' }}>
            Toggle the relay switch and watch the telemetry meters react in real-time.
            This is the caliber of software we ship with every hardware node.
          </p>
        </div>

        <div className="z-10 lg:w-1/2 w-full">
          <IoTSandbox />
        </div>
      </div>
    </RevealSection>
  );
}

// ── How It Works ──────────────────────────────────────────────
const STEPS = [
  { num: '01', icon: '💬', title: 'Reach Out', desc: 'Tap any button to message us on WhatsApp with your idea — pre-filled and ready.', color: '#e5a93c' },
  { num: '02', icon: '🔍', title: 'Review',    desc: 'We reply fast with a clear plan, timeline, and an honest quote.',              color: '#00d2ff' },
  { num: '03', icon: '⚙️', title: 'Build',     desc: 'We fabricate, code, and test with milestone-based updates.',                  color: '#e5a93c' },
  { num: '04', icon: '🚀', title: 'Deliver',   desc: 'Full delivery with docs, walkthrough, and viva prep included.',               color: '#00d2ff' },
];

function HowItWorks() {
  return (
    <RevealSection className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="text-center mb-12">
        <span className="font-code-sm text-secondary uppercase tracking-widest" style={{ fontSize: 11 }}>THE PROCESS</span>
        <h2 className="font-headline-lg text-on-surface mt-2" style={{ fontSize: 'clamp(22px, 3.6vw, 46px)' }}>
          How It Works
        </h2>
        <p className="font-body-md text-on-surface-variant mt-2" style={{ fontSize: 14 }}>
          From idea to ignition — four simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="glass-panel rounded-xl p-6 lg:p-8 flex flex-col items-center text-center relative overflow-hidden"
            style={{ borderTop: `2px solid ${step.color}` }}
          >
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${step.color}08 0%, transparent 70%)` }}
            />
            {/* desktop-only watermark step number */}
            <span className="hidden lg:block absolute -top-3 right-3 font-headline-xl pointer-events-none select-none"
              style={{ fontSize: 96, lineHeight: 1, color: step.color, opacity: 0.08 }} aria-hidden="true">
              {step.num}
            </span>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl"
              style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
            >
              {step.icon}
            </div>
            <div className="font-code-sm text-xs mb-2 uppercase tracking-wider" style={{ color: step.color }}>
              {step.num}
            </div>
            <h3 className="font-headline-md text-on-surface mb-2" style={{ fontSize: 'clamp(16px, 1.5vw, 21px)' }}>
              {step.title}
            </h3>
            <p className="font-body-md text-on-surface-variant text-sm leading-relaxed lg:text-base">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </RevealSection>
  );
}

// ── Preloader ─────────────────────────────────────────────────
function HomePreloader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="home-preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#070c1e' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'rgba(0,210,255,0.06)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'rgba(229,169,60,0.06)', filter: 'blur(60px)' }} />
      </div>

      <motion.img
        src="/logo-loader.png"
        onError={(e) => { e.currentTarget.src = '/logo.png'; }}
        alt="Zeus IoT"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative z-10 object-contain"
        style={{
          width: 'clamp(170px, 42vw, 300px)',
          height: 'clamp(170px, 42vw, 300px)',
          filter: 'drop-shadow(0 0 60px rgba(0,210,255,0.3)) drop-shadow(0 0 30px rgba(229,169,60,0.25))',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6 relative z-10 text-center"
      >
        <div className="font-headline-xl text-secondary tracking-[0.3em] uppercase"
          style={{ fontSize: 'clamp(20px, 5vw, 32px)', textShadow: '0 0 20px rgba(255,198,64,0.4)' }}>
          ZEUS IOT
        </div>
        <div className="font-code-sm text-on-surface-variant tracking-[0.25em] mt-2 uppercase" style={{ fontSize: 11 }}>
          Initialising Systems...
        </div>
      </motion.div>

      <motion.div
        className="mt-10 relative z-10 overflow-hidden rounded-full"
        style={{ width: 'clamp(160px, 40vw, 240px)', height: 2, background: 'rgba(255,255,255,0.08)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #e5a93c, #00d2ff)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.65, duration: 1.0, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Quick-start launcher: tap a type → WhatsApp ───────────────
const QUICK_TYPES = [
  { label: 'IoT / Hardware', icon: Cpu,      color: '#00d2ff', msg: 'Custom IoT / Hardware' },
  { label: 'Software / App', icon: Code,     color: '#e5a93c', msg: 'Software / Web App' },
  { label: 'AI / Edge ML',   icon: Bot,      color: '#d946ef', msg: 'AI / Edge ML' },
  { label: 'Academic Report',icon: FileText, color: '#e5a93c', msg: 'Academic Report' },
];

function QuickStart() {
  return (
    <RevealSection className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="text-center mb-10">
        <span className="font-code-sm text-secondary uppercase tracking-widest" style={{ fontSize: 11 }}>⚡ START IN ONE TAP</span>
        <h2 className="font-headline-lg text-on-surface mt-2" style={{ fontSize: 'clamp(22px,3.6vw,46px)' }}>
          What do you want built?
        </h2>
        <p className="font-body-md text-on-surface-variant mt-2" style={{ fontSize: 14 }}>
          Pick one — we'll open WhatsApp ready to chat.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_TYPES.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openWhatsApp(messages.quickType(t.msg), `quickstart:${t.msg}`)}
              className="glass-panel rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center group relative overflow-hidden"
              style={{ borderTop: `2px solid ${t.color}` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${t.color}14 0%, transparent 70%)` }} />
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${t.color}1a`, border: `1px solid ${t.color}40` }}>
                <Icon className="w-7 h-7" style={{ color: t.color }} />
              </div>
              <div className="font-headline-md text-on-surface" style={{ fontSize: 'clamp(15px, 1.4vw, 19px)' }}>{t.label}</div>
              <span className="font-code-sm text-on-surface-variant mt-2 flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontSize: 10 }}>
                START <ArrowRight className="w-3 h-3" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </RevealSection>
  );
}

// ── 3D Showcase section ───────────────────────────────────────
function Showcase3D() {
  return (
    <RevealSection className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="glass-panel bolt-standby rounded-2xl p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(0,210,255,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <span className="font-code-sm text-tertiary uppercase tracking-widest" style={{ fontSize: 11 }}>⚡ ENGINEERED IN 3D</span>
          <h2 className="font-headline-lg text-on-surface mt-3 mb-4" style={{ fontSize: 'clamp(24px,4vw,50px)' }}>
            We design the <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#e5a93c,#00d2ff)', WebkitBackgroundClip: 'text' }}>real thing</span>.
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed" style={{ fontSize: 'clamp(14px,1.2vw,16px)' }}>
            Every board, every enclosure, every dashboard — engineered to production standard.
            Spin the module to get a feel for the detail we ship with each build.
          </p>
          <a
            href={waLink(messages.generic)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('showcase-3d')}
            className="inline-flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest px-7 py-3.5"
            style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
          >
            Discuss your build <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="relative z-10">
          <Product3DViewer />
        </div>
      </div>
    </RevealSection>
  );
}

// ── Featured projects preview ─────────────────────────────────
function FeaturedProjects() {
  const featured = PROJECTS.slice(0, 3);
  return (
    <RevealSection className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="font-code-sm text-secondary uppercase tracking-widest" style={{ fontSize: 11 }}>⚡ RECENT WORK</span>
          <h2 className="font-headline-lg text-on-surface mt-2" style={{ fontSize: 'clamp(22px,3.6vw,46px)' }}>Featured Builds</h2>
        </div>
        <Link to="/projects" className="font-label-caps text-xs text-tertiary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((p, i) => (
          <motion.a
            key={p.id}
            href={waLink(messages.project(p.title, p.cat))}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp(`featured:${p.title}`)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group glass-panel rounded-2xl overflow-hidden block relative"
            style={{ borderTop: `2px solid ${p.accent}` }}
          >
            <ProjectVisual project={p} height={180} className="rounded-t-2xl" />
            <div className="p-5 lg:p-6">
              <h3 className="font-headline-md text-lg lg:text-2xl text-on-surface mb-1 group-hover:text-secondary transition-colors">{p.title}</h3>
              <p className="font-body-md text-sm lg:text-base text-on-surface-variant leading-relaxed">{p.subtitle}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </RevealSection>
  );
}

// ── Final conversion band ─────────────────────────────────────
function FinalCTA() {
  return (
    <RevealSection className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto">
      <div className="glass-panel glass-panel-glow rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(229,169,60,0.1) 0%, transparent 60%)' }} />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="font-headline-xl text-on-surface uppercase mb-4" style={{ fontSize: 'clamp(26px,4.6vw,64px)', letterSpacing: '-0.02em' }}>
            Got an idea? <br className="md:hidden" />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#e5a93c,#00d2ff)', WebkitBackgroundClip: 'text' }}>Let's make it real.</span>
          </h2>
          <p className="font-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto" style={{ fontSize: 'clamp(14px,1.5vw,22px)' }}>
            One message is all it takes. Tell us what you're thinking and we'll take it from there.
          </p>
          <a
            href={waLink(messages.generic)}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('final-cta')}
            className="inline-flex items-center gap-2.5 font-label-caps uppercase tracking-widest px-10 py-5"
            style={{ fontSize: 14, borderRadius: 14, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 6px 28px rgba(37,211,102,0.45)' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </RevealSection>
  );
}

// ── Main export ───────────────────────────────────────────────
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

      {/* Device-specific hero — lazy loaded so each platform only pays for its bundle */}
      <Suspense fallback={<div className="min-h-screen" />}>
        {isMobile ? <MobileHero /> : <DesktopHero />}
      </Suspense>

      {/* Shared sections below the fold */}
      <div className="pb-8">
        <QuickStart />
        <CoreCapabilities />
        <Showcase3D />
        <FeaturedProjects />
        <SandboxSection />
        <HowItWorks />
        <CodeOfOlympus />
        <FinalCTA />
      </div>
    </div>
  );
}

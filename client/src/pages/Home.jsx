import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Monitor, Wifi, Activity, Thermometer, Zap } from 'lucide-react';

export default function Home() {
  const [preloading, setPreloading] = useState(true);
  const [relayActive, setRelayActive] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [temp, setTemp] = useState(42.5);

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(uptimeInterval);
  }, []);

  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      const tempBase = relayActive ? 68.2 : 42.5;
      const loadBase = relayActive ? 85 : 12;

      setCpuLoad(Math.floor(loadBase + (Math.random() * 4 - 2)));
      setTemp(parseFloat((tempBase + (Math.random() * 0.8 - 0.4)).toFixed(1)));
    }, 2000);

    return () => clearInterval(telemetryInterval);
  }, [relayActive]);

  const handleRelayToggle = (e) => {
    const active = e.target.checked;
    setRelayActive(active);
    
    const tempBase = active ? 68.2 : 42.5;
    const loadBase = active ? 85 : 12;
    setCpuLoad(Math.floor(loadBase + (Math.random() * 4 - 2)));
    setTemp(parseFloat((tempBase + (Math.random() * 0.8 - 0.4)).toFixed(1)));
  };

  const formatUptime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="relative">
      {/* Home-page-only preloader overlay */}
      <AnimatePresence>
        {preloading && <HomePreloader onDone={() => setPreloading(false)} />}
      </AnimatePresence>

      <ParticlesBackground />
      

      {/* ── HERO BANNER ────────────────────────────────────────── */}

      {/* PC: Full-bleed banner with text overlaid at bottom */}
      <section className="hidden lg:block w-full relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full relative overflow-hidden"
          style={{ maxHeight: '75vh' }}
        >
          <img
            src="/digital_olympus.jpg"
            className="w-full object-cover object-center"
            style={{ display: 'block', maxHeight: '75vh', objectFit: 'cover' }}
            alt="Command the Digital Olympus"
          />
          {/* Gradient overlay so text reads on the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0A] via-[#080A0A]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080A0A]/60 via-transparent to-transparent pointer-events-none" />

          {/* Overlaid hero text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 px-16 pb-14 max-w-[1280px]"
          >
            <div className="inline-flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm border border-outline-variant/30 rounded-full px-4 py-1.5 w-max mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(255,198,64,0.6)]"></div>
              <span className="font-code-sm text-xs text-secondary">SYSTEM STATUS: OPTIMAL</span>
            </div>

            <h1 className="font-headline-xl text-5xl xl:text-6xl text-white mb-5 leading-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              HARNESS THE BOLT:<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">CUSTOM IOT & SOFTWARE</span><br/>
              FOR THE NEXT GEN
            </h1>

            <p className="font-body-lg text-base text-white/80 max-w-2xl mb-7 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              We architect raw power and precise engineering. From atmospheric sensor arrays to complex enterprise software ecosystems, we build the infrastructure that electrifies modern industry.{' '}
              <strong className="text-emerald-400">Don't just buy from us — Learn from us.</strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-thunderbolt font-label-caps text-xs px-8 py-4 uppercase tracking-widest flex items-center gap-2 active:scale-95">
                <span>EXPLORE PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-ghost font-label-caps text-xs px-8 py-4 uppercase tracking-widest active:scale-95 rounded">
                GET IN TOUCH
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile: stacked text then image */}
      <section className="lg:hidden px-4 mb-16 z-10 relative pt-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <div className="inline-flex items-center gap-2 bg-surface-container-high border border-outline-variant/30 rounded-full px-4 py-1.5 w-max mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(255,198,64,0.6)]"></div>
            <span className="font-code-sm text-xs text-secondary">SYSTEM STATUS: OPTIMAL</span>
          </div>
          <h1 className="font-headline-xl text-3xl text-on-surface mb-4 leading-tight uppercase">
            HARNESS THE BOLT:<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">CUSTOM IOT & SOFTWARE</span><br/>
            FOR THE NEXT GEN
          </h1>
          <p className="font-body-lg text-base text-on-surface-variant max-w-xl mb-6">
            We architect raw power and precise engineering. From atmospheric sensor arrays to enterprise software ecosystems, we build the infrastructure that electrifies modern industry.{' '}
            <strong className="text-emerald-500">Don't just buy from us — Learn from us.</strong>
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/projects" className="btn-thunderbolt font-label-caps text-xs px-6 py-3 uppercase tracking-widest flex items-center gap-2 active:scale-95">
              <span>EXPLORE PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-ghost font-label-caps text-xs px-6 py-3 uppercase tracking-widest active:scale-95 rounded">
              GET IN TOUCH
            </Link>
          </div>
          {/* Mobile image card */}
          <div className="glass-panel bolt-active rounded-xl overflow-hidden w-full">
            <img src="/digital_olympus.jpg" className="w-full h-auto" alt="Command the Digital Olympus" />
          </div>
        </motion.div>
      </section>


      {/* Core Capabilities */}
      <RevealSection>
        <h2 className="font-headline-lg text-3xl text-on-surface mb-12 flex items-center gap-4 px-4 md:px-16 max-w-[1280px] mx-auto">
          <span className="w-8 h-1 bg-secondary"></span>
          CORE CAPABILITIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[250px] px-4 md:px-16 max-w-[1280px] mx-auto mb-8">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="md:col-span-7 md:row-span-2 glass-panel bolt-standby rounded-xl p-8 flex flex-col group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/30">
              <Cpu className="text-emerald-500 w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface mb-4 z-10">Custom Hardware & IoT</h3>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-md z-10 mb-6 flex-grow">
              We design and fabricate bespoke sensor networks, microcontroller boards, and final-year IoT prototype modules. Built to satisfy rigorous university engineering rubrics.
            </p>
            <div className="flex gap-2 z-10 mt-auto flex-wrap">
              {['ESP32', 'Arduino', 'Raspberry Pi', 'Nvidia Jetson', 'Orange Pi', 'Banana Pi', 'Radxa X4', 'Asus Tinker Board', 'LattePanda'].map(t => (
                <span key={t} className="bg-surface-container-high px-3 py-1 rounded text-xs font-code-sm text-emerald-500 border border-tertiary/20">{t}</span>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="md:col-span-5 md:row-span-2 glass-panel bolt-active rounded-xl p-8 flex flex-col group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/30">
              <Monitor className="text-secondary w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface mb-4 z-10">Software Engineering</h3>
            <p className="font-body-md text-base text-on-surface-variant z-10 mb-6 flex-grow">
              Tailored full-stack applications, secure cloud platforms, custom automation systems, and high-performance database architectures.
            </p>
            <div className="flex gap-2 z-10 mt-auto flex-wrap">
              {['Python', 'JavaScript', 'C++', 'MongoDB', 'AWS', 'React', 'Angular', 'Node.js', 'Django'].map(t => (
                <span key={t} className="bg-surface-container-high px-3 py-1 rounded text-xs font-code-sm text-secondary border border-secondary/20">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Interactive IoT Sandbox */}
        <div className="px-4 md:px-16 max-w-[1280px] mx-auto mt-12">
          <div className="glass-panel bolt-active rounded-xl p-8 flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-tertiary/5 pointer-events-none"></div>
            
            <div className="z-10 lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/30 rounded-full mb-4">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="font-code-sm text-[11px] text-secondary tracking-widest">LIVE DEMO</span>
              </div>
              <h3 className="font-headline-md text-3xl text-on-surface mb-4">Interactive UI Sandbox</h3>
              <p className="font-body-md text-base text-on-surface-variant mb-6 leading-relaxed">
                Test our custom IoT dashboards. Toggle the relay switch and watch the telemetry meters react in real-time. This is the caliber of software we ship with every hardware node.
              </p>
            </div>
            
            {/* The Sandbox Widget */}
            <div className="z-10 lg:w-1/2 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-4">
                <div className="font-code-sm text-sm text-on-surface font-bold tracking-widest flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
                  ESP32_CORE_01
                </div>
                <div className="font-code-sm text-xs text-tertiary font-bold">
                  UPTIME: <span>{formatUptime(uptime)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`bg-surface-container p-4 rounded-lg border text-center transition-all duration-300 ${relayActive ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-outline-variant/10'}`}>
                  <div className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase flex items-center justify-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-secondary" />
                    Core Temp
                  </div>
                  <div className={`font-headline-md text-2xl transition-all duration-300 ${relayActive ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                    {temp}°C
                  </div>
                </div>
                
                <div className={`bg-surface-container p-4 rounded-lg border text-center transition-all duration-300 ${relayActive ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-outline-variant/10'}`}>
                  <div className="font-label-caps text-[10px] text-on-surface-variant mb-2 uppercase flex items-center justify-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-secondary" />
                    CPU Load
                  </div>
                  <div className={`font-headline-md text-2xl transition-all duration-300 ${relayActive ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                    {cpuLoad}%
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between bg-surface-container p-4 rounded-lg border transition-all duration-300 ${relayActive ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-outline-variant/20'}`}>
                <div>
                  <div className="font-label-caps text-[11px] text-on-surface uppercase mb-1 flex items-center gap-1.5 font-bold">
                    <Zap className={`w-3.5 h-3.5 ${relayActive ? 'text-secondary animate-bounce' : 'text-on-surface-variant'}`} />
                    Main Relay Power
                  </div>
                  <div className="font-code-sm text-[10px] text-on-surface-variant">
                    Controls physical hardware state
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={relayActive}
                    onChange={handleRelayToggle}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}

function HomePreloader({ onDone }) {
  useEffect(() => {
    // Hold for 1.8s then fire onDone (framer exit animation runs after)
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="home-preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080A0A]"
    >
      {/* Ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-3xl"></div>
      </div>

      {/* Logo */}
      <motion.img
        src="/logo.png"
        alt="Zeus IOT"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_60px_rgba(255,198,64,0.25)] relative z-10"
      />

      {/* Brand name */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-6 relative z-10 text-center"
      >
        <div className="font-headline-xl text-3xl md:text-4xl text-secondary tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(255,198,64,0.4)]">
          ZEUS IOT
        </div>
        <div className="font-code-sm text-[11px] text-on-surface-variant tracking-[0.25em] mt-2 uppercase">
          Initialising Systems...
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="mt-10 relative z-10 w-48 md:w-64 h-[2px] rounded-full bg-outline-variant/30 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.65, duration: 1.0, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

function RevealSection({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
      }}
      className="mt-32"
    >
      {children}
    </motion.section>
  );
}

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      {/* A simple CSS-based fallback for particles or we can use react-tsparticles if installed, but for now CSS gradients suffice */}
    </div>
  );
}

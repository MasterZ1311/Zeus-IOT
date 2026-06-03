import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, MemoryStick, Cpu, Monitor, Hexagon, Wifi, Activity } from 'lucide-react';
import { SharpBolt } from '../components/SharpBolt';

export default function Home() {
  return (
    <div className="relative">
      <ParticlesBackground />
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 relative px-4 md:px-16 max-w-[1280px] mx-auto z-10 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 flex flex-col justify-center"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-container-high border border-outline-variant/30 rounded-full px-4 py-1.5 w-max mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(255,198,64,0.6)]"></div>
            <span className="font-code-sm text-xs text-secondary">SYSTEM STATUS: OPTIMAL</span>
          </div>
          
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 leading-tight uppercase relative">
            HARNESS THE BOLT: <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">CUSTOM IOT & SOFTWARE</span> <br/>
            FOR THE NEXT GEN
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mb-8">
            We architect raw power and precise engineering. From atmospheric sensor arrays to complex enterprise software ecosystems, we build the infrastructure that electrifies modern industry. <strong className="text-tertiary">Don't just buy from us — Learn from us.</strong>
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

        {/* Hero Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-4 mt-10 lg:mt-0 relative group flex items-center justify-center"
        >
          <div className="glass-panel bolt-active rounded-xl p-8 w-full h-full min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 hover:border-secondary/40">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative flex items-center justify-center w-48 h-48 group-hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-secondary/5 border border-secondary/15 animate-[ping_3s_ease-in-out_infinite] opacity-40"></div>
              <div className="absolute inset-4 rounded-full bg-tertiary/5 border border-tertiary/10 animate-[ping_4s_ease-in-out_infinite] opacity-30"></div>
              <SharpBolt className="w-24 h-24 text-secondary drop-shadow-[0_0_20px_rgba(255,198,64,0.7)] animate-[pulse_2s_ease-in-out_infinite]" />
            </div>

            <div className="mt-6 text-center">
              <span className="font-code-sm text-xs text-secondary tracking-widest block uppercase font-bold mb-1">HARNESS THE BOLT</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">ZEUS IOT ACTIVE CORE</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Capabilities */}
      <RevealSection>
        <h2 className="font-headline-lg text-3xl text-on-surface mb-12 flex items-center gap-4 px-4 md:px-16 max-w-[1280px] mx-auto">
          <span className="w-8 h-1 bg-secondary"></span>
          CORE CAPABILITIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] px-4 md:px-16 max-w-[1280px] mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="md:col-span-7 md:row-span-2 glass-panel bolt-standby rounded-xl p-8 flex flex-col group relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-6 border border-tertiary/30">
              <Cpu className="text-tertiary w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface mb-4 z-10">Custom Hardware & IoT</h3>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-md z-10 mb-6 flex-grow">
              We design and fabricate bespoke sensor networks, microcontroller boards, and final-year IoT prototype modules. Built to satisfy rigorous university engineering rubrics.
            </p>
            <div className="flex gap-2 z-10 mt-auto flex-wrap">
              {['ESP32', 'Arduino', 'Raspberry Pi', 'Nvidia Jetson', 'Orange Pi', 'Banana Pi', 'Radxa X4', 'Asus Tinker Board', 'LattePanda'].map(t => (
                <span key={t} className="bg-surface-container-high px-3 py-1 rounded text-xs font-code-sm text-tertiary border border-tertiary/20">{t}</span>
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
      </RevealSection>
    </div>
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

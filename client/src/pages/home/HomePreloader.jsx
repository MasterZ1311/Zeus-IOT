/**
 * HomePreloader — the cinematic boot intro shown once per session on the first
 * Home visit. Identical on every device (shared chrome), so it lives apart from
 * the platform-specific MobileHome / DesktopHome compositions.
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePreloader({ onDone }) {
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

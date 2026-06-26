/**
 * CodeOfOlympus
 * A subtle Greek-mythology brand moment: three Zeus-inspired principles, each
 * paired with an authentic Ancient Greek term. Uses the existing glass-panel /
 * accent style so it feels native to the site. Self-contained.
 */
import { motion } from 'framer-motion';
import { Zap, Crosshair, Crown } from 'lucide-react';
import GreekKeyDivider from './GreekKeyDivider';

const PRINCIPLES = [
  {
    icon: Zap,
    color: '#e5a93c',
    name: 'POWER',
    greek: 'κράτος',          // krátos — might, raw power
    body: 'Zeus commands the thunderbolt — the rawest force in the cosmos. We channel that same power into every board we fabricate and every system we ship.',
  },
  {
    icon: Crosshair,
    color: '#00d2ff',
    name: 'PRECISION',
    greek: 'ἀκρίβεια',        // akríbeia — exactness
    body: "A god's bolt never misses its mark — and neither do we. Every circuit, every line of code, every decision is deliberate and exact.",
  },
  {
    icon: Crown,
    color: '#d946ef',
    name: 'MASTERY',
    greek: 'ἀρετή',           // areté — excellence, mastery of craft
    body: "Zeus ruled Olympus through mastery, not chance. We deliver work you don't just own — you understand it, and you can defend it.",
  },
];

export default function CodeOfOlympus() {
  return (
    <section className="mt-20 md:mt-32 px-4 md:px-16 max-w-[1280px] mx-auto relative">
      <GreekKeyDivider className="mb-12" />

      {/* faint background glow */}
      <div className="absolute inset-0 pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle at 50% 20%, rgba(229,169,60,0.05) 0%, transparent 55%)' }} />

      <div className="text-center mb-12 relative z-10">
        <span className="font-code-sm text-secondary uppercase tracking-widest" style={{ fontSize: 11, letterSpacing: '0.2em' }}>
          ⚡ THE CODE OF OLYMPUS
        </span>
        <h2 className="font-headline-lg text-on-surface mt-3" style={{ fontSize: 'clamp(24px, 3.5vw, 38px)' }}>
          Principles Forged in{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#e5a93c,#00d2ff)', WebkitBackgroundClip: 'text' }}>
            Lightning
          </span>
        </h2>
        <p className="font-body-md text-on-surface-variant mt-3 max-w-xl mx-auto" style={{ fontSize: 14 }}>
          The same tenets that made Zeus king of the gods guide every project we build.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {PRINCIPLES.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="glass-panel rounded-2xl p-7 md:p-8 flex flex-col items-center text-center relative overflow-hidden group"
              style={{ borderTop: `2px solid ${p.color}` }}
            >
              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}14 0%, transparent 70%)` }} />

              {/* watermark Greek letter */}
              <span className="absolute -top-3 right-3 font-headline-xl pointer-events-none select-none"
                style={{ fontSize: 90, lineHeight: 1, color: p.color, opacity: 0.06 }}>
                {p.greek.charAt(0)}
              </span>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${p.color}1a`, border: `1px solid ${p.color}40`, boxShadow: `0 0 20px ${p.color}22` }}>
                <Icon className="w-7 h-7" style={{ color: p.color }} />
              </div>

              <h3 className="font-headline-md text-on-surface relative z-10 tracking-wider" style={{ fontSize: 20 }}>
                {p.name}
              </h3>
              <span className="font-body-md italic relative z-10 mb-4" style={{ fontSize: 14, color: p.color, opacity: 0.85 }}>
                {p.greek}
              </span>

              <p className="font-body-md text-on-surface-variant text-sm leading-relaxed relative z-10">
                {p.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* closing epigraph */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mt-12 font-headline-md text-on-surface-variant relative z-10"
        style={{ fontSize: 'clamp(16px, 2vw, 22px)' }}
      >
        We don't just build projects. <span className="text-secondary">We forge them.</span>
      </motion.p>
    </section>
  );
}

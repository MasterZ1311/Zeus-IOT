import { motion } from 'framer-motion';
import { Lock, EyeOff, MessageCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const TRUST = [
  { icon: EyeOff,      color: '#00d2ff', label: 'No accounts. No tracking you across the web.' },
  { icon: ShieldCheck, color: '#e5a93c', label: 'Your project ideas stay strictly confidential.' },
  { icon: Trash2,      color: '#d946ef', label: 'Nothing personal is stored on this website.' },
];

const SECTIONS = [
  {
    icon: EyeOff,
    color: '#00d2ff',
    title: 'We Don\'t Collect Your Data Here',
    body: 'This website has no sign-ups, no forms that store your details, and no database of visitors. It exists purely to show our work and connect you with us. You browse completely anonymously.',
  },
  {
    icon: MessageCircle,
    color: '#25d366',
    title: 'Conversations Happen On WhatsApp',
    body: 'When you tap a "Chat" button, your browser simply opens WhatsApp with a message ready to send — you decide whether to send it. From there, everything is protected by WhatsApp\'s end-to-end encryption. We only ever see what you choose to share.',
  },
  {
    icon: ShieldCheck,
    color: '#e5a93c',
    title: 'Your Ideas Are Safe',
    body: 'Whatever you tell us about your project is kept private. We never sell, rent, or share your information, and we never reuse your idea for anyone else. Confidentiality is the foundation of how we work.',
  },
  {
    icon: Lock,
    color: '#d946ef',
    title: 'Anonymous, On-Device Signals Only',
    body: 'To learn which sections people find useful, we may keep a simple anonymous tally of clicks inside your own browser. It never leaves your device, holds nothing personal, and clears whenever you clear your browser.',
  },
];

export default function Privacy() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center border border-tertiary/30">
            <Lock className="text-tertiary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Your Privacy</h1>
        </div>
        <p className="font-body-lg text-lg text-on-surface-variant mb-8 max-w-2xl">
          Short version: we don't track you, and your ideas are safe with us. Here's exactly how it works.
        </p>

        {/* Trust strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {TRUST.map(({ icon: Icon, color, label }) => (
            <div key={label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="font-body-md text-xs text-on-surface-variant leading-snug">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map(({ icon: Icon, color, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-panel rounded-2xl p-7 flex flex-col"
              style={{ borderTop: `2px solid ${color}` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h2 className="font-headline-md text-xl text-on-surface mb-2">{title}</h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel glass-panel-glow rounded-2xl p-8 mt-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,210,255,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <h2 className="font-headline-md text-2xl text-on-surface mb-2">Questions about privacy?</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-lg mx-auto">We're happy to explain anything — just ask.</p>
            <a
              href={waLink(messages.generic)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('privacy-page')}
              className="inline-flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest px-7 py-3.5"
              style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
          </div>
        </motion.div>

        <div className="border-t border-outline-variant/30 pt-6 mt-8">
          <p className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">
            Last Updated: June 2026 | Zeus IoT
          </p>
        </div>
      </div>
    </div>
  );
}

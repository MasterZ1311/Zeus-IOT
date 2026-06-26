import { motion } from 'framer-motion';
import { MessageCircle, Clock, ShieldCheck, Zap } from 'lucide-react';
import BriefComposer from '../components/BriefComposer';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const PERKS = [
  { icon: Clock,       title: 'Replies in hours',     desc: 'Real humans, real fast — straight to WhatsApp.' },
  { icon: ShieldCheck, title: 'No commitment',         desc: 'Just a chat. We scope it out together first.' },
  { icon: Zap,         title: 'Built to impress',      desc: 'Production-grade work that stands out at viva.' },
];

export default function Contact() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* LEFT — pitch */}
        <div>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 uppercase flex items-center gap-4">
            <span className="w-8 h-1 bg-secondary inline-block"></span>
            LET'S BUILD IT
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-lg">
            Answer a few quick taps and we'll open WhatsApp with your project brief ready to send.
            No forms to fill, no waiting on email.
          </p>

          <div className="space-y-4 mb-10">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-headline-md text-on-surface" style={{ fontSize: 16 }}>{title}</div>
                  <p className="font-body-md text-sm text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct chat shortcut */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.12) 0%, transparent 70%)', filter: 'blur(16px)' }} />
            <p className="font-body-md text-sm text-on-surface-variant mb-4 relative z-10">
              Prefer to just talk? Skip the steps and message us directly.
            </p>
            <a
              href={waLink(messages.generic)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('contact-direct')}
              className="relative z-10 inline-flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest px-6 py-3.5"
              style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* RIGHT — brief composer */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <BriefComposer />
        </motion.div>
      </div>
    </div>
  );
}

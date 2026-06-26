import { motion } from 'framer-motion';
import { LifeBuoy, Wrench, FileCode, Clock, MessageCircle, Users } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'zeusiotprojects@gmail.com';
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919080809088';
const COMMUNITY_URL = 'https://chat.whatsapp.com/I1U87JvYHRXL2aiERbBhGF?s=cl&p=a&mlu=3';
const prettyPhone = '+' + WHATSAPP.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');

export default function Support() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
            <LifeBuoy className="text-secondary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Help & Support</h1>
        </div>

        <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-2xl">
          The fastest way to get help is a direct message. Whatever you need — a quote, a question,
          or help with a delivered project — we're one tap away on WhatsApp.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-secondary">
              <Wrench className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">Hardware Help</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow">
              Questions about a sensor module, wiring, or power for a build we delivered? Send us your
              Project reference on WhatsApp and we'll walk you through it step by step.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-tertiary">
              <FileCode className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">Software & Code</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow">
              Need a code walkthrough before your review, or a small tweak to a deliverable? Message us
              and we'll explain every part so you can defend it with confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4 md:col-span-2"
          >
            <div className="flex items-center gap-3 text-on-surface">
              <Clock className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">When We're Around</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              Monday–Saturday, 9:00 AM – 7:00 PM IST. We usually reply within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a
                href={waLink(messages.generic)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsApp('support-page')}
                className="flex-1 flex items-center justify-center gap-2 font-label-caps text-xs uppercase tracking-widest px-6 py-4"
                style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp {prettyPhone}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high rounded-xl px-6 py-4 border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-colors font-code-sm text-sm"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Community — subtle secondary section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-outline-variant/20 pt-8"
        >
          <h2 className="font-code-sm text-tertiary uppercase tracking-widest mb-3" style={{ fontSize: 11, letterSpacing: '0.2em' }}>
            ⚡ The Community
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-body-md text-sm text-on-surface-variant max-w-md">
              Building something too? Swap ideas, get tips, and see what others are making in our
              student builders' WhatsApp group.
            </p>
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('community-group')}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-code-sm transition-colors"
              style={{ color: '#25d366', border: '1px solid rgba(37,211,102,0.35)', background: 'rgba(37,211,102,0.07)', fontSize: 13 }}
            >
              <Users className="w-4 h-4" /> Join the group
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

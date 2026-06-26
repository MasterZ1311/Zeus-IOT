import { motion } from 'framer-motion';
import { Shield, Lock, Scale, Sparkles, RefreshCw, MessageCircle } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const SECTIONS = [
  {
    icon: Sparkles,
    color: '#e5a93c',
    title: 'What You Get',
    body: 'Every project is built to production standard and delivered with clean documentation, clear explanations, and a 1-on-1 walkthrough. We don\'t just hand over a black box — we make sure you understand and can confidently present your own project.',
    points: [
      'Fully working, tested deliverables',
      'Documentation, schematics & commented code',
      'A walkthrough session before your review or viva',
    ],
  },
  {
    icon: Lock,
    color: '#00d2ff',
    title: 'Your Ideas Stay Yours',
    body: 'Anything you share with us is treated as strictly confidential. We never reuse, resell, or disclose your project idea. Once a project is delivered and settled, the work is yours — full ownership, no strings attached.',
    points: [
      'Complete confidentiality, always',
      'Full ownership transfers to you on delivery',
      'We never resell your custom work',
    ],
  },
  {
    icon: Scale,
    color: '#d946ef',
    title: 'Fair & Transparent Pricing',
    body: 'No hidden fees, ever. We agree on the scope and price up front over WhatsApp before any work begins. Larger projects are split into clear milestones, so you always know exactly what you\'re paying for and when.',
    points: [
      'Price agreed before we start',
      'Milestone-based for bigger builds',
      'No surprise charges',
    ],
  },
  {
    icon: RefreshCw,
    color: '#e5a93c',
    title: 'Revisions & Support',
    body: 'We want you genuinely happy with the result. If something isn\'t right, tell us and we\'ll make it right. After delivery, we stay reachable on WhatsApp to help you understand, run, and defend your project.',
    points: [
      'Reasonable revisions included',
      'Post-delivery help on WhatsApp',
      'Honest guidance, every step',
    ],
  },
];

export default function Terms() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
            <Shield className="text-secondary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Our Promise</h1>
        </div>
        <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-2xl">
          The simple, fair terms we work by — written in plain English, because trust matters more than fine print.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map(({ icon: Icon, color, title, body, points }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-panel rounded-2xl p-7 flex flex-col"
              style={{ borderTop: `2px solid ${color}` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h2 className="font-headline-md text-xl text-on-surface mb-2">{title}</h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-4 flex-grow">{body}</p>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2 font-body-md text-sm text-on-surface">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Reassurance CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-panel glass-panel-glow rounded-2xl p-8 mt-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(229,169,60,0.08) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <h2 className="font-headline-md text-2xl text-on-surface mb-2">Still have a question?</h2>
            <p className="font-body-md text-on-surface-variant mb-6 max-w-lg mx-auto">
              Ask us anything before you commit — no pressure, no obligation.
            </p>
            <a
              href={waLink(messages.generic)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('terms-page')}
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

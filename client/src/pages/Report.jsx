import { useState } from 'react';
import { FileText, ArrowRight, ArrowLeft, Check, Zap, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openWhatsApp, waLink, trackWhatsApp, messages } from '../config/whatsapp';

const FORMATS  = ['IEEE Conference', 'University Thesis', 'Journal Paper', 'Technical Manual', 'Custom Format'];
const SCOPES   = ['Complete Research', 'Rewrite / Paraphrase', 'Proofreading Only', 'Formatting Only'];
const DEADLINES = ['ASAP (rush)', '1 week', '2–3 weeks', '1 month+', 'Flexible'];
const TIERS = [
  { id: 'Standard (UG)',        desc: 'Undergraduate' },
  { id: 'Advanced (PG)',        desc: 'Postgraduate / journal' },
  { id: 'Premium (Scopus)',     desc: 'Indexed publication' },
];

const STEPS = ['Format', 'Scope', 'Timeline', 'Tier'];

function OptionCard({ active, onClick, children, color = '#e5a93c' }) {
  return (
    <motion.button type="button" onClick={onClick} whileTap={{ scale: 0.97 }}
      className="text-left p-4 rounded-xl border transition-all duration-200 w-full"
      style={{ background: active ? `${color}14` : 'rgba(255,255,255,0.03)', borderColor: active ? color : 'rgba(255,255,255,0.08)', boxShadow: active ? `0 0 18px ${color}22` : 'none' }}>
      {children}
    </motion.button>
  );
}

export default function Report() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ format: '', scope: '', deadline: '', tier: '' });

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const canNext = [data.format, data.scope, data.deadline, data.tier][step];
  const isLast = step === STEPS.length - 1;

  const launch = () => openWhatsApp(messages.report(data), 'report-brief');

  const optionSets = [FORMATS, SCOPES, DEADLINES, null];

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
          <FileText className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-5 uppercase">ACADEMIC REPORTS & PAPERS</h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          IEEE papers, theses, technical docs — formatted to your university's exact spec.
          Build your brief below and send it straight to WhatsApp.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel glass-panel-glow max-w-2xl mx-auto rounded-2xl p-6 md:p-8">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-7">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className="h-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? 'linear-gradient(90deg,#e5a93c,#00d2ff)' : 'rgba(255,255,255,0.1)' }} />
              <span className="font-code-sm uppercase tracking-wider mt-1.5 block"
                style={{ fontSize: 9, color: i === step ? '#e5a93c' : 'rgba(198,198,205,0.5)' }}>{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <h3 className="font-headline-md text-xl text-on-surface mb-1">
              {['What format do you need?', 'What level of help?', 'When is it due?', 'Quality tier?'][step]}
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-5">
              {['Pick your target style.', 'From full research to a final polish.', 'A rough date is fine.', 'We match depth to your goal.'][step]}
            </p>

            {step < 3 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {optionSets[step].map(opt => {
                  const key = ['format', 'scope', 'deadline'][step];
                  return (
                    <OptionCard key={opt} active={data[key] === opt} onClick={() => set(key, opt)} color={step === 1 ? '#00d2ff' : '#e5a93c'}>
                      <span className="font-body-md text-on-surface" style={{ fontSize: 14 }}>{opt}</span>
                    </OptionCard>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIERS.map(t => (
                  <OptionCard key={t.id} active={data.tier === t.id} onClick={() => set('tier', t.id)} color="#d946ef">
                    <div className="font-headline-md text-on-surface" style={{ fontSize: 14 }}>{t.id}</div>
                    <div className="font-code-sm text-on-surface-variant mt-0.5" style={{ fontSize: 10 }}>{t.desc}</div>
                  </OptionCard>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-7 gap-3">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="font-label-caps text-xs uppercase tracking-widest flex items-center gap-1 px-4 py-2.5 rounded-lg disabled:opacity-30"
            style={{ color: '#c6c6cd', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {!isLast ? (
            <button type="button" onClick={() => canNext && setStep(s => s + 1)} disabled={!canNext}
              className="btn-thunderbolt font-label-caps text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40" style={{ padding: '12px 28px' }}>
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={launch} disabled={!canNext}
              className="font-label-caps text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 active:scale-95 transition-transform"
              style={{ padding: '13px 28px', borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}>
              <Zap className="w-4 h-4" /> Send on WhatsApp
            </button>
          )}
        </div>

        {(data.format || data.scope) && (
          <div className="mt-5 pt-5 border-t border-outline-variant/20 flex flex-wrap gap-2">
            {[data.format, data.scope, data.deadline, data.tier].filter(Boolean).map(v => (
              <span key={v} className="inline-flex items-center gap-1 font-code-sm px-2.5 py-1 rounded-full"
                style={{ fontSize: 10, background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)', color: '#00d2ff' }}>
                <Check className="w-3 h-3" /> {v}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="text-center mt-6">
        <a href={waLink(messages.generic)} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp('report-direct')}
          className="inline-flex items-center gap-1.5 font-code-sm text-on-surface-variant hover:text-secondary transition-colors" style={{ fontSize: 12 }}>
          <MessageCircle className="w-3.5 h-3.5" /> Or just message us directly
        </a>
      </div>
    </div>
  );
}

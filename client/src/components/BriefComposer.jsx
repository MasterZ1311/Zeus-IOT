/**
 * BriefComposer
 * Multi-step "describe your project" flow that ends by opening WhatsApp with a
 * fully pre-filled brief. No backend, no waiting — every path lands in your chat.
 * Used on the Contact page and (compact mode) elsewhere.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Code, Bot, FileText, Wifi, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import { openWhatsApp, messages } from '../config/whatsapp';

const TYPES = [
  { id: 'Custom IoT / Hardware', icon: Cpu,      desc: 'Sensors, PCBs, prototypes', color: '#00d2ff' },
  { id: 'Software / Web App',    icon: Code,     desc: 'Full-stack, dashboards',    color: '#e5a93c' },
  { id: 'AI / Edge ML',          icon: Bot,      desc: 'Vision, models, inference',  color: '#d946ef' },
  { id: 'IoT Network',           icon: Wifi,     desc: 'Multi-node, telemetry',      color: '#00d2ff' },
  { id: 'Academic Report',       icon: FileText, desc: 'IEEE, thesis, papers',       color: '#e5a93c' },
];

const FOCUS = {
  'Custom IoT / Hardware': ['Sensor array', 'Custom PCB', 'Wearable / portable', 'Automation rig', 'Not sure yet'],
  'Software / Web App':    ['Web dashboard', 'Mobile-first app', 'Backend / API', 'Full platform', 'Not sure yet'],
  'AI / Edge ML':          ['Computer vision', 'Predictive model', 'Edge deployment', 'Not sure yet'],
  'IoT Network':           ['Smart agriculture', 'Asset tracking', 'Environmental monitor', 'Not sure yet'],
  'Academic Report':       ['IEEE conference', 'University thesis', 'Journal paper', 'Technical manual'],
};

const DEADLINES = ['ASAP (rush)', '1–2 weeks', '3–4 weeks', '1–2 months', 'Flexible'];
const TIERS = [
  { id: 'Standard', desc: 'Solid & reliable' },
  { id: 'Pro',      desc: 'Production-grade' },
  { id: 'Premium',  desc: 'Best of everything' },
];

const STEPS = ['Type', 'Focus', 'Timeline', 'Tier'];

function OptionCard({ active, onClick, children, color = '#e5a93c' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="text-left p-4 rounded-xl border transition-all duration-200 w-full"
      style={{
        background: active ? `${color}14` : 'rgba(255,255,255,0.03)',
        borderColor: active ? color : 'rgba(255,255,255,0.08)',
        boxShadow: active ? `0 0 18px ${color}22` : 'none',
      }}
    >
      {children}
    </motion.button>
  );
}

export default function BriefComposer() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ type: '', focus: '', deadline: '', tier: '' });

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const canNext = [data.type, data.focus, data.deadline, data.tier][step];
  const isLast = step === STEPS.length - 1;

  const launch = () => {
    openWhatsApp(messages.brief({ type: data.type, focus: data.focus, deadline: data.deadline, tier: data.tier }), `brief:${data.type}`);
  };

  return (
    <div className="glass-panel glass-panel-glow rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? 'linear-gradient(90deg,#e5a93c,#00d2ff)' : 'rgba(255,255,255,0.1)' }}
            />
            <span
              className="font-code-sm uppercase tracking-wider mt-1.5 block"
              style={{ fontSize: 9, color: i === step ? '#e5a93c' : 'rgba(198,198,205,0.5)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {/* STEP 0 — Type */}
          {step === 0 && (
            <div>
              <h3 className="font-headline-md text-xl text-on-surface mb-1">What are you building?</h3>
              <p className="font-body-md text-sm text-on-surface-variant mb-5">Pick the closest match.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TYPES.map(t => {
                  const Icon = t.icon;
                  return (
                    <OptionCard key={t.id} active={data.type === t.id} onClick={() => { set('type', t.id); set('focus', ''); }} color={t.color}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${t.color}1a`, border: `1px solid ${t.color}40` }}>
                          <Icon className="w-5 h-5" style={{ color: t.color }} />
                        </div>
                        <div>
                          <div className="font-headline-md text-on-surface" style={{ fontSize: 14 }}>{t.id}</div>
                          <div className="font-code-sm text-on-surface-variant" style={{ fontSize: 10 }}>{t.desc}</div>
                        </div>
                      </div>
                    </OptionCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1 — Focus */}
          {step === 1 && (
            <div>
              <h3 className="font-headline-md text-xl text-on-surface mb-1">Narrow it down</h3>
              <p className="font-body-md text-sm text-on-surface-variant mb-5">What's the main focus?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(FOCUS[data.type] || []).map(f => (
                  <OptionCard key={f} active={data.focus === f} onClick={() => set('focus', f)} color="#00d2ff">
                    <span className="font-body-md text-on-surface" style={{ fontSize: 14 }}>{f}</span>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Deadline */}
          {step === 2 && (
            <div>
              <h3 className="font-headline-md text-xl text-on-surface mb-1">When do you need it?</h3>
              <p className="font-body-md text-sm text-on-surface-variant mb-5">Rough timeline is fine.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEADLINES.map(d => (
                  <OptionCard key={d} active={data.deadline === d} onClick={() => set('deadline', d)} color="#e5a93c">
                    <span className="font-body-md text-on-surface" style={{ fontSize: 14 }}>{d}</span>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Tier */}
          {step === 3 && (
            <div>
              <h3 className="font-headline-md text-xl text-on-surface mb-1">Quality tier?</h3>
              <p className="font-body-md text-sm text-on-surface-variant mb-5">We tailor the build to your goal.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIERS.map(t => (
                  <OptionCard key={t.id} active={data.tier === t.id} onClick={() => set('tier', t.id)} color="#d946ef">
                    <div className="font-headline-md text-on-surface" style={{ fontSize: 15 }}>{t.id}</div>
                    <div className="font-code-sm text-on-surface-variant mt-0.5" style={{ fontSize: 10 }}>{t.desc}</div>
                  </OptionCard>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-7 gap-3">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className="font-label-caps text-xs uppercase tracking-widest flex items-center gap-1 px-4 py-2.5 rounded-lg transition-colors disabled:opacity-30"
          style={{ color: '#c6c6cd', border: '1px solid rgba(255,255,255,0.1)' }}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={() => canNext && setStep(s => s + 1)}
            disabled={!canNext}
            className="btn-thunderbolt font-label-caps text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40"
            style={{ padding: '12px 28px' }}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={launch}
            disabled={!canNext}
            className="font-label-caps text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-40 active:scale-95 transition-transform"
            style={{
              padding: '13px 28px',
              borderRadius: 12,
              color: '#fff',
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              boxShadow: '0 4px 18px rgba(37,211,102,0.4)',
            }}
          >
            <Zap className="w-4 h-4" /> Send on WhatsApp
          </button>
        )}
      </div>

      {/* Live preview chip */}
      {(data.type || data.focus) && (
        <div className="mt-5 pt-5 border-t border-outline-variant/20 flex flex-wrap gap-2">
          {[data.type, data.focus, data.deadline, data.tier].filter(Boolean).map(v => (
            <span key={v} className="inline-flex items-center gap-1 font-code-sm px-2.5 py-1 rounded-full" style={{ fontSize: 10, background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)', color: '#00d2ff' }}>
              <Check className="w-3 h-3" /> {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

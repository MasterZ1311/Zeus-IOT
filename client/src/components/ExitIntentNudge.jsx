/**
 * ExitIntentNudge
 * Desktop: triggers when the cursor leaves toward the top (tab close / address bar).
 * Mobile:  triggers on deep scroll (>70%) since exit-intent doesn't exist on touch.
 * Shows once per session. Routes to WhatsApp.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const SESSION_KEY = 'zeus_exit_nudge_shown';

export default function ExitIntentNudge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(true);
    };

    // Desktop exit-intent
    const onMouseOut = (e) => {
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    };

    // Mobile deep-scroll trigger
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (pct > 0.7) fire();
    };

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      // small delay so it doesn't fire instantly on accidental moves
      const t = setTimeout(() => document.addEventListener('mouseout', onMouseOut), 4000);
      return () => { clearTimeout(t); document.removeEventListener('mouseout', onMouseOut); };
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'rgba(3,5,12,0.7)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-panel relative w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-7 md:p-8 text-center overflow-hidden"
          >
            {/* glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(229,169,60,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }} />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface-variant hover:text-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-headline-md text-2xl text-on-surface mb-2">Wait — got a project in mind?</h3>
              <p className="font-body-md text-on-surface-variant mb-6" style={{ fontSize: 14 }}>
                Tell us what you're building. We reply on WhatsApp within hours — no forms, no waiting.
              </p>
              <a
                href={waLink(messages.exit)}
                target="_blank"
                rel="noreferrer"
                onClick={() => { trackWhatsApp('exit-intent'); setOpen(false); }}
                className="font-label-caps text-xs uppercase tracking-widest flex items-center justify-center gap-2 w-full"
                style={{
                  padding: '14px 24px', borderRadius: 12, color: '#fff',
                  background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                  boxShadow: '0 4px 18px rgba(37,211,102,0.4)',
                }}
              >
                <Zap className="w-4 h-4" /> Chat with us now
              </a>
              <button
                onClick={() => setOpen(false)}
                className="mt-3 font-code-sm text-on-surface-variant hover:text-on-surface transition-colors"
                style={{ fontSize: 11 }}
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

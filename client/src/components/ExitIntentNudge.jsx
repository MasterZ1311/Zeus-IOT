/**
 * ExitIntentNudge
 * Desktop: triggers when the cursor leaves toward the top.
 * Mobile:  triggers on deep scroll (>70%).
 * Shows once per session. Routes to WhatsApp.
 *
 * Accessibility:
 *  • Escape key closes (keyboard parity with ProjectModal)
 *  • Focus is trapped inside while open; restored on close
 *  • Mobile scroll listener is cleaned up after it fires (no leak)
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const SESSION_KEY = 'zeus_exit_nudge_shown';

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';

export default function ExitIntentNudge() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null); // element that had focus before open

  // ── Trigger logic ─────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      triggerRef.current = document.activeElement;
      setOpen(true);
    };

    const onMouseOut = (e) => {
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    };

    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      if (pct > 0.7) {
        fire();
        // Clean up immediately after firing — no leak
        window.removeEventListener('scroll', onScroll);
      }
    };

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    } else {
      const t = setTimeout(() => document.addEventListener('mouseout', onMouseOut), 4000);
      return () => { clearTimeout(t); document.removeEventListener('mouseout', onMouseOut); };
    }
  }, []);

  // ── Close handler ──────────────────────────────────────────
  const close = () => {
    setOpen(false);
    // Restore focus to where it was before the nudge opened
    requestAnimationFrame(() => {
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    });
  };

  // ── Keyboard: Escape + focus trap ─────────────────────────
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;

    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', onKey);

    // Move focus into panel on open
    const focusable = Array.from(panel?.querySelectorAll(FOCUSABLE) ?? []);
    if (focusable[0]) setTimeout(() => focusable[0].focus(), 80);

    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Got a project in mind?"
          className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'rgba(3,5,12,0.7)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            ref={panelRef}
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

            {/* ── Close button: z-20 so it's above the z-10 content, min 44×44px tap target ── */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:text-secondary transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
              style={{ width: 44, height: 44 }}
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
                onClick={() => { trackWhatsApp('exit-intent'); close(); }}
                className="font-label-caps text-xs uppercase tracking-widest flex items-center justify-center gap-2 w-full focus-visible:ring-2 focus-visible:ring-secondary"
                style={{
                  padding: '14px 24px', borderRadius: 12, color: '#fff',
                  background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                  boxShadow: '0 4px 18px rgba(37,211,102,0.4)',
                }}
              >
                <Zap className="w-4 h-4" /> Chat with us now
              </a>
              <button
                type="button"
                onClick={close}
                className="mt-3 font-code-sm text-on-surface-variant hover:text-on-surface transition-colors focus-visible:underline"
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

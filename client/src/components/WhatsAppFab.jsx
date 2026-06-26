/**
 * WhatsAppFab + StickyWhatsAppBar
 * Desktop: floating action button (bottom-right).
 * Mobile:  full-width sticky "Chat on WhatsApp" bar above the bottom tab nav.
 * Both route through the central WhatsApp funnel util with click tracking.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const WaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
  </svg>
);

export default function WhatsAppFab() {
  const href = waLink(messages.generic);

  return (
    <>
      {/* ── DESKTOP FLOATING BUTTON ──────────────────────────── */}
      <AnimatePresence>
        <motion.a
          key="wa-fab"
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsApp('fab')}
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="hidden md:flex fixed z-[120] items-center justify-center rounded-full"
          style={{
            right: 'max(20px, env(safe-area-inset-right))',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
            boxShadow: '0 4px 20px rgba(37,211,102,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(37,211,102,0.5)', animation: 'waPulse 2.5s ease-out infinite' }}
          />
          <WaIcon className="w-7 h-7 relative z-10" />
        </motion.a>
      </AnimatePresence>

      {/* ── MOBILE STICKY BAR (above bottom tab nav) ─────────── */}
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsApp('sticky-bar')}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 24 }}
        className="md:hidden fixed left-0 right-0 z-[110] flex items-center justify-center gap-2 font-label-caps uppercase tracking-widest active:scale-[0.98]"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 56px)',
          margin: '0 12px',
          padding: '13px 16px',
          borderRadius: 14,
          fontSize: 13,
          color: '#fff',
          background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
          boxShadow: '0 6px 24px rgba(37,211,102,0.4), 0 0 0 1px rgba(255,255,255,0.12) inset',
        }}
        aria-label="Chat on WhatsApp"
      >
        <WaIcon className="w-5 h-5" />
        Chat on WhatsApp
      </motion.a>

      <style>{`
        @keyframes waPulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.6); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { @keyframes waPulse { 0%,100% { transform: scale(1); opacity: 0; } } }
      `}</style>
    </>
  );
}

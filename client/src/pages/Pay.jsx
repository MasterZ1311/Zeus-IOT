import { useState } from 'react';
import { ShieldCheck, QrCode, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Payment details sourced from env so they're not hardcoded in the bundle source.
const UPI_ID    = import.meta.env.VITE_UPI_ID || '';
const PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || 'Zeus IoT';
const WHATSAPP  = import.meta.env.VITE_WHATSAPP_NUMBER || '919080809088';
const STATIC_QR = import.meta.env.VITE_UPI_QR || '';

// UPI deep link — most apps parse this. Encodes payee name + UPI id.
const upiLink = UPI_ID
  ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`
  : '';

// Prefer a static QR image if one is provided; otherwise generate a clean QR
// from the UPI deep link via a lightweight image API.
const qrSrc = STATIC_QR
  ? STATIC_QR
  : upiLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=${encodeURIComponent(upiLink)}`
    : '';

export default function Pay() {
  const [upiCopied, setUpiCopied] = useState(false);

  const copyUpi = async () => {
    if (!UPI_ID) return;
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">

      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 uppercase">SECURE PAYMENT GATEWAY</h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          Complete your project milestones or hardware acquisitions securely via UPI. Ensure you include your Project ID in the payment remarks.
        </p>
      </div>

      {/* UPI PAYMENT — centered single card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel glass-panel-glow rounded-xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden max-w-md mx-auto"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full blur-2xl"></div>

        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30 mb-6">
          <QrCode className="w-8 h-8 text-secondary" />
        </div>

        <h2 className="font-headline-md text-2xl text-on-surface mb-2">UPI / QR Transfer</h2>
        <p className="font-body-md text-sm text-on-surface-variant mb-8">Scan with Google Pay, PhonePe, or Paytm.</p>

        <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_20px_rgba(255,198,64,0.15)] inline-block">
          {qrSrc ? (
            <img src={qrSrc} alt="UPI payment QR code" width={240} height={240} className="w-56 h-56 object-contain" loading="lazy" />
          ) : (
            <div className="w-56 h-56 border-4 border-black border-dashed flex items-center justify-center bg-gray-100">
              <span className="font-code-sm text-black font-bold text-sm text-center px-4">QR not configured</span>
            </div>
          )}
        </div>

        <button
          onClick={copyUpi}
          disabled={!UPI_ID}
          className={`rounded-lg p-3 border transition-colors group w-full ${!UPI_ID ? 'opacity-40 cursor-not-allowed border-outline' : 'bg-surface-container-high border-outline-variant/30 hover:border-secondary/40'}`}
        >
          <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">UPI ID (tap to copy)</span>
          <span className="font-code-sm text-sm text-secondary tracking-widest font-bold flex items-center justify-center gap-2">
            {UPI_ID || 'Not configured'}
            {UPI_ID && (upiCopied ? <Check className="w-4 h-4" /> : <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />)}
          </span>
        </button>

        {upiLink && (
          <a
            href={upiLink}
            className="mt-4 md:hidden btn-thunderbolt w-full py-3 font-label-caps text-xs uppercase tracking-widest"
          >
            Open in UPI App
          </a>
        )}
      </motion.div>

      <div className="max-w-md mx-auto mt-8 glass-panel p-6 rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
          <ShieldCheck className="w-5 h-5 text-secondary" />
        </div>
        <p className="font-body-md text-sm text-on-surface-variant">
          <strong className="text-on-surface">Payment Verification:</strong> After paying, please send a screenshot of the transaction along with your Project ID to our WhatsApp support at{' '}
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="text-secondary font-bold hover:underline">
            +{WHATSAPP.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3')}
          </a>{' '}
          for immediate confirmation.
        </p>
      </div>

    </div>
  );
}

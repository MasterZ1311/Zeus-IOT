import { ShieldCheck, QrCode, ArrowRight } from 'lucide-react';

export default function Pay() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 uppercase">SECURE PAYMENT GATEWAY</h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          Complete your project milestones or hardware acquisitions securely. Ensure you include your Project ID in the payment remarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* UPI PAYMENT */}
        <div className="glass-panel glass-panel-glow rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full blur-2xl"></div>
          
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30 mb-6">
            <QrCode className="w-8 h-8 text-secondary" />
          </div>
          
          <h2 className="font-headline-md text-2xl text-on-surface mb-2">UPI / QR Transfer</h2>
          <p className="font-body-md text-sm text-on-surface-variant mb-8">Scan with Google Pay, PhonePe, or Paytm.</p>
          
          <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_20px_rgba(255,198,64,0.15)] inline-block">
            {/* Mock QR Placeholder */}
            <div className="w-48 h-48 border-4 border-black border-dashed flex items-center justify-center bg-gray-100">
              <span className="font-code-sm text-black font-bold text-lg">ZEUS QR CODE</span>
            </div>
          </div>
          
          <div className="bg-surface-container-high rounded-lg p-3 border border-outline-variant/30 w-full">
            <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">UPI ID</span>
            <span className="font-code-sm text-sm text-secondary tracking-widest font-bold">zeusiot@ybl</span>
          </div>
        </div>

        {/* BANK TRANSFER */}
        <div className="glass-panel rounded-xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-br-full blur-2xl"></div>
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          
          <h2 className="font-headline-md text-2xl text-on-surface mb-2">Bank Transfer</h2>
          <p className="font-body-md text-sm text-on-surface-variant mb-8">NEFT, RTGS, or IMPS for large milestone payments.</p>
          
          <div className="flex flex-col gap-4 w-full">
            <div className="border-b border-outline-variant/30 pb-3">
              <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">Account Name</span>
              <span className="font-body-md text-on-surface text-lg">Zeus IoT Solutions</span>
            </div>
            <div className="border-b border-outline-variant/30 pb-3">
              <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">Account Number</span>
              <span className="font-code-sm text-emerald-500 tracking-widest text-lg font-bold">50200012345678</span>
            </div>
            <div className="border-b border-outline-variant/30 pb-3">
              <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">IFSC Code</span>
              <span className="font-code-sm text-on-surface tracking-widest text-lg font-bold">HDFC0001234</span>
            </div>
            <div className="pt-2">
              <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">Branch</span>
              <span className="font-body-md text-on-surface">Tech Park Branch, Chennai</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-8 glass-panel p-6 rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-error-container flex items-center justify-center border border-error/30">
          <ShieldCheck className="w-5 h-5 text-error" />
        </div>
        <p className="font-body-md text-sm text-on-surface-variant">
          <strong className="text-on-surface">Payment Verification:</strong> After transferring funds, please send a screenshot of the transaction along with your Project ID to our WhatsApp support at <strong className="text-secondary">+91 90808 09088</strong> for immediate confirmation.
        </p>
      </div>

    </div>
  );
}

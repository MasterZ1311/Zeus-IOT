import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'zeusiotprojects@gmail.com';
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '919080809088';
const prettyPhone = '+' + WHATSAPP.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');

export default function Footer() {
  const waHref = waLink(messages.generic);

  return (
    <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 pt-10 pb-6 md:pb-12">

        {/* ── DESKTOP: 4-col grid ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-loader.png" alt="Zeus IoT Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="font-headline-lg text-lg text-secondary">ZEUS IOT</span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Engineering tomorrow's connected world. Custom IoT & software, built for the next generation.
            </p>
            <p className="font-body-md text-xs italic text-secondary/70 mt-3 flex items-center gap-1.5">
              <span style={{ fontStyle: 'normal' }}>⚡</span> Forged in the spirit of Olympus.
            </p>
          </div>

          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/">Home</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/projects">Projects</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/contact">Start a Project</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/pay">Pay</Link>
            </div>
          </div>

          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Services</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/contact">Custom IoT Builds</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/contact">Software Engineering</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/report">Academic Reports</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/projects">Portfolio</Link>
            </div>
          </div>

          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${EMAIL}`} className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" /> {EMAIL}
              </a>
              <a href={waHref} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp('footer')} className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0" /> {prettyPhone}
              </a>
            </div>
          </div>
        </div>

        {/* ── MOBILE FOOTER ── */}
        <div className="md:hidden">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/logo-loader.png" alt="Zeus IoT Logo" className="w-14 h-14 object-contain rounded-xl mb-3" />
            <span className="font-headline-lg text-xl text-secondary tracking-wider">ZEUS IOT</span>
            <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-[260px] leading-relaxed">
              Custom IoT & Software for the next generation.
            </p>
            <p className="font-body-md text-[11px] italic text-secondary/70 mt-2">⚡ Forged in the spirit of Olympus.</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-8 px-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Projects', to: '/projects' },
              { label: 'Start a Project', to: '/contact' },
              { label: 'Academic Reports', to: '/report' },
              { label: 'Pay', to: '/pay' },
              { label: 'Support', to: '/support' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors py-1.5 border-b border-outline-variant/10">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <a href={`mailto:${EMAIL}`}
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-all text-xs font-code-sm">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href={waHref} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp('footer-mobile')}
               className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-code-sm"
               style={{ color: '#25d366', borderColor: 'rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.08)' }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <div className="flex justify-center gap-5 mb-4">
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-[11px] transition-colors" to="/terms">Terms</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-[11px] transition-colors" to="/privacy">Privacy</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-[11px] transition-colors" to="/support">Support</Link>
          </div>
        </div>

        {/* ── DESKTOP bottom bar ── */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-center pt-6 border-t border-outline-variant/20">
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/terms">Terms</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/privacy">Privacy</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/support">Support</Link>
          </div>
          <p className="text-secondary font-code-sm text-xs tracking-widest">© 2026 ZEUS IOT. HARNESS THE BOLT.</p>
        </div>

        {/* ── MOBILE copyright (clears fixed bottom nav + sticky WA bar) ── */}
        <div className="md:hidden pt-3 border-t border-outline-variant/15 pb-28">
          <p className="text-center text-secondary/70 font-code-sm text-[10px] tracking-widest">© 2026 ZEUS IOT. HARNESS THE BOLT.</p>
        </div>

      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20 relative z-10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 pt-10 pb-6 md:pb-12">

        {/* ── DESKTOP: 4-col grid ── MOBILE: stacked compact blocks ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Zeus IOT Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="font-headline-lg text-headline-md text-secondary">ZEUS IOT</span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Engineering Tomorrow's Connected World. Custom IoT solutions for the next generation.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/">Home</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/projects">Projects</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/contact">Contact</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/admin">Admin</Link>
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Services</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-emerald-500 transition-colors" to="/contact">Custom IoT Builds</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-emerald-500 transition-colors" to="/contact">1-on-1 Consultation</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-emerald-500 transition-colors" to="/report">Academic Reports</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-emerald-500 transition-colors" to="/pay">Payments</Link>
            </div>
          </div>
          {/* Connect */}
          <div>
            <h4 className="font-label-caps text-xs text-on-surface mb-4 uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:zeusiotprojects@gmail.com" className="font-body-md text-sm text-on-surface-variant hover:text-emerald-500 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" /> zeusiotprojects@gmail.com
              </a>
              <a href="https://wa.me/919080809088" target="_blank" rel="noreferrer" className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0" /> +91 90808 09088
              </a>
            </div>
          </div>
        </div>

        {/* ── MOBILE FOOTER ── */}
        <div className="md:hidden">
          {/* Centred brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/logo.png" alt="Zeus IOT Logo" className="w-14 h-14 object-contain rounded-xl mb-3" />
            <span className="font-headline-lg text-xl text-secondary tracking-wider">ZEUS IOT</span>
            <p className="font-body-md text-xs text-on-surface-variant mt-2 max-w-[260px] leading-relaxed">
              Custom IoT & Software for the next generation.
            </p>
          </div>

          {/* 2-col link grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-8 px-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Custom IoT Builds', to: '/contact' },
              { label: 'Projects', to: '/projects' },
              { label: '1-on-1 Consultation', to: '/contact' },
              { label: 'Contact', to: '/contact' },
              { label: 'Academic Reports', to: '/report' },
              { label: 'Pay', to: '/pay' },
              { label: 'Payments', to: '/pay' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors py-1.5 border-b border-outline-variant/10">
                {label}
              </Link>
            ))}
          </div>

          {/* Contact icons row */}
          <div className="flex justify-center gap-4 mb-8">
            <a href="mailto:zeusiotprojects@gmail.com"
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/40 transition-all text-xs font-code-sm">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href="https://wa.me/919080809088" target="_blank" rel="noreferrer"
               className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-emerald-500 hover:border-emerald-500/40 transition-all text-xs font-code-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          {/* Legal links */}
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
          <p className="text-emerald-500 font-code-sm text-xs tracking-widest">© 2026 ZEUS IOT. HARNESS THE BOLT.</p>
        </div>

        {/* ── MOBILE copyright (clears fixed bottom nav ~64px) ── */}
        <div className="md:hidden pt-3 border-t border-outline-variant/15 pb-20">
          <p className="text-center text-emerald-500/70 font-code-sm text-[10px] tracking-widest">© 2026 ZEUS IOT. HARNESS THE BOLT.</p>
        </div>

      </div>
    </footer>
  );
}


import { Link } from 'react-router-dom';
import { Code, Share2 } from 'lucide-react';
import { SharpBolt } from './SharpBolt';
export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface-container-lowest border-t border-outline-variant/20 relative z-10">
      <div className="max-w-container-max mx-auto px-4 md:px-16 py-12 mb-20 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <SharpBolt className="text-secondary w-6 h-6" />
              <span className="font-headline-lg text-headline-md text-secondary">ZEUS IOT</span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">Engineering Tomorrow's Connected World. Custom IoT solutions for the next generation.</p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-4 uppercase">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/">Home</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/projects">Projects</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/contact">Contact</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors" to="/admin">Admin</Link>
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-4 uppercase">Services</h4>
            <div className="flex flex-col gap-2">
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/contact">Custom IoT Builds</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/contact">1-on-1 Consultation</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/report">Academic Reports</Link>
              <Link className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors" to="/pay">Payments</Link>
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-label-caps text-label-caps text-on-surface mb-4 uppercase">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:zeusiotprojects@gmail.com" className="font-body-md text-sm text-on-surface-variant hover:text-tertiary transition-colors">zeusiotprojects@gmail.com</a>
              <a href="https://wa.me/919080809088" target="_blank" rel="noreferrer" className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors">WhatsApp: +91 90808 09088</a>
              <div className="flex gap-3 mt-2">
                <a href="#" className="text-on-surface-variant hover:text-secondary transition-colors"><Code className="w-5 h-5" /></a>
                <a href="#" className="text-on-surface-variant hover:text-tertiary transition-colors"><Share2 className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-outline-variant/20">
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/terms">Terms</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/privacy">Privacy</Link>
            <Link className="text-on-surface-variant hover:text-secondary font-code-sm text-xs transition-colors" to="/support">Support</Link>
          </div>
          <p className="text-tertiary font-code-sm text-xs tracking-widest">© 2026 ZEUS IOT. HARNESS THE BOLT.</p>
        </div>
      </div>
    </footer>
  );
}

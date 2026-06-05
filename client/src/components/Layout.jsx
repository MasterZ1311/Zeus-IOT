import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Home, LayoutGrid, MessageSquare, CreditCard, ShieldAlert } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-body-lg text-on-surface circuit-bg relative">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow pt-24 md:pt-32 pb-32 z-10">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container/90 backdrop-blur-xl border-t border-emerald-500/30 shadow-[0_-4px_20px_rgba(16,185,129,0.15)] pb-safe">
        <div className="flex justify-around items-center py-2 px-4">
          <Link to="/" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150 ${location.pathname === '/' ? 'text-secondary bg-on-secondary-container/20' : 'text-on-surface-variant/70 hover:bg-surface-variant/50'}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="font-label-caps text-[10px]">Home</span>
          </Link>
          <Link to="/projects" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150 ${location.pathname.startsWith('/projects') ? 'text-secondary bg-on-secondary-container/20' : 'text-on-surface-variant/70 hover:bg-surface-variant/50'}`}>
            <LayoutGrid className="w-5 h-5 mb-1" />
            <span className="font-label-caps text-[10px]">Projects</span>
          </Link>
          <Link to="/contact" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150 ${location.pathname.startsWith('/contact') ? 'text-secondary bg-on-secondary-container/20' : 'text-on-surface-variant/70 hover:bg-surface-variant/50'}`}>
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="font-label-caps text-[10px]">Contact</span>
          </Link>
          <Link to="/pay" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 active:scale-90 transition-transform duration-150 ${location.pathname.startsWith('/pay') ? 'text-secondary bg-on-secondary-container/20' : 'text-on-surface-variant/70 hover:bg-surface-variant/50'}`}>
            <CreditCard className="w-5 h-5 mb-1" />
            <span className="font-label-caps text-[10px]">Pay</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

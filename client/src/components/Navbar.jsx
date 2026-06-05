import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { SharpBolt } from './SharpBolt';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('zeus_admin_token');
  const isAdmin = location.pathname.includes('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('zeus_admin_token');
    localStorage.removeItem('zeus_admin_user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'PAY', path: '/pay' },
    { name: 'ADMIN', path: '/admin' }
  ];

  return (
    <>
      {/* Desktop Nav */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 hidden md:flex items-center justify-between px-16 h-16 ${isScrolled ? 'bg-surface/80 backdrop-blur-md border-b border-primary/20 shadow-[0_2px_15px_-3px_rgba(16,185,129,0.2)]' : 'bg-transparent'}`}>
        <Link to="/" className="flex items-center gap-2">
          <SharpBolt className="text-secondary w-6 h-6" />
          <span className="font-headline-xl text-headline-md text-secondary drop-shadow-[0_0_8px_rgba(255,198,64,0.4)] tracking-tight">ZEUS IOT</span>
        </Link>
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-label-caps text-label-caps transition-colors hover:text-emerald-500 ${location.pathname === link.path ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-on-surface-variant'}`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && token && (
            <button onClick={handleLogout} className="text-error font-label-caps text-label-caps hover:text-red-400 transition-colors flex items-center gap-1 ml-4 cursor-pointer">
              <LogOut className="w-4 h-4" /> LOGOUT
            </button>
          )}
        </nav>
      </header>

      {/* Mobile Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-primary/20 shadow-[0_2px_15px_-3px_rgba(16,185,129,0.2)] flex md:hidden items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2">
          <SharpBolt className="text-secondary w-6 h-6" />
          <span className="font-headline-md text-secondary glow-text">ZEUS IOT</span>
        </Link>
      </header>
    </>
  );
}

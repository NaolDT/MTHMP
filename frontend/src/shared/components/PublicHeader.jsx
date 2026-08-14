import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#health-resources', label: 'Health Resources' },
  { href: '/#for-hospitals', label: 'For Hospitals' },
];

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-brand-dark">MTHMP</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative text-slate-600 hover:text-brand-dark transition-colors group py-1"
            >
              {link.label}
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 text-sm">
          <Link to="/login" className="text-slate-600 hover:text-brand-dark">Log In</Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
          >
            Register
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-slate-600"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-white border-t border-slate-200 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="text-center rounded-lg bg-brand text-white px-3 py-2.5 text-sm font-medium hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
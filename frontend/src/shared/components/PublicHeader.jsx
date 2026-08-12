import { useState } from 'react';
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

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-brand-dark">MTHMP</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-slate-600 hover:text-brand-dark transition-colors">
              {link.label}
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

      {isMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
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
        </nav>
      )}
    </header>
  );
}
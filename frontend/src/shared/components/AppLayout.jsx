import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export default function AppLayout({ navItems, title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
        <button onClick={() => setIsDrawerOpen(true)} aria-label="Open menu" className="p-2 -ml-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-semibold text-brand-dark">{title}</span>
        <div className="w-8" />
      </header>

      {/* Mobile drawer overlay */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setIsDrawerOpen(false)}>
          <nav
            className="absolute left-0 top-0 h-full w-64 bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase text-slate-400 mb-3 px-1">{title}</p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setIsDrawerOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-slate-200 md:bg-white md:p-4">
        <p className="text-lg font-semibold text-brand-dark px-1 mb-6">{title}</p>
        <div className="space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3">
          <p className="text-xs text-slate-400 px-1 mb-2 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}
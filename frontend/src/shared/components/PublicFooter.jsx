import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/#how-it-works', label: 'How It Works' },
      { to: '/#features', label: 'Features' },
      { to: '/#health-resources', label: 'Health Resources' },
    ],
  },
  {
    title: 'For Hospitals',
    links: [
      { to: '/#for-hospitals', label: 'Hospital Information' },
      { to: '/#for-hospitals', label: 'Contact MTHMP' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-slate-50 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-white" />
              </span>
              <span className="font-extrabold text-slate-900">MTHMP</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Secure, multi-tenant digital workspace connecting patients with modern healthcare organizations.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-slate-900">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 hover:text-brand transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MTHMP. Healthcare management, made simpler. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
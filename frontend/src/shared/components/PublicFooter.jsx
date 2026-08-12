import { Link } from 'react-router-dom';

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
    title: 'Resources',
    links: [
      { to: '/#health-resources', label: 'Health Information' },
      { to: '/#health-resources', label: 'Research' },
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
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-semibold text-brand-dark">MTHMP</p>
            <p className="mt-2 text-sm text-slate-500">Healthcare management, made simpler.</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-slate-800">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 hover:text-brand-dark transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400">
          © {new Date().getFullYear()} MTHMP
        </div>
      </div>
    </footer>
  );
}
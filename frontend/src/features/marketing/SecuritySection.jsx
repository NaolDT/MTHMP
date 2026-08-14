import { KeyRound, ShieldCheck, Building2, ClipboardList } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

const items = [
  { icon: KeyRound, title: 'Secure Authentication', text: 'Accounts are protected with encrypted credentials and token-based sessions.' },
  { icon: ShieldCheck, title: 'Role-Based Access', text: 'Every user sees only what their role is permitted to see.' },
  { icon: Building2, title: 'Hospital Data Isolation', text: "Each hospital's data is kept in its own logically separated space." },
  { icon: ClipboardList, title: 'Audit Tracking', text: 'Sensitive actions are recorded for accountability and traceability.' },
];

function IsolationDiagram() {
  return (
    <div className="relative max-w-md mx-auto py-6" aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="bg-brand-dark text-white text-xs sm:text-sm font-medium rounded-lg px-4 py-2 shadow-sm">
          MTHMP Platform
        </div>

        <svg viewBox="0 0 240 60" className="w-40 sm:w-48 h-auto" preserveAspectRatio="none">
          <line x1="120" y1="0" x2="120" y2="20" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="20" y1="20" x2="220" y2="20" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="20" y1="20" x2="20" y2="60" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="220" y1="20" x2="220" y2="60" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="120" cy="20" r="4" fill="#2563eb" className="animate-pulse-dot" style={{ transformOrigin: '120px 20px' }} />
        </svg>

        <div className="flex gap-6 sm:gap-10 -mt-1">
          {['Hospital A', 'Hospital B'].map((hospital) => (
            <div key={hospital} className="flex flex-col items-center">
              <div className="bg-white border border-slate-200 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm">
                {hospital}
              </div>
              <span className="mt-2 text-[10px] sm:text-xs text-slate-400">Authorized users only</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SecuritySection() {
  const reveal = useRevealOnScroll();

  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20`}
      >
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">
            Built with privacy and access control in mind
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Each participating healthcare organization operates within its own logical
            environment, while user access is controlled according to role and authorization.
          </p>
        </div>

        <IsolationDiagram />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:border-brand/40 transition-colors"
            >
              <item.icon className="text-brand mx-auto" size={24} />
              <h3 className="mt-3 font-medium text-slate-800 text-sm">{item.title}</h3>
              <p className="mt-2 text-xs text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
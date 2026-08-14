import { KeyRound, ShieldCheck, Building2, ClipboardList, Database, Lock } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

const items = [
  { icon: KeyRound, title: 'Secure Authentication', text: 'Accounts are protected with hashed credentials and token-based sessions.' },
  { icon: ShieldCheck, title: 'Role-Based Access', text: 'Every user sees only what their role is permitted to see.' },
  { icon: Building2, title: 'Hospital Data Isolation', text: "Each hospital's data is kept in its own logically separated space." },
  { icon: ClipboardList, title: 'Audit Tracking', text: 'Sensitive actions are recorded for accountability and traceability.' },
];

function IsolationPanel() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6" aria-hidden="true">
      <p className="text-white font-medium text-sm">Multi-Tenant Isolation Architecture</p>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
          <Database size={18} className="text-green-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Isolated Tenant Data</p>
            <p className="text-xs text-slate-400">Every query is scoped to one hospital — no cross-tenant access is possible</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
          <Lock size={18} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Encrypted Connections</p>
            <p className="text-xs text-slate-400">Credentials are hashed at rest; traffic runs over HTTPS</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <span className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" /> Hospital Tenant A
        </span>
        <span className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" /> Hospital Tenant B
        </span>
      </div>
    </div>
  );
}

export default function SecuritySection() {
  const reveal = useRevealOnScroll();

  return (
    <section className="bg-brand-dark">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20`}
      >
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge dark>Infrastructure Security</SectionBadge>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-white">Privacy and Security First</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Each participating healthcare organization operates within its own logical
            environment, while user access is controlled according to role and authorization.
          </p>
        </div>

        <div className="mt-10 max-w-lg mx-auto">
          <IsolationPanel />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:bg-white/[0.07] transition-colors"
            >
              <item.icon className="text-blue-300 mx-auto" size={24} />
              <h3 className="mt-3 font-medium text-white text-sm">{item.title}</h3>
              <p className="mt-2 text-xs text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
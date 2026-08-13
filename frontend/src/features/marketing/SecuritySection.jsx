import { KeyRound, ShieldCheck, Building2, ClipboardList } from 'lucide-react';

const items = [
  { icon: KeyRound, title: 'Secure Authentication', text: 'Accounts are protected with encrypted credentials and token-based sessions.' },
  { icon: ShieldCheck, title: 'Role-Based Access', text: 'Every user sees only what their role is permitted to see.' },
  { icon: Building2, title: 'Hospital Data Isolation', text: "Each hospital's data is kept in its own logically separated space." },
  { icon: ClipboardList, title: 'Audit Tracking', text: 'Sensitive actions are recorded for accountability and traceability.' },
];

export default function SecuritySection() {
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">
            Built with privacy and access control in mind
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Each participating healthcare organization operates within its own logical
            environment, while user access is controlled according to role and authorization.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
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
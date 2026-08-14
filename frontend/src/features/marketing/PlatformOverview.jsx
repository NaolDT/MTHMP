import { UserRound, Building2 } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

export default function PlatformOverview() {
  const reveal = useRevealOnScroll();

  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div ref={reveal.ref} className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16`}>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">One platform. Two experiences.</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <UserRound className="text-brand" size={28} />
            <h3 className="mt-4 font-semibold text-slate-800">For Patients</h3>
            <p className="mt-2 text-sm text-slate-500">
              Access participating hospitals, manage appointments, receive notifications,
              and keep track of your healthcare visits.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Building2 className="text-brand" size={28} />
            <h3 className="mt-4 font-semibold text-slate-800">For Healthcare Organizations</h3>
            <p className="mt-2 text-sm text-slate-500">
              Manage departments, doctors, patients, schedules, and appointments from a
              centralized digital workspace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
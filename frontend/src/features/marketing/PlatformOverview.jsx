import { UserRound, Building2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

export default function PlatformOverview() {
  const reveal = useRevealOnScroll();

  return (
    <section className="bg-white py-14 sm:py-20">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6`}
      >
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge>Platform Overview</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">
            One platform. Two experiences.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            MTHMP provides dedicated interfaces tailored to the workflows of both
            patients and healthcare organizations.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <UserRound className="text-brand" size={24} />
            </div>
            <h3 className="mt-5 font-extrabold text-2xl text-slate-900">For Patients</h3>
            <p className="mt-3 text-slate-500">
              Access participating hospitals, manage appointments, receive notifications,
              and keep track of your healthcare visits.
            </p>
            <ul className="mt-5 space-y-2.5">
              {['Easy hospital search', 'Instant appointment booking', 'Email confirmations'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={16} className="text-green-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-6 inline-block rounded-lg bg-brand text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Register as Patient
            </Link>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="text-brand" size={24} />
            </div>
            <h3 className="mt-5 font-extrabold text-2xl text-slate-900">For Healthcare Organizations</h3>
            <p className="mt-3 text-slate-500">
              Manage departments, doctors, patients, schedules, and appointments from a
              centralized digital workspace.
            </p>
            <ul className="mt-5 space-y-2.5">
              {['Dedicated hospital workspace', 'Staff & department management', 'Operational analytics'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={16} className="text-green-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/#for-hospitals"
              className="mt-6 inline-block rounded-lg border border-brand text-brand px-5 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Request Hospital Workspace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
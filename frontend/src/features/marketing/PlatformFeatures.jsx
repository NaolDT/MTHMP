import { Stethoscope, Building2, Users, Bell, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

const supportingFeatures = [
  { icon: Stethoscope, title: 'Doctor Management', text: 'Manage healthcare professionals and their availability.' },
  { icon: Building2, title: 'Department Management', text: 'Organize healthcare services and specialties.' },
  { icon: Users, title: 'Patient Management', text: 'Maintain organized patient information within the hospital workspace.' },
  { icon: Bell, title: 'Notifications', text: 'Keep patients and staff informed about appointment updates.' },
  { icon: BarChart3, title: 'Analytics', text: 'Understand appointment activity and operational trends.' },
];

function AppointmentPreview() {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4" aria-hidden="true">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
        <span className="font-medium text-slate-500">This week</span>
        <Clock size={14} />
      </div>
      <div className="space-y-2">
        {[
          { day: 'Mon', time: '09:00', ok: true },
          { day: 'Wed', time: '14:30', ok: true },
          { day: 'Fri', time: '11:00', ok: false },
        ].map((row) => (
          <div key={row.day + row.time} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
            <span className="text-xs font-medium text-slate-600">{row.day} · {row.time}</span>
            {row.ok ? (
              <CheckCircle2 size={14} className="text-green-600" />
            ) : (
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlatformFeatures() {
  const hero = useRevealOnScroll();
  const grid = useRevealOnScroll();

  return (
    <section id="features" className="bg-slate-50 border-y border-slate-200 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">One platform for healthcare</h2>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Large hero tile */}
          <div
            ref={hero.ref}
            className={`reveal-on-scroll ${hero.isVisible ? 'is-visible' : ''} lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 hover:border-brand/40 transition-colors`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="text-brand" size={20} />
            </div>
            <h3 className="mt-4 font-semibold text-lg text-slate-800">Appointment Management</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Schedule, reschedule, cancel, and track appointments — with automatic
              conflict prevention built in.
            </p>
            <AppointmentPreview />
          </div>

          <div ref={grid.ref} className={`reveal-on-scroll ${grid.isVisible ? 'is-visible' : ''} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5`}>
            {supportingFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-brand/40 hover:-translate-y-1 transition-all duration-200"
              >
                <feature.icon className="text-brand transition-transform duration-200 group-hover:scale-110" size={20} />
                <h3 className="mt-2.5 font-medium text-slate-800 text-sm">{feature.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
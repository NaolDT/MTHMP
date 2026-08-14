import { CalendarClock, Stethoscope, FolderOpen, Users, Bell } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

const supportingFeatures = [
  { icon: Stethoscope, title: 'Doctor Management', text: 'Manage healthcare professionals, their profiles, and their availability.' },
  { icon: FolderOpen, title: 'Department Management', text: 'Organize healthcare services and specialties by department.' },
  { icon: Users, title: 'Patient Management', text: 'Maintain organized patient information within the hospital workspace.' },
  { icon: Bell, title: 'Smart Notifications', text: 'Keep patients and staff informed about appointment updates by email.' },
];

function ActiveQueuePanel() {
  const rows = [
    { day: 'Mon', time: '09:00 AM', doctor: 'Dr. Evans' },
    { day: 'Wed', time: '02:30 PM', doctor: 'Dr. Brooks' },
  ];

  return (
    <div className="mt-6 rounded-xl border border-slate-100 bg-white p-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-900 text-sm">Active Queue</p>
        <span className="text-xs text-slate-400">This week</span>
      </div>
      <div className="mt-3 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.day + row.time} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-slate-700">{row.day} · {row.time}</span>
            <span className="text-sm text-slate-500">{row.doctor}</span>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">Confirmed</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlatformFeatures() {
  const reveal = useRevealOnScroll();

  return (
    <section id="features" className="bg-white py-14 sm:py-20 scroll-mt-16">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6`}
      >
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge>Feature Bento Grid</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">One platform for healthcare</h2>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Large tile */}
          <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarClock className="text-brand" size={24} />
            </div>
            <h3 className="mt-5 font-extrabold text-2xl text-slate-900">Appointment Management</h3>
            <p className="mt-3 text-slate-500 max-w-md">
              Schedule, reschedule, cancel, and track appointments — with automatic
              conflict prevention built directly into the interface.
            </p>
            <ActiveQueuePanel />
          </div>

          {/* Supporting stack */}
          <div className="flex flex-col gap-4">
            {supportingFeatures.map((feature) => (
              <div key={feature.title} className="bg-slate-50 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <feature.icon className="text-brand" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{feature.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
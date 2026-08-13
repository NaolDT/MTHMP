import { CalendarClock, Stethoscope, Building2, Users, Bell, BarChart3 } from 'lucide-react';

const features = [
  { icon: CalendarClock, title: 'Appointment Management', text: 'Schedule, reschedule, cancel, and track appointments.' },
  { icon: Stethoscope, title: 'Doctor Management', text: 'Manage healthcare professionals and their availability.' },
  { icon: Building2, title: 'Department Management', text: 'Organize healthcare services and specialties.' },
  { icon: Users, title: 'Patient Management', text: 'Maintain organized patient information within the hospital workspace.' },
  { icon: Bell, title: 'Notifications', text: 'Keep patients and staff informed about appointment updates.' },
  { icon: BarChart3, title: 'Analytics', text: 'Understand appointment activity and operational trends.' },
];

export default function PlatformFeatures() {
  return (
    <section id="features" className="bg-slate-50 border-y border-slate-200 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">One platform for healthcare</h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <feature.icon className="text-brand" size={24} />
              <h3 className="mt-3 font-medium text-slate-800">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
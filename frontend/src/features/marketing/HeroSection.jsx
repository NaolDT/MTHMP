import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, CalendarCheck } from 'lucide-react';

const trustPoints = [
  { icon: CalendarCheck, label: 'Free for patients' },
  { icon: Lock, label: 'Secure access' },
  { icon: ShieldCheck, label: 'Simple appointment management' },
];

function MockDashboardPreview() {
  const rows = [
    { time: '09:00', status: 'Confirmed', color: 'bg-green-100 text-green-700' },
    { time: '10:30', status: 'Waiting', color: 'bg-amber-100 text-amber-700' },
    { time: '11:00', status: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div
      className="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      aria-hidden="true"
    >
      <div className="bg-brand-dark px-4 py-3 flex items-center justify-between">
        <span className="text-white text-sm font-semibold">MTHMP Platform</span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/40" />
        </div>
      </div>
      <div className="px-4 py-3 border-b border-slate-100 flex gap-4 text-xs text-slate-400">
        <span className="text-brand font-medium border-b-2 border-brand pb-2 -mb-2">Appointments</span>
        <span>Doctors</span>
        <span>Departments</span>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-slate-400 mb-3">Today's Schedule</p>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.time} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
              <span className="text-sm text-slate-600 font-medium">{row.time}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.color}`}>{row.status}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-300 text-center">Illustrative preview — not real data</p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-dark leading-tight">
            Healthcare management, made simpler.
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0">
            MTHMP connects patients and healthcare organizations through a secure digital
            platform for appointment management, hospital operations, and better access to care.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto text-center rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Register as a Patient
            </Link>
            <Link
              to="/#how-it-works"
              className="w-full sm:w-auto text-center rounded-lg bg-white border border-slate-300 text-slate-700 px-6 py-3 font-medium hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2">
            {trustPoints.map((point) => (
              <span key={point.label} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                <point.icon size={16} className="text-brand" />
                {point.label}
              </span>
            ))}
          </div>
        </div>

        <MockDashboardPreview />
      </div>
    </section>
  );
}
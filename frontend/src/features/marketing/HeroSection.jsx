import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, CalendarCheck, CheckCircle2, BellRing } from 'lucide-react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';

const trustPoints = [
  { icon: CalendarCheck, label: 'Free for patients' },
  { icon: Lock, label: 'Secure access' },
  { icon: ShieldCheck, label: 'Simple appointment management' },
];

const states = [
  {
    label: 'Appointments',
    render: () => (
      <div className="space-y-2">
        {[
          { time: '09:00', status: 'Confirmed', color: 'bg-green-100 text-green-700' },
          { time: '10:30', status: 'Waiting', color: 'bg-amber-100 text-amber-700' },
          { time: '11:00', status: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
        ].map((row) => (
          <div key={row.time} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
            <span className="text-sm text-slate-600 font-medium">{row.time}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.color}`}>{row.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Doctors',
    render: () => (
      <div className="space-y-2">
        {[
          { name: 'Dr. A. Bekele', spec: 'Cardiology' },
          { name: 'Dr. S. Mulu', spec: 'Pediatrics' },
          { name: 'Dr. T. Girma', spec: 'Dermatology' },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
            <span className="w-7 h-7 rounded-full bg-blue-50 text-brand text-xs font-semibold flex items-center justify-center shrink-0">
              {doc.name.split(' ')[1]?.[0]}
            </span>
            <div>
              <p className="text-sm text-slate-700 font-medium leading-tight">{doc.name}</p>
              <p className="text-xs text-slate-400">{doc.spec}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Departments',
    render: () => (
      <div className="grid grid-cols-2 gap-2">
        {['Cardiology', 'Pediatrics', 'Dermatology', 'General'].map((dept) => (
          <div key={dept} className="rounded-lg border border-slate-100 px-3 py-3 text-center">
            <p className="text-xs font-medium text-slate-600">{dept}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Confirmation',
    render: () => (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <CheckCircle2 className="text-green-600" size={32} />
        <p className="mt-2 text-sm font-medium text-slate-700">Appointment Confirmed</p>
        <p className="text-xs text-slate-400">Mon, 09:00 — Dr. A. Bekele</p>
      </div>
    ),
  },
];

function MockDashboardPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % states.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const active = states[activeIndex];

  return (
    <div
      className="relative w-full max-w-sm mx-auto lg:mx-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="absolute -inset-6 bg-gradient-to-br from-blue-100 via-blue-50 to-transparent rounded-full blur-2xl opacity-70 -z-10"
        aria-hidden="true"
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" aria-hidden="true">
        <div className="bg-brand-dark px-4 py-3 flex items-center justify-between">
          <span className="text-white text-sm font-semibold">MTHMP Platform</span>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
        <div className="px-4 py-3 border-b border-slate-100 flex gap-4 text-xs text-slate-400">
          {states.map((s, i) => (
            <span key={s.label} className={i === activeIndex ? 'text-brand font-medium' : ''}>
              {s.label}
            </span>
          ))}
        </div>
        <div className="p-4 min-h-[168px]">
          <p className="text-xs font-medium text-slate-400 mb-3">
            {activeIndex === 3 ? 'Booking Result' : "Today's Schedule"}
          </p>
          {active.render()}
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-3">
          {states.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${s.label} preview`}
              aria-current={i === activeIndex}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-4 bg-brand' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-300 text-center">Illustrative preview — not real data</p>

      <div
        className="hidden sm:flex absolute -top-4 -right-6 items-center gap-2 bg-white rounded-lg border border-slate-200 shadow-sm px-3 py-2 animate-float"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      >
        <BellRing size={14} className="text-brand" />
        <span className="text-xs font-medium text-slate-600">Reminder scheduled</span>
      </div>
      <div
        className="hidden sm:flex absolute -bottom-3 -left-8 items-center gap-2 bg-white rounded-lg border border-slate-200 shadow-sm px-3 py-2 animate-float"
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true"
      >
        <CheckCircle2 size={14} className="text-green-600" />
        <span className="text-xs font-medium text-slate-600">Appointment confirmed</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at top, black 40%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
      </div>
    </section>
  );
}
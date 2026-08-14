import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Lock, CalendarCheck, CheckCircle2, BellRing } from 'lucide-react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import SectionBadge from '../../shared/components/SectionBadge';

const trustPoints = [
  { icon: Gift, label: 'Free for patients' },
  { icon: Lock, label: 'Secure access' },
  { icon: CalendarCheck, label: 'Simple scheduler' },
];

const states = [
  {
    label: 'Appointments',
    render: () => (
      <div className="space-y-2.5">
        {[
          { time: '09:00 AM', name: 'Adrian Carter', doc: 'Dr. Rachel Evans', status: 'Confirmed', color: 'bg-green-50 text-green-700' },
          { time: '10:30 AM', name: 'Sophia Martinez', doc: 'Dr. Kyle Brooks', status: 'Waiting', color: 'bg-amber-50 text-amber-700' },
          { time: '11:00 AM', name: 'Marcus Sterling', doc: 'Dr. Rachel Evans', status: 'Scheduled', color: 'bg-blue-50 text-blue-700' },
        ].map((row) => (
          <div key={row.time} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 w-16 shrink-0">{row.time}</span>
              <div>
                <p className="text-sm font-medium text-slate-800 leading-tight">{row.name}</p>
                <p className="text-xs text-slate-400">{row.doc}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${row.color}`}>{row.status}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs text-green-700 font-medium">
          <CheckCircle2 size={14} /> Appointment confirmed with Dr. Evans
        </div>
      </div>
    ),
  },
  {
    label: 'Doctors',
    render: () => (
      <div className="space-y-2.5">
        {[
          { name: 'Dr. A. Bekele', spec: 'Cardiology' },
          { name: 'Dr. S. Mulu', spec: 'Pediatrics' },
          { name: 'Dr. T. Girma', spec: 'Dermatology' },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-brand text-xs font-semibold flex items-center justify-center shrink-0">
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
      <div className="grid grid-cols-2 gap-2.5">
        {['Cardiology', 'Pediatrics', 'Dermatology', 'General'].map((dept) => (
          <div key={dept} className="rounded-lg border border-slate-100 px-3 py-4 text-center">
            <p className="text-sm font-medium text-slate-600">{dept}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Confirmation',
    render: () => (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircle2 className="text-green-600" size={36} />
        <p className="mt-3 text-sm font-medium text-slate-700">Appointment Confirmed</p>
        <p className="text-xs text-slate-400">Mon, 09:00 AM — Dr. A. Bekele</p>
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
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % states.length), 5000);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const active = states[activeIndex];

  return (
    <div
      className="relative w-full max-w-md mx-auto lg:mx-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="rounded-2xl bg-white shadow-2xl shadow-blue-950/30 overflow-hidden" aria-hidden="true">
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-slate-400">MTHMP Platform</span>
        </div>
        <div className="px-5 pt-4 flex items-center justify-between">
          <p className="text-base font-semibold text-slate-800">
            {activeIndex === 3 ? 'Booking Result' : "Today's Schedule"}
          </p>
          {activeIndex !== 3 && <span className="text-xs font-medium text-brand">View Calendar</span>}
        </div>
        <div className="px-5 pb-3 pt-2 flex gap-4 text-xs">
          {states.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActiveIndex(i)}
              className={i === activeIndex ? 'text-brand font-medium' : 'text-slate-400'}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="px-5 pb-5 min-h-[220px]">{active.render()}</div>

        <div className="flex items-center justify-center gap-1.5 pb-4">
          {states.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${s.label} preview`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-5 bg-brand' : 'w-1.5 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <div
        className="hidden sm:flex absolute -top-4 -right-6 items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2 animate-float"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      >
        <BellRing size={14} className="text-brand" />
        <span className="text-xs font-medium text-slate-600">Reminder scheduled</span>
      </div>
      <div
        className="hidden sm:flex absolute -bottom-3 -left-8 items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2 animate-float"
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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-blue-900 to-slate-950">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 75% 30%, rgba(59,130,246,0.4), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <SectionBadge dark>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> MTHMP Platform — Live
              </SectionBadge>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
              Healthcare management,{' '}
              <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                made simpler.
              </span>
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
              MTHMP connects patients and healthcare organizations through a secure digital
              platform for appointment management, hospital operations, and seamless access to care.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center rounded-lg bg-white text-brand-dark px-6 py-3 font-medium hover:bg-slate-100 transition-colors"
              >
                Register as a Patient
              </Link>
              <Link
                to="/#how-it-works"
                className="w-full sm:w-auto text-center rounded-lg border border-white/30 text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                See How It Works →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2">
              {trustPoints.map((point) => (
                <span key={point.label} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
                  <point.icon size={16} className="text-green-400" />
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
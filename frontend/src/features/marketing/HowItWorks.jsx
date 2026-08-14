import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import SectionBadge from '../../shared/components/SectionBadge';

const steps = [
  { number: '01', title: 'Choose your hospital', text: 'Register with a participating hospital on the MTHMP platform.' },
  { number: '02', title: 'Register or log in', text: "Access your hospital's healthcare workspace." },
  { number: '03', title: 'Choose a doctor and time', text: "Browse the hospital's departments, doctors, and available appointment schedules." },
  { number: '04', title: 'Get confirmation', text: 'Book your appointment and receive an email confirmation.' },
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % steps.length), 3500);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  return (
    <section id="how-it-works" className="bg-slate-50 py-14 sm:py-20 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge>Simple Onboarding</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">How it works</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Four simple steps to book care through your hospital's MTHMP workspace.
          </p>
        </div>

        <div
          className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step, i) => (
            <button
              key={step.number}
              onClick={() => setActiveIndex(i)}
              aria-current={i === activeIndex}
              className={`text-left bg-white rounded-2xl border border-slate-100 p-6 transition-colors duration-300 ${
                i === activeIndex ? 'bg-blue-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                    i === activeIndex ? 'bg-brand text-white' : 'bg-blue-50 text-brand'
                  }`}
                >
                  {step.number}
                </span>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
              <h3 className="mt-5 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.text}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
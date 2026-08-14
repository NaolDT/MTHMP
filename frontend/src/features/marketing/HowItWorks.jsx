import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';

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
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 scroll-mt-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">How it works</h2>

      <div
        className="mt-10 sm:mt-14"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Desktop: horizontal timeline */}
        <div className="hidden sm:block">
          <div className="relative flex items-start justify-between">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" aria-hidden="true">
              <div
                className="h-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, i) => (
              <button
                key={step.number}
                onClick={() => setActiveIndex(i)}
                className="relative z-10 flex flex-col items-center text-center w-40 group"
                aria-current={i === activeIndex}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                    i <= activeIndex ? 'bg-brand text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {step.number}
                </span>
                <h3
                  className={`mt-4 font-medium text-sm transition-colors duration-300 ${
                    i === activeIndex ? 'text-brand-dark' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-1.5 text-xs transition-opacity duration-300 ${
                    i === activeIndex ? 'text-slate-500 opacity-100' : 'text-slate-400 opacity-70'
                  }`}
                >
                  {step.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="sm:hidden space-y-0">
          {steps.map((step, i) => (
            <button
              key={step.number}
              onClick={() => setActiveIndex(i)}
              className="w-full flex gap-4 text-left pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                    i <= activeIndex ? 'bg-brand text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {step.number}
                </span>
                {i < steps.length - 1 && (
                  <span className="w-0.5 flex-1 mt-1 bg-slate-200 relative overflow-hidden">
                    <span
                      className="absolute top-0 left-0 w-full bg-brand transition-all duration-500"
                      style={{ height: i < activeIndex ? '100%' : '0%' }}
                    />
                  </span>
                )}
              </div>
              <div className="pb-2">
                <h3 className={`font-medium text-sm ${i === activeIndex ? 'text-brand-dark' : 'text-slate-500'}`}>
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{step.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
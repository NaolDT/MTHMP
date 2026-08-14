import { ArrowRight } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

const journey = [
  { number: '01', title: 'Access your hospital', text: "Log in to your hospital's MTHMP workspace with your patient account." },
  { number: '02', title: 'Explore departments', text: 'Browse the departments and specialties your hospital offers.' },
  { number: '03', title: 'Choose a doctor', text: 'Pick the doctor that fits your care needs.' },
  { number: '04', title: 'Select an available time', text: "See the doctor's real open slots and pick what works for you." },
  { number: '05', title: 'Confirm your appointment', text: 'Your booking is checked for conflicts and confirmed instantly.' },
  { number: '06', title: 'Receive updates', text: 'Get an email confirmation, and updates if anything changes.' },
];

export default function PatientExperience() {
  const reveal = useRevealOnScroll();

  return (
    <section
      ref={reveal.ref}
      className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} bg-slate-50 py-14 sm:py-20`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge>The Blueprint</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">The Patient Journey</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            A simple six-step journey from registration to confirmed care.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {journey.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-brand">{step.number}</span>
                <ArrowRight size={18} className="text-slate-300" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
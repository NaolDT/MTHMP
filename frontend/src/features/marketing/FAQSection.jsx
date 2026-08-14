import { ChevronDown } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

const faqs = [
  { q: 'What is MTHMP?', a: 'MTHMP is a platform that connects patients with participating hospitals and clinics, allowing you to manage healthcare appointments online instead of by phone.' },
  { q: 'Is MTHMP free for patients?', a: 'Yes. Registering and booking appointments as a patient is free.' },
  { q: 'How do I access a hospital?', a: 'When you register, you search for and select the hospital you want to use. Your account is created specifically for that hospital.' },
  { q: 'Can I use MTHMP without registering?', a: 'You can browse this page without an account, but booking an appointment requires registering with a specific hospital first.' },
  { q: 'Can hospitals manage their own staff and departments?', a: 'Yes. Hospital administrators can manage their own departments, doctors, and patient records within their own workspace.' },
  { q: 'Is my information shared with other hospitals?', a: 'No. Each hospital on MTHMP operates in its own separate, logically isolated space. Other hospitals cannot see your information.' },
  { q: 'Does MTHMP provide medical advice?', a: 'No. MTHMP is an appointment and hospital management platform. Any health information shown on this site is for general education only and does not replace professional medical advice.' },
  { q: 'How can a hospital join MTHMP?', a: 'Use the contact form in the "For Hospitals" section above, and the MTHMP team will follow up with you directly.' },
];

export default function FAQSection() {
  const reveal = useRevealOnScroll();

  return (
    <section
      ref={reveal.ref}
      className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} bg-white py-14 sm:py-20`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBadge>FAQ</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-slate-50 rounded-2xl px-5 sm:px-6">
              <summary className="flex items-center justify-between gap-3 py-4 sm:py-5 cursor-pointer list-none font-bold text-slate-900 select-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded">
                {faq.q}
                <ChevronDown
                  size={20}
                  className="text-slate-400 shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="text-sm text-slate-500 leading-relaxed pb-5">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
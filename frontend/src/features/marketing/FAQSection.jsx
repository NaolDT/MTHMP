import { Plus } from 'lucide-react';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

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
      className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20`}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">Frequently Asked Questions</h2>

      <div className="mt-8 space-y-2.5">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group bg-white border border-slate-200 rounded-xl px-4 sm:px-5 hover:border-brand/30 transition-colors"
          >
            <summary className="flex items-center justify-between gap-3 py-3.5 sm:py-4 cursor-pointer list-none font-medium text-sm sm:text-base text-slate-800 select-none focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded">
              {faq.q}
              <Plus
                size={18}
                className="text-slate-400 shrink-0 transition-transform duration-300 group-open:rotate-45 group-open:text-brand"
              />
            </summary>
            <div className="accordion-content">
              <div>
                <p className="text-sm text-slate-500 leading-relaxed pb-4">{faq.a}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
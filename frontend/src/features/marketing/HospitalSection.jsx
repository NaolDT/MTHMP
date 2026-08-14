import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { submitContactInquiry } from '../../api/contact.api';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';
import SectionBadge from '../../shared/components/SectionBadge';

const emptyForm = { hospitalName: '', contactName: '', email: '', phone: '', message: '' };

const previewStats = [
  { label: 'Active Roster', value: '48 Doctors Registered', pill: '92% availability' },
  { label: 'Weekly Patient Intake', value: '1,240 Bookings Handled', pill: '+18% growth' },
  { label: 'Clinic Wait Times', value: 'Avg 8.4 Minutes', pill: '-22% reduced' },
];

function WorkspacePreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8" aria-hidden="true">
      <p className="font-bold text-slate-900">Workspace Operations Preview</p>
      <div className="mt-5 space-y-3">
        {previewStats.map((stat) => (
          <div key={stat.label} className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 font-bold text-slate-900">{stat.value}</p>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              {stat.pill}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-300 text-center">Illustrative preview — not real platform data</p>
    </div>
  );
}

export default function HospitalSection() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const reveal = useRevealOnScroll();

  const mutation = useMutation({
    mutationFn: submitContactInquiry,
    onError: (err) => {
      const details = err.response?.data?.details;
      setError(Array.isArray(details) ? details.join(' ') : err.response?.data?.message || 'Something went wrong. Please try again.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    mutation.mutate(form);
  }

  return (
    <section id="for-hospitals" className="bg-slate-50 py-14 sm:py-20 scroll-mt-16">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6`}
      >
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center">
            <SectionBadge>For Enterprises</SectionBadge>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Bring MTHMP to Your Hospital
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Give your healthcare organization a dedicated digital workspace for
            appointments, doctors, departments, and patients.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkspacePreview />

          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
            {mutation.isSuccess ? (
              <div className="text-center py-10">
                <Check className="mx-auto text-green-600" size={32} />
                <p className="mt-3 font-bold text-slate-900">Thank you!</p>
                <p className="mt-1 text-sm text-slate-500">We've received your inquiry and will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="font-bold text-slate-900">Request Workspace Integration</p>
                <Input
                  id="hospitalName"
                  label="Healthcare Organization Name"
                  placeholder="e.g., General City Hospital"
                  value={form.hospitalName}
                  onChange={(e) => setForm((p) => ({ ...p, hospitalName: e.target.value }))}
                  required
                />
                <Input
                  id="contactName"
                  label="Your Name"
                  value={form.contactName}
                  onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                  required
                />
                <Input
                  id="email"
                  type="email"
                  label="Administrative Email Address"
                  placeholder="admin@hospital.org"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <Input
                  id="phone"
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="message">Message (optional)</label>
                  <textarea
                    id="message"
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                <Button type="submit" isLoading={mutation.isPending} className="w-full">
                  Request Integration Pitch
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
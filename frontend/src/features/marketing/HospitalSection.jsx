import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check, CalendarClock, Stethoscope, Building2, Users, Bell } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { submitContactInquiry } from '../../api/contact.api';
import { useRevealOnScroll } from '../../shared/hooks/useRevealOnScroll';

const capabilities = [
  'Dedicated hospital workspace',
  'Doctor management',
  'Department management',
  'Appointment management',
  'Role-based access',
  'Operational insights',
  'Notifications',
  'Responsive web access',
];

const workspaceStats = [
  { icon: CalendarClock, label: "Today's Appointments", value: '12' },
  { icon: Stethoscope, label: 'Doctors', value: '8' },
  { icon: Building2, label: 'Departments', value: '4' },
  { icon: Users, label: 'Patients', value: '340' },
];

const emptyForm = { hospitalName: '', contactName: '', email: '', phone: '', message: '' };

function HospitalWorkspacePreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden" aria-hidden="true">
      <div className="bg-brand-dark px-4 py-3 flex items-center justify-between">
        <span className="text-white text-sm font-semibold">Hospital Workspace</span>
        <Bell size={14} className="text-white/60" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {workspaceStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-100 px-3 py-2.5">
              <stat.icon size={14} className="text-brand" />
              <p className="mt-1.5 text-lg font-semibold text-slate-800 leading-none">{stat.value}</p>
              <p className="mt-1 text-[10px] text-slate-400 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-300 text-center">Illustrative preview — not real data</p>
      </div>
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
    <section id="for-hospitals" className="bg-white border-t border-slate-200 scroll-mt-16">
      <div
        ref={reveal.ref}
        className={`reveal-on-scroll ${reveal.isVisible ? 'is-visible' : ''} max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">
              Give your healthcare organization a digital workspace.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              MTHMP gives hospitals and clinics a dedicated environment to manage
              appointments, doctors, departments, patients, and daily healthcare workflows.
            </p>

            <div className="mt-6 max-w-sm">
              <HospitalWorkspacePreview />
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {capabilities.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check size={16} className="text-brand shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-slate-400">
              Hospital accounts are currently provisioned directly by the MTHMP team —
              reach out below and we'll be in touch.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 h-fit">
            {mutation.isSuccess ? (
              <div className="text-center py-8">
                <Check className="mx-auto text-green-600" size={32} />
                <p className="mt-3 font-medium text-slate-800">Thank you!</p>
                <p className="mt-1 text-sm text-slate-500">We've received your inquiry and will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-slate-800">Contact MTHMP</h3>
                <Input
                  id="hospitalName"
                  label="Hospital / Clinic Name"
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
                  label="Email"
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
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
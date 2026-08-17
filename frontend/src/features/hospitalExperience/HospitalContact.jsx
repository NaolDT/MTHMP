import { MapPin, Phone, Mail, AlertCircle } from 'lucide-react';

export default function HospitalContact({ contactAddress }) {
  const hasAny = contactAddress?.phone || contactAddress?.email || contactAddress?.city;
  if (!hasAny) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Contact</h2>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        {contactAddress.phone && <p className="flex items-center gap-2"><Phone size={16} className="text-brand" /> {contactAddress.phone}</p>}
        {contactAddress.email && <p className="flex items-center gap-2"><Mail size={16} className="text-brand" /> {contactAddress.email}</p>}
        {contactAddress.city && (
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-brand" />
            {[contactAddress.street, contactAddress.city, contactAddress.region, contactAddress.country].filter(Boolean).join(', ')}
          </p>
        )}
        {contactAddress.emergencyPhone && (
          <p className="flex items-center gap-2 text-red-600"><AlertCircle size={16} /> Emergency: {contactAddress.emergencyPhone}</p>
        )}
      </div>
    </section>
  );
}
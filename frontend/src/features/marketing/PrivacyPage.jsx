import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold text-brand-dark">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: [DATE]</p>

        <div className="mt-8 space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">1. Information We Collect</h2>
            <p>When you register, we collect your name, email, phone number, date of birth, and gender. When you book an appointment, we store the appointment details (doctor, date, time, reason for visit if provided).</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">2. How Your Information Is Used</h2>
            <p>Your information is used to manage your account, process appointment bookings, and send you appointment confirmations and updates by email.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">3. Data Isolation Between Hospitals</h2>
            <p>Your data is only accessible to the specific hospital you registered with, and to platform administrators for support and operational purposes. It is never shared with other hospitals on the Platform.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">4. Data Security</h2>
            <p>Passwords are stored using industry-standard one-way hashing and are never stored or visible in plain text, including to platform staff.</p>
          </section>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          This is placeholder content and does not constitute legal advice. Replace with a policy reviewed by qualified legal counsel, particularly regarding health-data regulations applicable in your jurisdiction, before handling real patient data.
        </p>
      </div>
      <PublicFooter />
    </div>
  );
}
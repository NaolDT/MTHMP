import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <h1 className="text-2xl sm:text-3xl font-semibold text-brand-dark">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: [DATE]</p>

        <div className="mt-8 space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">1. Acceptance of Terms</h2>
            <p>By registering for or using MTHMP ("the Platform"), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Platform.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">2. Use of the Platform</h2>
            <p>The Platform allows patients to book appointments with participating hospitals, and allows hospitals to manage their own departments, doctors, and patients. Each hospital's data is kept separate and is not accessible to other hospitals on the Platform.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">3. Appointment Policies</h2>
            <p>Appointments are subject to each hospital's own cancellation policy. Patients must generally provide at least 24 hours' notice to cancel an appointment; late cancellations may only be processed by hospital staff.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">4. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
          </section>
          <section>
            <h2 className="font-semibold text-slate-800 mb-2">5. Changes to These Terms</h2>
            <p>These Terms may be updated from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>
          </section>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          This is placeholder content and does not constitute legal advice. Replace with terms reviewed by qualified legal counsel before handling real patient data.
        </p>
      </div>
      <PublicFooter />
    </div>
  );
}
import { Link } from 'react-router-dom';
import PublicHeader from '../../shared/components/PublicHeader';
import PublicFooter from '../../shared/components/PublicFooter';
import { useScrollToHash } from '../../shared/hooks/useScrollToHash';

const steps = [
  { title: 'Find your hospital', text: 'Search for your hospital by name when you register.' },
  { title: 'Pick a doctor and time', text: 'Browse departments and doctors, see real open slots, and choose what works for you.' },
  { title: 'Get confirmed', text: 'Your appointment is booked instantly and confirmed by email — no phone call needed.' },
];




export default function HomePage() {
    useScrollToHash();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold text-brand-dark leading-tight">
          Hospital appointments,<br className="hidden sm:block" /> without the phone call
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
          MTHMP connects patients with their hospital's doctors and departments —
          book, manage, and track your appointments in one place, for every
          hospital on the platform.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center rounded-lg bg-brand text-white px-6 py-3 font-medium hover:bg-blue-700"
          >
            Register as a Patient
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-center rounded-lg bg-white border border-slate-300 text-slate-700 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Log In
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">How it works</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center mx-auto text-sm font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-medium text-slate-800">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark">Running a hospital or clinic?</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            MTHMP gives your hospital its own private space on the platform —
            manage departments, doctors, and patients, with nothing ever
            visible to any other hospital.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Hospital accounts are provisioned by the MTHMP team — contact us to get started.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
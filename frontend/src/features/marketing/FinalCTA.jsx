import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="bg-brand-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">
          Ready to make healthcare appointments simpler?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Create your patient account and access participating healthcare services through MTHMP.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center rounded-lg bg-white text-brand-dark px-6 py-3 font-medium hover:bg-slate-100 transition-colors"
          >
            Register as a Patient
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-center rounded-lg border border-white/30 text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
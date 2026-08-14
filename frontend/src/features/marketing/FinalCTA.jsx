import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-blue-900">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(37,99,235,0.35), transparent 70%)' }}
        aria-hidden="true"
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="network" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="white" />
            <circle cx="70" cy="40" r="2" fill="white" />
            <circle cx="30" cy="65" r="2" fill="white" />
            <line x1="10" y1="10" x2="70" y2="40" stroke="white" strokeWidth="1" />
            <line x1="70" y1="40" x2="30" y2="65" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network)" />
      </svg>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to make healthcare appointments simpler?
        </h2>
        <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
          Create your patient account and access participating healthcare services through MTHMP.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center rounded-lg bg-white text-brand-dark px-7 py-3.5 font-medium hover:bg-slate-100 hover:-translate-y-0.5 transition-all duration-200"
          >
            Register as a Patient
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-center rounded-lg border border-white/30 text-white px-7 py-3.5 font-medium hover:bg-white/10 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
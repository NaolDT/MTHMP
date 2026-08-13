const steps = [
  { number: '01', title: 'Choose your hospital', text: 'Register with a participating hospital on the MTHMP platform.' },
  { number: '02', title: 'Register or log in', text: "Access your hospital's healthcare workspace." },
  { number: '03', title: 'Choose a doctor and time', text: "Browse the hospital's departments, doctors, and available appointment schedules." },
  { number: '04', title: 'Get confirmation', text: 'Book your appointment and receive an email confirmation.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 scroll-mt-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">How it works</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step) => (
          <div key={step.number} className="bg-white rounded-xl border border-slate-200 p-5">
            <span className="text-xs font-semibold text-brand">{step.number}</span>
            <h3 className="mt-2 font-medium text-slate-800">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
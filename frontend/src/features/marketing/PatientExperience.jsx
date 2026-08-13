const journey = [
  'Access your hospital',
  'Explore departments',
  'Choose a doctor',
  'Select an available time',
  'Confirm your appointment',
  'Receive updates',
];

export default function PatientExperience() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-xl sm:text-2xl font-semibold text-brand-dark text-center">Designed around the patient</h2>

      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
        {journey.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-4 py-2">
              <span className="w-5 h-5 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 whitespace-nowrap">{step}</span>
            </div>
            {i < journey.length - 1 && (
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export default function HospitalFacilities({ facilities }) {
  if (facilities.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Facilities</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {facilities.map((f) => (
          <span key={f} className="bg-blue-50 text-brand text-sm font-medium px-3 py-1.5 rounded-full">{f}</span>
        ))}
      </div>
    </section>
  );
}
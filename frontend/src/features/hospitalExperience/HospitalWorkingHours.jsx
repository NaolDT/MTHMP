export default function HospitalWorkingHours({ workingHours }) {
  if (!workingHours || workingHours.length === 0) return null;
  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Working Hours</h2>
        <div className="mt-4 max-w-sm space-y-1.5">
          {workingHours.map((row) => (
            <div key={row.day} className="flex justify-between text-sm">
              <span className="capitalize text-slate-600">{row.day}</span>
              <span className="text-slate-400">{row.isOpen ? `${row.openTime} – ${row.closeTime}` : 'Closed'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
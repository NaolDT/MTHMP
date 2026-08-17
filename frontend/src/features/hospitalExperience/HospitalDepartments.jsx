export default function HospitalDepartments({ departments }) {
  if (departments.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Departments</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept._id} className="bg-white border border-slate-100 rounded-xl p-4">
            <p className="font-bold text-slate-900 text-sm">{dept.name}</p>
            {dept.description && <p className="mt-1 text-xs text-slate-500">{dept.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
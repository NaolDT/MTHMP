export default function HospitalServices({ departments }) {
  const departmentsWithServices = departments.filter((d) => d.services?.length > 0);
  if (departmentsWithServices.length === 0) return null;

  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Services</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentsWithServices.flatMap((dept) =>
            dept.services.map((service) => (
              <div key={`${dept._id}-${service.name}`} className="bg-white rounded-xl p-4">
                <p className="text-xs text-brand font-medium">{dept.name}</p>
                <p className="mt-1 font-bold text-slate-900 text-sm">{service.name}</p>
                {service.description && <p className="mt-1 text-xs text-slate-500">{service.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
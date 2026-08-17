import { Link } from 'react-router-dom';

export default function HospitalDoctors({ doctors, tenantSlug }) {
  if (doctors.length === 0) return null;

  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Our Doctors</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 overflow-hidden shrink-0">
                  {doc.photoUrl ? (
                    <img src={doc.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand font-bold">
                      {doc.userId?.firstName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    Dr. {doc.userId?.firstName} {doc.userId?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{doc.specialization}</p>
                </div>
              </div>
              {doc.bio && <p className="mt-3 text-xs text-slate-500 line-clamp-2">{doc.bio}</p>}
              {doc.languages?.length > 0 && (
                <p className="mt-2 text-[11px] text-slate-400">Speaks: {doc.languages.join(', ')}</p>
              )}
              <Link
                to={`/register?hospital=${tenantSlug}`}
                className="mt-3 inline-block text-xs font-medium text-brand hover:underline"
              >
                Book an appointment →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
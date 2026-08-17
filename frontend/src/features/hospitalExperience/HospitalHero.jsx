export default function HospitalHero({ tenant, profile }) {
  return (
    <div className="relative">
      <div className="h-48 sm:h-64 bg-slate-100 overflow-hidden">
        {profile.coverImageUrl ? (
          <img src={profile.coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-dark to-blue-900" />
        )}
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="-mt-10 sm:-mt-14 flex items-end gap-4">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden shrink-0">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={`${tenant.name} logo`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-50 flex items-center justify-center text-brand font-extrabold text-2xl">
                {tenant.name?.[0]}
              </div>
            )}
          </div>
          <div className="pb-2 sm:pb-3">
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900">{tenant.name}</h1>
            {profile.tagline && <p className="text-sm sm:text-base text-slate-500 mt-0.5">{profile.tagline}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
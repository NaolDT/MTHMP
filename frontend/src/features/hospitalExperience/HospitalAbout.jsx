export default function HospitalAbout({ profile }) {
  if (!profile.shortDescription && !profile.fullDescription && !profile.history && !profile.mission && !profile.vision) {
    return null; 
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">About</h2>
      {profile.shortDescription && <p className="mt-3 text-slate-600">{profile.shortDescription}</p>}
      {profile.fullDescription && <p className="mt-3 text-sm text-slate-500 leading-relaxed">{profile.fullDescription}</p>}

      {(profile.mission || profile.vision) && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.mission && (
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-xs font-semibold text-brand uppercase tracking-wide">Mission</p>
              <p className="mt-2 text-sm text-slate-600">{profile.mission}</p>
            </div>
          )}
          {profile.vision && (
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-xs font-semibold text-brand uppercase tracking-wide">Vision</p>
              <p className="mt-2 text-sm text-slate-600">{profile.vision}</p>
            </div>
          )}
        </div>
      )}

      {profile.history && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">History</p>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{profile.history}</p>
          {profile.foundingYear && <p className="mt-1 text-xs text-slate-400">Founded {profile.foundingYear}</p>}
        </div>
      )}
    </section>
  );
}
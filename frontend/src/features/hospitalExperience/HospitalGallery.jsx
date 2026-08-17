export default function HospitalGallery({ gallery }) {
  if (!gallery || gallery.length === 0) return null; // clean skip, per your empty-state rule — no gallery editor yet, so usually empty
  const sorted = [...gallery].sort((a, b) => a.order - b.order);
  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Gallery</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sorted.map((img) => (
            <img key={img.url} src={img.url} alt={img.caption || ''} className="w-full aspect-square object-cover rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
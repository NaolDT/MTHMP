export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-brand-dark">{value}</p>
    </div>
  );
}
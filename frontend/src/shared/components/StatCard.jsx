export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs sm:text-sm text-slate-500">{label}</p>
        {Icon && (
          <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-brand" />
          </span>
        )}
      </div>
      <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
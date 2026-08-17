export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border px-3 py-2 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
          ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
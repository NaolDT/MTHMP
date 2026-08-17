export default function Badge({ active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}
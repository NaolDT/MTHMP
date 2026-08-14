export default function SectionBadge({ children, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
        dark ? 'bg-white/10 text-blue-200' : 'bg-blue-50 text-brand'
      }`}
    >
      {children}
    </span>
  );
}
export default function Button({ children, variant = 'primary', className = '', isLoading, disabled, ...props }) {
  const base = 'w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'Please wait…' : children}
    </button>
  );
}
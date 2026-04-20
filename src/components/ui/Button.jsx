import Spinner from './Spinner.jsx';

const variants = {
  primary: 'bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20',
  ghost: 'bg-transparent text-primary border border-primary/30 hover:bg-primary/5',
  danger: 'bg-rose-500 text-white hover:opacity-90',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        font-semibold text-sm transition-all active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner className="text-current text-base" />}
      {children}
    </button>
  );
}

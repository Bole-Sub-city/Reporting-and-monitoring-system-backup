export default function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full rounded-xl border bg-navy-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500',
          'transition-colors duration-200',
          'focus:border-gold-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/20',
          error ? 'border-red-400/70' : 'border-white/15',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

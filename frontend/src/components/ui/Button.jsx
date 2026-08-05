const variants = {
  primary:
    'bg-navy-800 text-white hover:bg-navy-700 btn-brand-shadow font-semibold',
  outline:
    'border border-navy-800 text-navy-800 hover:bg-navy-50 bg-transparent',
  ghost:
    'border border-white/30 text-white hover:bg-white/10 bg-transparent',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-800/40 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

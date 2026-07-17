import logo from '../../assets/logo.jpg'

export default function Logo({ size = 'lg', className = '' }) {
  const sizes = {
    sm: 'h-24 w-24',
    md: 'h-28 w-28 sm:h-32 sm:w-32',
    lg: 'h-36 w-36 sm:h-44 sm:w-44',
  }

  return (
    <div
      className={[
        'logo-glow overflow-hidden rounded-full border border-white/10 bg-white',
        sizes[size],
        className,
      ].join(' ')}
    >
      <img
        src={logo}
        alt="Buusaa Gonofaa logo"
        className="h-full w-full object-contain"
      />
    </div>
  )
}

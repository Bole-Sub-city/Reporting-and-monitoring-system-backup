import logo from '../../assets/adamalogo.png'

export default function Logo({ size = 'lg', className = '' }) {
  const sizes = {
    sm: 'h-24 w-24',
    md: 'h-28 w-28 sm:h-32 sm:w-32',
    lg: 'h-36 w-36 sm:h-44 sm:w-44',
  }

  return (
    <img
      src={logo}
      alt="Adama City Administration logo"
      className={['rounded-full object-cover', sizes[size], className].join(' ')}
    />
  )
}

import { useState, useRef, useEffect } from 'react'

export default function RoleSelect({ label, value, onChange, options, error }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.id === value)

  const handleSelect = (id) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="w-full text-left" ref={ref}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={[
          'w-full flex items-center justify-between rounded-xl border bg-navy-900/60 px-4 py-3 text-sm text-white',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gold-500/20',
          open ? 'border-gold-500/70' : error ? 'border-red-400/70' : 'border-white/15',
        ].join(' ')}
      >
        <span className={selected ? 'text-white' : 'text-slate-500'}>
          {selected ? selected.label : 'Choose a role'}
        </span>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul className="absolute z-50 mt-1.5 w-auto min-w-[var(--trigger-w)] rounded-xl border border-white/10
                       bg-navy-900 shadow-xl overflow-hidden"
          style={{ width: ref.current?.offsetWidth }}
        >
          {options.map((opt) => {
            const isActive = opt.id === value
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={[
                    'w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-gold-500 text-navy-950'
                      : 'text-slate-200 hover:bg-gold-500 hover:text-navy-950',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}

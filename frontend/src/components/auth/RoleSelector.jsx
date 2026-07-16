function RoleIcon({ type }) {
  const iconClass = 'h-6 w-6'

  if (type === 'shield') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  }

  if (type === 'building') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5M3.75 21V5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25V21M9 21v-4.875c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21M9 9h.008v.008H9V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0H15v.008h-.375V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    )
  }

  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  )
}

export default function RoleSelector({ roles, selectedRole, onSelect, error }) {
  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-medium text-slate-300">
        Select your role
      </p>
      <div
        className="grid gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Select your role"
      >
        {roles.map((role) => {
          const isSelected = selectedRole === role.id

          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(role.id)}
              className={[
                'group rounded-2xl border p-4 text-left transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60',
                isSelected
                  ? 'border-gold-500/80 bg-gold-500/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'border-white/10 bg-navy-900/40 hover:border-white/25 hover:bg-navy-900/70',
              ].join(' ')}
            >
              <div
                className={[
                  'mb-3 inline-flex rounded-xl p-2 transition-colors',
                  isSelected
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'bg-white/5 text-slate-400 group-hover:text-slate-200',
                ].join(' ')}
              >
                <RoleIcon type={role.icon} />
              </div>
              <p
                className={[
                  'font-serif text-base font-semibold',
                  isSelected ? 'text-gold-400' : 'text-white',
                ].join(' ')}
              >
                {role.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {role.description}
              </p>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

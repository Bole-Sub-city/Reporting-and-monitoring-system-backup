import Logo from "../ui/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-navy-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_55%)]"
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="md" className="mb-5" />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-500">
            Adama, Oromia
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-gold-gradient sm:text-4xl">
            Adamaa Bole Sub-City Administration
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Reporting &amp; Monitoring System
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}

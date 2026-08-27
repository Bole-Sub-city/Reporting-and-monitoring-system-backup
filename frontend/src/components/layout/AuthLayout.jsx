import Logo from "../ui/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#eef2f7]">

      <main className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center px-6 py-10 sm:px-10">

        {/* ── Above-card header ── */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Logo – gradient bar removed */}
          <div className="flex flex-col items-center">
            <Logo size="md" className="mb-3 shadow-md" />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#64748b]">
            Adama, Oromia
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1a3a5c] sm:text-4xl">
            Adama Bole Sub-City Administration
          </h1>
          <p className="mt-1 max-w-md text-sm text-[#64748b]">
            Reporting &amp; Monitoring System
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}

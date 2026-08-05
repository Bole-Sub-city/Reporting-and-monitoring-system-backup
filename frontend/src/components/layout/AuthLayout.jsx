import Logo from "../ui/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f4f6f9]">
      {/* Thin top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a3a5c]" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="md" className="mb-5" />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#64748b]">
            Adama, Oromia
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#1a3a5c] sm:text-4xl">
            Adama Bole Sub-City Administration
          </h1>
          <p className="mt-2 max-w-md text-sm text-[#64748b]">
            Reporting &amp; Monitoring System
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}

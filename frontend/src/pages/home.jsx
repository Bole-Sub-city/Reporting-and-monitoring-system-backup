import { Link } from "react-router-dom";
import logo from "../assets/adamalogo.png";

function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white font-['DM_Sans',system-ui,sans-serif]">
      {/* ── Login button – floats top-right ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-end px-6 py-5 pointer-events-none">
        <nav className="pointer-events-auto">
          <Link
            to="/login"
            className="border border-white/50 text-white/90 px-6 py-2 rounded-full text-sm font-medium
                       hover:bg-white/10 hover:border-white/80 transition-all duration-200"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        className="min-h-screen flex items-center justify-center text-center px-4 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #1a3060 0%, #0d1f3c 45%, #070f1e 100%)",
        }}
      >
        {/* bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070f1e]/60 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto animate-rise">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Buusaa Gonofaa logo"
              className="w-32 h-32 rounded-full object-cover shadow-2xl"
            />
          </div>

          {/* Location badge */}
          <p className="inline-block mb-5 tracking-[0.2em] uppercase text-xs font-semibold text-[#d4af62]">
            Adama, Oromia
          </p>

          {/* Title */}
          <h1 className="font-['Fraunces',Georgia,serif] text-4xl md:text-6xl font-bold leading-tight text-[#d4af62] mb-4">
            Bulchiinsa Kutaa Magaalaa Adaamaa Boolee
          </h1>

          {/* Subtitle */}
          <p className="text-[#9aafc7] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
            Reporting and monitoring for Sub-city, Wereda, and Section teams —
            daily, weekly, and monthly submissions in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#about"
              className="bg-[#c9a84c] hover:bg-[#b8963e] text-[#0a1628] font-semibold
                         px-7 py-3 rounded-full text-sm tracking-wide transition-all duration-200
                         hover:-translate-y-0.5"
            >
              About System
            </a>
            <a
              href="#about2"
              className="border border-white/35 text-white/90 font-semibold
                         px-7 py-3 rounded-full text-sm tracking-wide
                         hover:bg-white/8 hover:border-white/70 transition-all duration-200"
            >
              About Service
            </a>
          </div>
        </div>
      </section>

      {/* ── About System ── */}
      <section
        id="about"
        className="py-20 border-t border-[#c9a84c]/15"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #1a3060 0%, #0d1f3c 45%, #070f1e 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#d4af62]
                         border-l-4 border-[#c9a84c] pl-4 mb-5"
          >
            Bulchiinsa Kutaa magaalaa Adaamaa Booleetiif kan qophaa'e
          </h2>
          <p className="text-[#9aafc7] text-base leading-relaxed">
            place holder
          </p>
        </div>
      </section>

      {/* ── About Service ── */}
      <section
        id="about2"
        className="py-20 border-t border-[#c9a84c]/15"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #152b50 0%, #0a1a30 50%, #060d1c 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#d4af62]
                         border-l-4 border-[#c9a84c] pl-4 mb-5"
          >
            Bussaa Gonofaa
          </h2>
          <p className="text-[#9aafc7] text-base leading-relaxed mb-10">
            Busaa Gonofaa jechuun miira huumaniitarii (namoomaa) irratti
            hundaa'uun caasaa mootummaa Naannoo Oromiyaa keessatti lubbuu dhala
            namaa baraaruu fi jireenya lammiilee sababa adda addaan rakkatan
            salphisuuf hundaa'e dha. Caasaan kun aadaa wal-gargaarsa Oromoo
            durii guutuu biyyattii keessatti beekamu irratti hundaa'uun,
            Balaawwan Ittisuu fi Qophaa'ummaa, Gargaarsa Hatattamaa
            Qaqqabsiisuu, Deeggarsa Buqqaatotaa (IDPs), Sagantaa Nyaata Mana
            Barumsaa fi Hawaasa Of-dandachisuu.
          </p>

          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#d4af62]
                         border-l-4 border-[#c9a84c] pl-4 mb-5"
          >
            Revenue
          </h2>
          <p className="text-[#9aafc7] text-base leading-relaxed">
            place holder
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0a1628] border-t border-[#c9a84c]/20 py-6 text-center text-[#9aafc7] text-sm">
        Busaa Gonofaa Reporting System &middot; Adama, Oromia
      </footer>
    </div>
  );
}

export default Home;

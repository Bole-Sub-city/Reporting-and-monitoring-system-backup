import { Link } from "react-router-dom";
import logo from "../assets/adamalogo.png";

function Home() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#1e293b] font-['DM_Sans',system-ui,sans-serif]">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-end px-6 py-5 pointer-events-none bg-[#f4f6f9]/90 backdrop-blur-sm border-b border-[#e2e8f0]">
        <nav className="pointer-events-auto">
          <Link
            to="/login"
            className="bg-[#1a3a5c] text-white px-6 py-2 rounded-full text-sm font-medium
                       hover:bg-[#1e4976] transition-all duration-200"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 pt-16 relative overflow-hidden bg-[#f4f6f9]">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a3a5c]" />

        <div className="relative z-10 max-w-3xl mx-auto animate-rise">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Buusaa Gonofaa logo"
              className="w-28 h-28 rounded-full object-cover shadow-lg ring-4 ring-[#e2e8f0]"
            />
          </div>

          {/* Location badge */}
          <p className="inline-block mb-4 tracking-[0.2em] uppercase text-xs font-semibold text-[#64748b] bg-[#eef4fb] border border-[#dce8f4] px-3 py-1 rounded-full">
            Adama, Oromia
          </p>

          {/* Title */}
          <h1 className="font-['Fraunces',Georgia,serif] text-4xl md:text-5xl font-bold leading-tight text-[#1a3a5c] mb-5 mt-4">
            Bulchiinsa Kutaa Magaalaa Adaamaa Boolee
          </h1>

          {/* Subtitle */}
          <p className="text-[#64748b] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Reporting and monitoring for Sub-city, Wereda, and Section teams —
            daily, weekly, and monthly submissions in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#about"
              className="bg-[#1a3a5c] hover:bg-[#1e4976] text-white font-semibold
                         px-7 py-3 rounded-full text-sm tracking-wide transition-all duration-200
                         hover:-translate-y-0.5 shadow-sm"
            >
              About System
            </a>
            <a
              href="#about2"
              className="border border-[#1a3a5c]/30 text-[#1a3a5c] font-semibold
                         px-7 py-3 rounded-full text-sm tracking-wide bg-white
                         hover:bg-[#eef4fb] hover:border-[#1a3a5c]/60 transition-all duration-200"
            >
              About Service
            </a>
          </div>
        </div>
      </section>

      {/* ── About System ── */}
      <section
        id="about"
        className="py-20 border-t border-[#e2e8f0] bg-white"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#1a3a5c]
                         border-l-4 border-[#1a3a5c] pl-4 mb-5"
          >
            Bulchiinsa Kutaa magaalaa Adaamaa Booleetiif kan qophaa'e
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed">
            place holder
          </p>
        </div>
      </section>

      {/* ── About Service ── */}
      <section
        id="about2"
        className="py-20 border-t border-[#e2e8f0] bg-[#f4f6f9]"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#1a3a5c]
                         border-l-4 border-[#1a3a5c] pl-4 mb-5"
          >
            Buusaa Gonofaa
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed mb-10">
            Buusaa Gonofaa jechun miira huumaniitarii (namoomaa) irratti
            hundaa'uun caasaa mootummaa Naannoo Oromiyaa keessatti lubbuu dhala
            namaa baraaruu fi jireenya lammiilee sababa adda addaan rakkatan
            salphisuuf hundaa'e dha. Caasaan kun aadaa wal-gargaarsa Oromoo
            durii guutuu biyyattii keessatti beekamu irratti hundaa'uun,
            Balaawwan Ittisuu fi Qophaa'ummaa, Gargaarsa Hatattamaa
            Qaqqabsiisuu, Deeggarsa Buqqaatotaa (IDPs), Sagantaa Nyaata Mana
            Barumsaa fi Hawaasa Of-dandachisuu.
          </p>

          <h2
            className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#1a3a5c]
                         border-l-4 border-[#1a3a5c] pl-4 mb-5"
          >
            Gelii sassaabu
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed">
           Galii sassaabuun madda maallaqaa mootummaan ykn dhaabbanni tokko tajaajila hawaasaa, misoomaa fi bulchiinsaaf akka ooluuf gibira, taaksii fi kaffaltii garaagaraa daldaltootaa fi lammiirraa seeraan walitti qabudha Faayidaa Galii SassaabuuMisooma Ijaarsaa: Daandii, mana barnootaa fi hospitaala ijaaruuf gargaara.Tajaajila Hawaasaa: Fayyaa, barnoota fi nageenya mirkaneessa.Diinagdee Cimseetti motummaa walabummaan akka hojjetu taasisaa.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a3a5c] border-t border-[#1e4976] py-6 text-center text-white/60 text-sm">
         Reporting System &middot; Adama, Oromia
      </footer>
    </div>
  );
}

export default Home;

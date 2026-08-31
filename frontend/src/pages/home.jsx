import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/adamalogo.png";

/* ─────────────────────────────────────────────────────────────
   TAB DEFINITIONS
   Each tab has a label, a card header title, and body content.
   Tabs without real text yet use "placeholder".
───────────────────────────────────────────────────────────────*/
const TABS = [
  {
    label: "Buusaa Gonofaa",
    heading: "Buusaa Gonofaa fi Hawaasa Of-dandachisuu",
    body: (
      <>
        <p className="text-[#475569] text-sm leading-relaxed">
          Buusaa Gonofaa jechun miira huumaniitarii (namoomaa) irratti
          hundaa&apos;uun caasaa mootummaa Naannoo Oromiyaa keessatti lubbuu dhala
          namaa baraaruu fi jireenya lammiilee sababa adda addaan rakkatan
          salphisuuf hundaa&apos;e dha. Caasaan kun aadaa wal-gargaarsa Oromoo
          durii guutuu biyyattii keessatti beekamu irratti hundaa&apos;uun,
          Balaawwan Ittisuu fi Qophaa&apos;ummaa, Gargaarsa Hatattamaa
          Qaqqabsiisuu, Deeggarsa Buqqaatotaa (IDPs), Sagantaa Nyaata Mana
          Barumsaa fi Hawaasa Of-dandachisuu.
        </p>
      </>
    ),
  },
  {
    label: "Qonna",
    heading: "Qonna",
    body: (
      <p className="text-[#475569] text-sm leading-relaxed">Qonnaa jechuun hojii oomisha 
       midhaanii fi beeyladaa gaggeessuun jireenya hawaasaa fi guddina dinagdee keessatti gahee
       olaanaa qabuudha. Qonni madda nyaataa, galii fi carraa hojii uumuu keessatti murteessaa
       taʼee, misooma baadiyyaa fi guddina dinagdee biyya keenyaa keessatti buʼaa guddaa qaba.
       Sirna qonnaa ammayyaa, teeknooloojii fi mala qonnaa fooyyaʼaa fayyadamuun oomishtummaa 
       fi qulqullina oomishaa guddisuun, jireenya qonnaan bulaa fooyyeessuu fi
       misooma waaraa mirkaneessuuf murteessaa dha.</p>
    ),
  },
  {
    label: "Galii Sassaabu",
    heading: "Galii sassaabu",
    body: (
      <p className="text-[#475569] text-sm leading-relaxed">
        Galii sassaabuun madda maallaqaa mootummaan ykn dhaabbanni tokko
        tajaajila hawaasaa, misoomaa fi bulchiinsaaf akka ooluuf gibira, taaksii
        fi kaffaltii garaagaraa daldaltootaa fi lammiirraa seeraan walitti
        qabudha. Faayidaa Galii Sassaabuun Misooma Ijaarsaa: Daandii, mana
        barnootaa fi hospitaala ijaaruuf gargaara. Tajaajila Hawaasaa: Fayyaa,
        barnoota fi nageenya mirkaneessa. Diinagdee Cimseetti motummaa
        walabummaan akka hojjetu taasisaa.
      </p>
    ),
  },
  {
    label: "Carraa Hojii Uumuu",
    heading: "Carraa Hojii Uumuu",
    body: (
      <p className="text-[#475569] text-sm leading-relaxed">Carraa Hojii Uumuu jechuun 
      namootaaf hojii fi madda galii ittiin argatan uumuun, dandeettii fi beekumsa isaanii 
      fayyadamuuf carraa bal’aa kennuudha. Carraan hojii uumamuun hoji-dhabdummaa hir’isuu, 
      galii maatii fi jireenya hawaasaa fooyyeessuu, akkasumas guddina dinagdee fi misooma 
      waaraa keessatti gahee olaanaa qaba. Hawaasaaf carraa hojii haqa qabeessaa fi itti 
      fufiinsa qabu uumuu jechuun humna namaa gara oomishaatti jijjiiruu fi 
      guddina biyyaaf gumaacha taasisuudha.</p>
    ),
  },
  {
    label: "Daldalaa",
    heading: "Daldalaa",
    body: (
      <p className="text-[#475569] text-sm leading-relaxed">Daldalaan jechuun sochii 
      bitinsaa fi gurgurtaa oomishootaa fi tajaajilootaati. Innis oomishaalee fi 
      tajaajiloota gabaa keessatti dhiyeessuun, bituun, gurguruun fi misooma
      diinagdee keessatti gahee guddaa qaba.
</p>
    ),
  },
  {
    label: "ATK",
    heading: "ATK",
    body: (
      <p className="text-[#475569] text-sm leading-relaxed">ATK jechuun dhaabbata ykn damee 
      hojii mootummaa keessatti tajaajila uummataaf kennamu, karoorfamee raawwatamu fi 
      hordoffii taasifamu keessaa tokko jechuun ibsamuu danda’a. Hojiiwwan isaa bu’a
      qabeessummaa, qulqullina tajaajilaa fi itti gaafatamummaa cimsuun misooma
      hawaasummaa fi dinagdee keessatti gahee guddaa qaba.
</p>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────────*/
function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const currentTab = TABS[activeTab];

  return (
    <div className="min-h-screen bg-white text-[#1e293b] font-['DM_Sans',system-ui,sans-serif]">

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0a1628]/95 backdrop-blur-sm">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
          />
          <span className="text-white text-sm font-semibold leading-tight hidden sm:block">
            Bulchiinsa Magaalaa Adaama<br />
            <span className="text-[#93c5fd] font-normal text-xs">Kutaa Magaalaa Boolee</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/login"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] font-bold
                       px-7 py-3 rounded-full text-sm tracking-wide transition-all duration-200
                       hover:-translate-y-0.5 shadow-lg">
           Login
          </Link>
        </nav>
      </header>

      {/* ══════════════════════════════════════════
          HERO  (dark navy background)
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-10 overflow-hidden bg-[#0a1628]">

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#1d6fce]/20 blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 mb-6">
          <div className="w-24 h-24 rounded-full bg-[#1a3a6e] ring-4 ring-[#1d6fce]/50 shadow-xl flex items-center justify-center overflow-hidden">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Title */}
        <h1 className="relative z-10 font-['Fraunces',Georgia,serif] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 animate-rise">
          Bulchiinsa Magaalaa Adaamatti<br />
          <span className="text-[#f59e0b]">Kutaa Magaalaa Boolee</span>
        </h1>

        {/* Subtitle — exact original text */}
        <p className="relative z-10 text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-rise">
          Reporting and monitoring for Adama City Bole Sub-City
          daily, weekly, and monthly submissions in one place For woredas.
        </p>

        {/* CTA buttons — exact original text */}
        <div className="relative z-10 flex flex-wrap gap-3 justify-center mb-16 animate-rise">
          <a
            href="#about"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0a1628] font-bold
                       px-7 py-3 rounded-full text-sm tracking-wide transition-all duration-200
                       hover:-translate-y-0.5 shadow-lg"
          >
            About System
          </a>
          <a
            href="#about2"
            className="border border-white/30 text-white font-semibold
                       px-7 py-3 rounded-full text-sm tracking-wide
                       hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            About Service
          </a>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "4",    label: "Woredas",              numColor: "text-[#1d6fce]", bg: "bg-[#eff6ff]" },
              { value: "6",    label: "Sectors",              numColor: "text-[#7c3aed]", bg: "bg-[#f5f3ff]" },
              { value: "100%", label: "Annual plan Division", numColor: "text-[#059669]", bg: "bg-[#ecfdf5]" },
              { value: "24/7", label: "working",              numColor: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center py-6 px-4 ${i < 3 ? "border-r border-[#e2e8f0]" : ""}`}>
                <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center mb-2`}>
                  <span className={`${stat.numColor} font-['Fraunces',Georgia,serif] text-xl font-bold`}>
                    {stat.value}
                  </span>
                </div>
                <span className="text-[#64748b] text-xs text-center leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT SYSTEM  (white bg, tabs)
      ══════════════════════════════════════════ */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">

          {/* Heading — exact original text */}
          <h2 className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-[#0a1628] text-center mb-10">
            Bulchiinsa Magaalaa Adaamaa Kutaa Magaalaa Booleetiif kan Qophaa&apos;e
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "bg-[#0a1628] text-white shadow-md"
                    : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content card — driven by activeTab */}
          <div className="rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-4">
              <h3 className="font-['Fraunces',Georgia,serif] text-xl font-bold text-[#0a1628]">
                {currentTab.heading}
              </h3>
            </div>
            {/* Card body */}
            <div className="bg-white px-6 py-6">
              {currentTab.body}
            </div>
          </div>
        </div>
      </section>
      <section id="about2" className="py-20 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-6">

          {/* Heading — exact original text */}
          <h2 className="font-['Fraunces',Georgia,serif] text-3xl md:text-4xl font-bold text-white text-center mb-4">
            About service
          </h2>
         
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                num: "01",
                title: "Karoora Waggaa Qooduu fi Aanaa Aanaatti Ramaduu",
                body: `Sirni kun bulchiinsoota kutaa magaalaa 
               karoora hojii waggaa qopheessuun aanaalee hundaaf akka qoodan dandessisa.Aanaa tokkoon tokkoon, dandeettii fi baay’ina uummata isaa irratti hundaa’uun qooda kaayyoo isaa ifatti murtaa’e ni argata. Karoora hojii kun damee hojii, yeroo raawwii fi qaama itti gaafatamummaa irratti hundaa’uun adda addatti qoodamuu danda’a. Kunis aanaan hundi kaayyoo waliigalaa kutaa magaalaa waliin wal simachuun, 
                karoora tokko irraa ka’ee hojii isaa hordofamuu fi to’atamuu danda’u akka raawwatu taasisa.`,
              },
              {
                num: "02",
                title: "Gabaasa Dhiyeessuu fi Adeemsa Hordofuu",
                body: `Aanaalee hojii gabaasa isaanii guyyaan, torban torbaniin fi ji’a ji’aan karaa sirnichaa kallattiin ni dhiyeessu. Gabaasni dhiyaatu tokkoon tokkoon isaa karoora jalqaba qophaa’e waliin walqabata; kunis raawwii qabatamaa kaayyoo kaa’ame waliin salphaatti madaaluuf ni gargaara. Hoggantoonni ykn to’attoonni gabaasota dhiyaatan yeroo dhugaa keessatti ilaaluun, mirkaneessuu ykn hanqina isaanii irratti mallattoo kennuu danda’u. Kunis sadarkaa bu’uuraa irraa jalqabee hanga hoggansa kutaa magaalaatti sirna gabaasaa iftoomina, itti gaafatamummaa fi hordoffii walitti fufiinsa qabu ni uuma. 
                `,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#0f2040] border border-white/10 rounded-2xl p-6 hover:border-[#1d6fce]/50 transition-all duration-200 hover:-translate-y-1"
              >
                <span className="inline-block text-[#1d6fce] font-['Fraunces',Georgia,serif] text-4xl font-bold mb-4 leading-none">
                  {card.num}
                </span>
                <h3 className="text-white font-semibold text-base mb-3">
                  {card.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT INFORMATION
      ══════════════════════════════════════════ */}
      <section className="bg-[#060e1c] border-t border-white/10 py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-6">
            Contact Us
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              "sumeyaabdiyu@gmail.com",
              "foziyajemal123456@gmail.com",
              "yourname@gmail.com",
            ].map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-white/50 hover:text-[#1d6fce] text-sm transition-colors duration-200 group"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 text-white/30 group-hover:text-[#1d6fce] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
                {email}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#060e1c] border-t border-white/10 py-6 text-center text-white/40 text-sm">
        Reporting System &middot; Adama, Oromia
      </footer>
    </div>
  );
}

export default Home;

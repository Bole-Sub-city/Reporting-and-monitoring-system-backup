import { useState } from "react";
import logo from "../assets/logo.jpg";

// ── SVG Icons ─────────────────────────────────────────────────
function DashboardIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
function WorksIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function BuusaaIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function RevenueIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function WorkAreaIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function AnnouncementsIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function SubmitIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}
function ChevronIcon({ open }) {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function CollapseIcon({ collapsed }) {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
    </svg>
  );
}

// ── Buusaa Gonofaa report fields ──────────────────────────────
const BUUSAA_FIELDS = [
  {
    name: "hubannooUummuu",
    label: "Hubannoo Uummuu",
    required: true,
    type: "number",
  },
  {
    name: "hojiiwwanMootummaa",
    label: "Horannaa Misensaa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiJirataa",
    label: "Buusi Jiraataa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaa",
    label: "Buusi Daldalaa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaaFiGumaataa",
    label: "Buusi Daldalaa fi Gumaataa",
    required: true,
    type: "number",
  },
  {
    name: "gumaataMootummaa",
    label: "Gumaata Midhaani",
    required: true,
    type: "number",
  },
  {
    name: "nyaataBarataa",
    label: "Nyaata Barataa",
    required: false,
    type: "number",
  },
  { name: "zayitii", label: "Zayitii", required: false, type: "float" },
  {
    name: "sukkaara",
    label: "Sukkaara",
    required: false,
    type: "float",
    fullWidth: true,
  },
];

const REPORT_TYPES = [
  "Daily Report — Gabaasa Guyyaa",
  "Weekly Report — Gabaasa Torban",
  "Monthly Report — Gabaasa Ji'aa",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ── Works sub-items ───────────────────────────────────────────
const WORKS = [
  {
    id: "buusaa",
    label: "Buusaa Gonofaa",
    icon: BuusaaIcon,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: RevenueIcon,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "work1",
    label: "Work Area 1",
    icon: WorkAreaIcon,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "work2",
    label: "Work Area 2",
    icon: WorkAreaIcon,
    color: "bg-amber-100 text-amber-600",
  },
];

// ── Reusable placeholder submit page ─────────────────────────
function PlaceholderSubmit({ title, color, icon: Icon, u, onBack }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-700 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {title} — Submit Report
        </h1>
      </div>
      <div
        className={`bg-white rounded-xl border border-gray-200 px-6 py-12 flex flex-col items-center justify-center text-center`}
      >
        <div
          className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4`}
        >
          <Icon />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          {title} Report Form
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          The submission form for <strong>{title}</strong> is under development.
          <br />
          It will be available here for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ── Buusaa Gonofaa full submit form ───────────────────────────
function BuusaaSubmitForm({ u }) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");

  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClear = () => {
    setForm({});
    setYaada("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report submitted!");
    handleClear();
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Submit Report</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Complete all required fields and submit before the deadline
          </p>
        </div>
        <button
          className="flex items-center gap-2 border border-gray-300 text-gray-600
                           px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
        >
          <HistoryIcon /> History
        </button>
      </div>

      {/* Report type + period */}
      <div
        className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-5
                      flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       text-gray-800 bg-white focus:outline-none focus:ring-2
                       focus:ring-purple-300 focus:border-transparent"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-amber-600 uppercase mb-1">
            Reporting Period
          </p>
          <p className="text-2xl font-bold text-gray-800">{todayStr()}</p>
          <p className="text-amber-600 text-xs mt-0.5">
            ⏰ Deadline: —
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)",
            }}
          >
            <p className="text-white font-bold text-base">Gabaasa Guyyaa</p>
            <p className="text-white/60 text-xs mt-0.5">
              {u.name} &middot; {u.subcity} &middot; {u.woreda}
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {BUUSAA_FIELDS.map(({ name, label, required, type, fullWidth }) => (
              <div
                key={name}
                className={fullWidth ? "sm:col-span-2 sm:w-1/2" : ""}
              >
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name] ?? ""}
                  onChange={handleField}
                  required={required}
                  placeholder="0"
                  min="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                             text-gray-800 bg-gray-50 focus:outline-none focus:ring-2
                             focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Enter Yaada Gudinaa"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                           text-gray-800 bg-gray-50 focus:outline-none focus:ring-2
                           focus:ring-purple-300 focus:border-transparent
                           placeholder-gray-400 transition-all resize-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-gray-400 text-xs">
            Fields marked <span className="text-red-500">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-lg
                         text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700
                         text-white px-5 py-2.5 rounded-lg text-sm font-semibold
                         transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon /> Submit Report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Work section overview page (shows 4 cards with Submit buttons) ──
function WorksOverview({ u, onSelect }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Works</h1>
      <p className="text-gray-500 text-sm mb-6">
        {u.woreda} &middot; {u.subcity} — select a section to submit a report
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {WORKS.map(({ id, label, icon: Icon, color }) => (
          <div
            key={id}
            className="bg-white rounded-xl border border-gray-200 px-6 py-7 flex flex-col items-center text-center"
          >
            <div
              className={`w-14 h-14 rounded-full ${color} flex items-center justify-center mb-4`}
            >
              <Icon />
            </div>
            <h2 className="font-semibold text-gray-800 text-base mb-1">
              {label}
            </h2>
            <p className="text-gray-400 text-xs mb-5">
              {id === "buusaa"
                ? "Buusaa Gonofaa daily, weekly and monthly reports"
                : id === "revenue"
                  ? "Revenue collection and financial reports"
                  : `${label} — content coming soon`}
            </p>
            <button
              onClick={() => onSelect(id)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                         px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon /> Submit Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function WoRedaDashboard({ user }) {
  const u = user || {
    name: "Biruk Haile",
    woreda: "Woreda 08",
    subcity: "Kirkos",
    initials: "BH",
  };

  const [activeNav, setActiveNav] = useState("dashboard");
  const [worksOpen, setWorksOpen] = useState(true);
  const [activeWork, setActiveWork] = useState(null); // null = overview, else "buusaa"|"revenue"|"work1"|"work2"
  const [collapsed, setCollapsed] = useState(false);

  const sideW = collapsed ? "w-16" : "w-60";

  // label shown in top bar
  const topLabel = () => {
    if (activeNav === "works") {
      if (!activeWork) return "Works";
      return WORKS.find((w) => w.id === activeWork)?.label ?? "Works";
    }
    return (
      {
        dashboard: "Dashboard",
        history: "Report History",
        announcements: "Announcements",
        profile: "Profile & Settings",
      }[activeNav] ?? ""
    );
  };

  const navBtn = (id, label, Icon) => {
    const active = activeNav === id;
    return (
      <button
        key={id}
        onClick={() => {
          setActiveNav(id);
          setActiveWork(null);
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
          ${active ? "bg-green-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
      >
        <Icon />
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <div className="flex h-screen max-h-screen bg-[#f0f2f5] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: 'fixed', inset: 0 }}>
      {/* ════════ SIDEBAR ════════ */}
      <aside
        className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{
          background: "linear-gradient(180deg,#1e1456 0%,#16103d 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white/20"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">
                {u.woreda}
              </p>
              <p className="text-white/50 text-xs">Oromiyaa</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navBtn("dashboard", "Dashboard", DashboardIcon)}
          {navBtn("history", "Report History", HistoryIcon)}

          {/* Works collapsible group */}
          <div>
            <button
              onClick={() => {
                setActiveNav("works");
                setWorksOpen((p) => !p);
                setActiveWork(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
                ${activeNav === "works" ? "bg-green-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <WorksIcon />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">Works</span>
                  <ChevronIcon open={worksOpen} />
                </>
              )}
            </button>

            {/* Sub-items */}
            {!collapsed && worksOpen && (
              <div className="ml-4 border-l border-white/10 pl-2 py-1 space-y-0.5">
                {WORKS.map(({ id, label, icon: Icon }) => {
                  const active = activeNav === "works" && activeWork === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveNav("works");
                        setActiveWork(id);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                        ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {navBtn("announcements", "Announcements", AnnouncementsIcon)}
          {navBtn("profile", "Profile & Settings", ProfileIcon)}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 py-2 flex-shrink-0">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/60
                             hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50
                       hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <CollapseIcon collapsed={collapsed} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-gray-800 font-semibold text-base">
            {topLabel()}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-800">
              <BellIcon />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center
                              text-white text-xs font-bold flex-shrink-0"
              >
                {u.initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-gray-800 text-sm font-semibold leading-tight">
                  {u.name}
                </p>
                <p className="text-gray-500 text-xs">Woreda</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* DASHBOARD */}
          {activeNav === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Dashboard
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Welcome back, {u.name} — {u.woreda}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Submitted", value: "—", color: "bg-purple-50 border-purple-200 text-purple-700" },
                  { label: "Pending Review",  value: "—", color: "bg-amber-50 border-amber-200 text-amber-700"   },
                  { label: "Approved",        value: "—", color: "bg-green-50 border-green-200 text-green-700"   },
                  { label: "Rejected",        value: "—", color: "bg-red-50 border-red-200 text-red-700"         },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl border p-5 ${color}`}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>
              {/* Quick access to Works */}
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                Quick Submit
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {WORKS.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveNav("works");
                      setActiveWork(id);
                      setWorksOpen(true);
                    }}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-5 flex flex-col items-center
                               hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-3`}
                    >
                      <Icon />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      {label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REPORT HISTORY */}
          {activeNav === "history" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-5">Report History</h1>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Date","Section","Report Type","Status","Action"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                        No reports submitted yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WORKS */}
          {activeNav === "works" && (
            <>
              {/* Overview — all 4 cards */}
              {!activeWork && <WorksOverview u={u} onSelect={setActiveWork} />}

              {/* Buusaa Gonofaa — full form */}
              {activeWork === "buusaa" && <BuusaaSubmitForm u={u} />}

              {/* Revenue — placeholder */}
              {activeWork === "revenue" && (
                <PlaceholderSubmit
                  title="Revenue"
                  color="bg-green-100 text-green-600"
                  icon={RevenueIcon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              )}

              {/* Work Area 1 — placeholder */}
              {activeWork === "work1" && (
                <PlaceholderSubmit
                  title="Work Area 1"
                  color="bg-blue-100 text-blue-600"
                  icon={WorkAreaIcon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              )}

              {/* Work Area 2 — placeholder */}
              {activeWork === "work2" && (
                <PlaceholderSubmit
                  title="Work Area 2"
                  color="bg-amber-100 text-amber-600"
                  icon={WorkAreaIcon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              )}
            </>
          )}

          {/* ANNOUNCEMENTS */}
          {activeNav === "announcements" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-5">Announcements</h1>
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center">
                <p className="text-gray-400 text-sm">No announcements yet.</p>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeNav === "profile" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-5">
                Profile & Settings
              </h1>
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-6 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{u.name}</p>
                    <p className="text-gray-500 text-sm">
                      {u.subcity} &middot; {u.woreda}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: u.name },
                    { label: "Role", value: "Woreda Officer" },
                    { label: "Woreda", value: u.woreda },
                    { label: "Sub-city", value: u.subcity },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-gray-800 text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const WOREDAS = [
  { id: "w1", name: "Woreda 1" },
  { id: "w2", name: "Woreda 2" },
  { id: "w3", name: "Woreda 3" },
  { id: "w4", name: "Woreda 4" },
];

const PLAN_FIELDS = [
  { key: "hubannoo_uummuu",   label: "Hubannoo Uummuu",   color: "#7c3aed" },
  { key: "horannaa_misensaa", label: "Horannaa Misensaa", color: "#0369a1" },
  { key: "buusi_jirataa",     label: "Buusi Jirataa",     color: "#059669" },
  { key: "buusi_daldalaa",    label: "Buusi Daldalaa",    color: "#d97706" },
];

const EMPTY_PLAN = {
  hubannoo_uummuu: "",
  horannaa_misensaa: "",
  buusi_jirataa: "",
  buusi_daldalaa: "",
};

const NAV_ITEMS = [
  { id: "overview",  label: "Overview",       icon: "grid"   },
  { id: "plan",      label: "Annual Plan",    icon: "target" },
  { id: "reports",   label: "Woreda Reports", icon: "list"   },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const TargetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

// ─── Helper ───────────────────────────────────────────────────────────────────
function navIcon(id) {
  if (id === "overview") return <GridIcon />;
  if (id === "plan")     return <TargetIcon />;
  return <ListIcon />;
}

// ─── Overview Page ────────────────────────────────────────────────────────────
function OverviewPage({ plan, weights, u }) {
  const hasPlan = plan && PLAN_FIELDS.some((f) => Number(plan[f.key] || 0) > 0);
  const totalWeight = weights ? WOREDAS.reduce((s, w) => s + Number(weights[w.id] || 0), 0) : 0;
  const share = (woredaId, total) => {
    if (!weights || totalWeight === 0) return Math.round(total / 4);
    return Math.round((Number(weights[woredaId] || 0) / totalWeight) * total);
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sub-city Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">{u.name} — monitoring 4 woredas</p>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {WOREDAS.map((w) => (
          <div key={w.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white"
              style={{ background: "linear-gradient(135deg,#1e1456 0%,#2d1f7a 100%)" }}>
              <BuildingIcon />
            </div>
            <p className="text-sm font-bold text-gray-800">{w.name}</p>
            <span className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Pending backend
            </span>
          </div>
        ))}
      </div>

      {/* Plan summary strip */}
      {hasPlan ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100"
            style={{ background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)" }}>
            <p className="text-sm font-semibold text-white">Annual Plan — Per-Woreda Allocation</p>
            <p className="text-white/60 text-xs mt-0.5">Total ÷ 4 woredas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subcity Total</th>
                  {WOREDAS.map((w) => (
                    <th key={w.id} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{w.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FIELDS.map(({ key, label, color }) => {
                  const total = Number(plan[key] || 0);
                  return (
                    <tr key={key} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                          {label}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-800">{total.toLocaleString()}</td>
                      {WOREDAS.map((w) => (
                        <td key={w.id} className="px-5 py-3 text-gray-600">{share(w.id, total).toLocaleString()}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-10 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-purple-500">
            <TargetIcon />
          </div>
          <p className="text-gray-700 font-semibold mb-1">No Annual Plan Yet</p>
          <p className="text-gray-400 text-sm max-w-xs">Go to Annual Plan to enter your subcity targets. They will be split across all 4 woredas automatically.</p>
        </div>
      )}
    </div>
  );
}

// ─── Annual Plan Page ─────────────────────────────────────────────────────────
// Proportional allocation: each woreda's share = (its weight / total weight) × subcity total
function PlanPage({ plan, onSave, weights, onSaveWeights }) {
  const cleanPlan = (p) => {
    if (!p) return { ...EMPTY_PLAN };
    const cleaned = { ...EMPTY_PLAN };
    PLAN_FIELDS.forEach(({ key }) => { cleaned[key] = p[key] !== undefined ? p[key] : ""; });
    return cleaned;
  };

  const [form, setForm]       = useState(() => cleanPlan(plan));
  const [wForm, setWForm]     = useState(() => weights || Object.fromEntries(WOREDAS.map((w) => [w.id, ""])));
  const [saved, setSaved]     = useState(false);

  const handleField  = (e) => setForm((p)  => ({ ...p,  [e.target.name]: e.target.value }));
  const handleWeight = (e) => setWForm((p) => ({ ...p,  [e.target.name]: e.target.value }));

  const totalWeight = WOREDAS.reduce((s, w) => s + Number(wForm[w.id] || 0), 0);

  // Proportional share for a woreda given a category total
  const share = (woredaId, categoryTotal) => {
    const w = Number(wForm[woredaId] || 0);
    if (totalWeight === 0 || w === 0) return 0;
    return Math.round((w / totalWeight) * Number(categoryTotal || 0));
  };

  const hasValues  = PLAN_FIELDS.some((f) => Number(form[f.key] || 0) > 0);
  const hasWeights = totalWeight > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onSaveWeights(wForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buusaa Gonofaa — Annual Plan</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Enter subcity totals and woreda weights. The system distributes proportionally.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Step 1 — Woreda weights */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100"
            style={{ background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)" }}>
            <p className="text-sm font-semibold text-white">Step 1 — Woreda Weights</p>
            <p className="text-white/60 text-xs mt-0.5">
              Enter a weight for each woreda (e.g. population). The system uses these to split the total proportionally.
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {WOREDAS.map((w) => (
              <div key={w.id}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{w.name}</label>
                <input
                  type="number" min="0" name={w.id}
                  value={wForm[w.id]} onChange={handleWeight}
                  placeholder="e.g. 5000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {hasWeights && Number(wForm[w.id] || 0) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="font-semibold text-[#1e1456]">
                      {Math.round((Number(wForm[w.id]) / totalWeight) * 100)}%
                    </span> of total
                  </p>
                )}
              </div>
            ))}
          </div>
          {hasWeights && (
            <div className="px-5 pb-4">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                {WOREDAS.map((w, i) => {
                  const pct = totalWeight > 0 ? (Number(wForm[w.id] || 0) / totalWeight) * 100 : 0;
                  const colors = ["#7c3aed","#0369a1","#059669","#d97706"];
                  return <div key={w.id} style={{ width: `${pct}%`, backgroundColor: colors[i] }} />;
                })}
              </div>
              <div className="flex gap-4 mt-2">
                {WOREDAS.map((w, i) => {
                  const colors = ["#7c3aed","#0369a1","#059669","#d97706"];
                  const pct = totalWeight > 0 ? Math.round((Number(wForm[w.id] || 0) / totalWeight) * 100) : 0;
                  return (
                    <span key={w.id} className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }}/>
                      {w.name} {pct}%
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Subcity totals */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100"
            style={{ background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)" }}>
            <p className="text-sm font-semibold text-white">Step 2 — Subcity Annual Totals</p>
            <p className="text-white/60 text-xs mt-0.5">Total targets for the whole subcity</p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PLAN_FIELDS.map(({ key, label, color }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                    {label}
                  </span>
                </label>
                <input
                  type="number" min="0" name={key}
                  value={form[key]} onChange={handleField}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 — Allocation preview */}
        {hasValues && hasWeights && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Allocation Preview — Proportional Distribution</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subcity Total</th>
                    {WOREDAS.map((w) => (
                      <th key={w.id} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{w.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FIELDS.map(({ key, label, color }) => {
                    const total = Number(form[key] || 0);
                    return (
                      <tr key={key} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-800">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}/>
                            {label}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-800">{total.toLocaleString()}</td>
                        {WOREDAS.map((w) => (
                          <td key={w.id} className="px-5 py-3 text-gray-600">{share(w.id, total).toLocaleString()}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
          {saved
            ? <p className="flex items-center gap-2 text-green-700 text-sm font-semibold"><CheckIcon /> Plan saved successfully.</p>
            : <p className="text-gray-400 text-xs">You can update the plan at any time.</p>
          }
          <button type="submit"
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:opacity-90"
            style={{ backgroundColor: "#1e1456" }}>
            <CheckIcon /> Save Plan
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Woreda Reports Page ──────────────────────────────────────────────────────
function ReportsPage({ plan, weights }) {
  const [activeWoreda, setActiveWoreda] = useState(WOREDAS[0].id);
  const woreda = WOREDAS.find((w) => w.id === activeWoreda);
  const hasPlan = plan && PLAN_FIELDS.some((f) => Number(plan[f.key] || 0) > 0);
  const totalWeight = weights ? WOREDAS.reduce((s, w) => s + Number(weights[w.id] || 0), 0) : 0;
  const share = (woredaId, total) => {
    if (!weights || totalWeight === 0) return Math.round(total / 4);
    return Math.round((Number(weights[woredaId] || 0) / totalWeight) * total);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Woreda Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Select a woreda to view its submitted reports.</p>
      </div>

      {/* Woreda tab selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {WOREDAS.map((w) => (
          <button key={w.id} onClick={() => setActiveWoreda(w.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeWoreda === w.id
                ? "text-white shadow"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#1e1456] hover:text-[#1e1456]"
            }`}
            style={activeWoreda === w.id ? { background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)" } : {}}>
            {w.name}
          </button>
        ))}
      </div>

      {/* Allocated targets for selected woreda */}
      {hasPlan && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {PLAN_FIELDS.map(({ key, label, color }) => {
            const s = share(activeWoreda, Number(plan[key] || 0));
            return (
              <div key={key} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">{label}</p>
                </div>
                <p className="text-xl font-extrabold text-gray-800">{s.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Allocated target</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Report data placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100"
          style={{ background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)" }}>
          <p className="text-sm font-semibold text-white">{woreda.name} — Submitted Reports</p>
          <p className="text-white/60 text-xs mt-0.5">Live data will appear here once the backend endpoint is connected.</p>
        </div>
        <div className="px-6 py-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-purple-400">
            <ListIcon />
          </div>
          <p className="text-gray-700 font-semibold mb-1">No data yet</p>
          <p className="text-gray-400 text-sm max-w-sm">
            The backend endpoint for fetching per-woreda reports hasn't been connected yet.
            Once available, wire it to <code className="bg-gray-100 px-1 rounded text-xs">/api/reports?woreda={activeWoreda}</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SubCityDashboard({ user: propUser }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = propUser || storedUser;

  const u = {
    name: user?.username || "Sub-city User",
    role: user?.role || "sub-city",
    initials: (user?.username || "SC").slice(0, 2).toUpperCase(),
  };

  const [activeNav, setActiveNav] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  // Annual plan stored in localStorage until backend is ready
  const PLAN_KEY = "subcity_annual_plan";
  const [plan, setPlan] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(PLAN_KEY));
      if (!raw) return null;
      // Strip any legacy _locked key
      const cleaned = { ...EMPTY_PLAN };
      PLAN_FIELDS.forEach(({ key }) => { cleaned[key] = raw[key] ?? ""; });
      return cleaned;
    } catch { return null; }
  });

  const WEIGHTS_KEY = "subcity_woreda_weights";
  const [weights, setWeights] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WEIGHTS_KEY)) || null; }
    catch { return null; }
  });

  const handleSaveWeights = (data) => {
    setWeights(data);
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(data));
  };

  const handleSavePlan = (data) => {
    setPlan(data);
    localStorage.setItem(PLAN_KEY, JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sideW = collapsed ? "w-16" : "w-56";

  return (
    <div className="flex h-screen max-h-screen bg-[#f0f2f5] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}>

      {/* ── Sidebar ── */}
      <aside className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{ background: "linear-gradient(180deg,#1e1456 0%,#16103d 100%)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <img src={logo} alt="logo" className="w-9 h-9 rounded-full object-contain bg-white flex-shrink-0 p-0.5"/>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">Sub-city</p>
              <p className="text-white/50 text-xs truncate">Reporting System</p>
            </div>
          )}
          <button onClick={() => setCollapsed((c) => !c)}
            className="ml-auto text-white/40 hover:text-white transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>


        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label }) => (
            <button key={id} onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeNav === id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              {navIcon(id)}
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-white/10 flex-shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {activeNav === "overview" && <OverviewPage plan={plan} weights={weights} u={u} />}
          {activeNav === "plan"     && <PlanPage plan={plan} onSave={handleSavePlan} weights={weights} onSaveWeights={handleSaveWeights} />}
          {activeNav === "reports"  && <ReportsPage plan={plan} weights={weights} />}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import {
  saveSubcityPlan,
  saveSubcityOwnPlan,
  fetchSubcityOwnPlan,
} from "../api/planApi";

// ─── Constants ────────────────────────────────────────────────────────────────
const WOREDAS = [
  { id: "w1", name: "Aanaa Gooroo" },
  { id: "w2", name: "Aanaa Dhadacha Araaraa" },
  { id: "w3", name: "Aanaa Dhakaa Adii" },
  { id: "w4", name: "Aanaa Andoodee" },
];

const PLAN_FIELDS = [
  { key: "hubannoo_uummuu", label: "Hubannoo Uumuu", color: "#0f766e" },
  { key: "horannaa_misensaa", label: "Horannaa Misensaa", color: "#1e40af" },
  { key: "buusi_jiraataa", label: "Buusi Jiraataa", color: "#475569" },
  { key: "gumaata_jirataa", label: "Gumaata Jiraataa", color: "#64748b" },
  {
    key: "buusi_daldalaa",
    label: "Buusi Fi Gumaataa  Daldalaa ",
    color: "#64748b",
  },
  {
    key: "inisheetiviiBuusaaGonofaa",
    label: "inisheetivii Buusaa Gonofaa",
    color: "#64748b",
  },
  { key: "gumaata_mootummaa", label: "Gumaata Midhaani", color: "#64748b" },
  { key: "nyaata_barataa", label: "Nyaata Barataa", color: "#64748b" },
];

const EMPTY_PLAN = {
  hubannoo_uummuu: "",
  horannaa_misensaa: "",
  buusi_jirataa: "",
  buusi_daldalaa: "",
};

// Sectors used in Annual Plan and Work Analysis dropdowns
const SECTORS = [
  { id: "buusaa", label: "Buusaa Gonofaa" },
  { id: "qonna", label: "Qonna" },
  { id: "galii", label: "Galii Sassaabu" },
  { id: "carraa", label: "Carraa Hojii Uummuu" },
];

// ─── Fixed woreda percentage split ───────────────────────────────────────────
const WOREDA_PCTS = {
  w1: 0.27,
  w2: 0.255,
  w3: 0.245,
  w4: 0.23,
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg
    className="w-4 h-4"
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
const TargetIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const ListIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    className="w-4 h-4"
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
const BuildingIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);
const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const AnalysisIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const CollapseIcon = ({ collapsed }) => (
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

// ─── Overview Page ────────────────────────────────────────────────────────────
function OverviewPage({ dbPlan, u }) {
  const hasPlan =
    dbPlan && PLAN_FIELDS.some((f) => Number(dbPlan[f.key] || 0) > 0);
  const totalWeight = dbPlan
    ? WOREDAS.reduce((s, w) => s + Number(dbPlan[`weight_${w.id}`] || 0), 0)
    : 0;
  const share = (woredaId, total) => {
    if (!dbPlan || totalWeight === 0) return Math.round(total / 4);
    return Math.round(
      (Number(dbPlan[`weight_${woredaId}`] || 0) / totalWeight) * total,
    );
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Sub-city Overview</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          {u.name} — monitoring 4 woredas
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {WOREDAS.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 flex flex-col items-center text-center"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white"
              style={{
                background: "linear-gradient(135deg,#1a3a5c 0%,#1e4976 100%)",
              }}
            >
              <BuildingIcon />
            </div>
            <p className="text-sm font-bold text-[#1e293b]">{w.name}</p>
            <span className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f4f6f9] text-[#64748b]">
              Active
            </span>
          </div>
        ))}
      </div>
      {hasPlan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Annual Plan — Per-Woreda Allocation
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Fetched from database · Year {dbPlan.year}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Subcity Total
                  </th>
                  {WOREDAS.map((w) => (
                    <th
                      key={w.id}
                      className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                    >
                      {w.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FIELDS.map(({ key, label, color }) => {
                  const total = Number(dbPlan[key] || 0);
                  return (
                    <tr
                      key={key}
                      className="border-b border-[#f1f5f9] hover:bg-[#f4f6f9] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#1e293b]">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          {label}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-[#1e293b]">
                        {total.toLocaleString()}
                      </td>
                      {WOREDAS.map((w) => (
                        <td key={w.id} className="px-5 py-3 text-[#64748b]">
                          {share(w.id, total).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-10 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#eef4fb] flex items-center justify-center mb-3 text-[#1a3a5c]">
            <TargetIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-1">
            No Annual Plan Yet
          </p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Go to Annual Plan → Buusaa Gonofaa to enter subcity targets.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Buusaa Gonofaa Plan Page ─────────────────────────────────────────────────
function BuusaaPlanPage({ onSave }) {
  const [form, setForm] = useState({ ...EMPTY_PLAN });
  const [populationTotal, setPopulationTotal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const wForm = Object.fromEntries(
    WOREDAS.map((w) => [
      w.id,
      populationTotal !== "" && Number(populationTotal) > 0
        ? Math.round(Number(populationTotal) * WOREDA_PCTS[w.id])
        : "",
    ]),
  );
  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const share = (woredaId, categoryTotal) => {
    if (!populationTotal || Number(populationTotal) <= 0) return 0;
    return Math.round(WOREDA_PCTS[woredaId] * Number(categoryTotal || 0));
  };
  const hasValues = PLAN_FIELDS.some((f) => Number(form[f.key] || 0) > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      await onSave(form, wForm);
      setSaved(true);
      setForm({ ...EMPTY_PLAN });
      setPopulationTotal("");
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          Buusaa Gonofaa — Annual Plan
        </h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter subcity totals. The system distributes proportionally by woreda.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Population */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">Total Population</p>
            <p className="text-white/60 text-xs mt-0.5">
              Distributed automatically using fixed percentages.
            </p>
          </div>
          <div className="px-5 py-5">
            <div className="max-w-xs mb-5">
              <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                Total
              </label>
              <input
                type="number"
                min="0"
                value={populationTotal}
                onChange={(e) => setPopulationTotal(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {WOREDAS.map((w, i) => {
                const colors = ["#0f766e", "#1e40af", "#475569", "#64748b"];
                const pct = Math.round(WOREDA_PCTS[w.id] * 100);
                const allocated =
                  populationTotal !== "" && Number(populationTotal) > 0
                    ? Math.round(Number(populationTotal) * WOREDA_PCTS[w.id])
                    : null;
                return (
                  <div key={w.id}>
                    <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                      {w.name}
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={allocated !== null ? allocated : ""}
                      placeholder={`${pct}%`}
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f1f5f9] cursor-default focus:outline-none"
                    />
                    <p className="text-xs text-[#94a3b8] mt-1">
                      <span
                        className="font-semibold"
                        style={{ color: colors[i] }}
                      >
                        {pct}%
                      </span>{" "}
                      of total
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Targets */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Enter Subcity Annual Totals
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Total targets for the whole subcity
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PLAN_FIELDS.map(({ key, label, color }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  name={key}
                  value={form[key]}
                  onChange={handleField}
                  placeholder="0"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Preview */}
        {hasValues && populationTotal !== "" && Number(populationTotal) > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f4f6f9] border-b border-[#e2e8f0]">
              <p className="text-sm font-semibold text-[#1e293b]">
                Allocation Preview
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Category
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Total
                    </th>
                    {WOREDAS.map((w) => (
                      <th
                        key={w.id}
                        className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                      >
                        {w.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FIELDS.map(({ key, label, color }) => {
                    const total = Number(form[key] || 0);
                    return (
                      <tr
                        key={key}
                        className="border-b border-[#f1f5f9] hover:bg-[#f4f6f9] transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-[#1e293b]">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            {label}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">
                          {total.toLocaleString()}
                        </td>
                        {WOREDAS.map((w) => (
                          <td key={w.id} className="px-5 py-3 text-[#64748b]">
                            {share(w.id, total).toLocaleString()}
                          </td>
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
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#166534] text-sm font-semibold">
                <CheckIcon /> Saved.
              </p>
            )}
            {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
            {!saved && !saveError && (
              <p className="text-[#94a3b8] text-xs">
                Saving overwrites the current plan.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#1a3a5c" }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon />
                Save Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Coming Soon Page ─────────────────────────────────────────────────────────
function ComingSoonPage({ title }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          {title} — Annual Plan
        </h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Plan management for {title}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#eef4fb] flex items-center justify-center mb-4 text-[#1a3a5c]">
          <TargetIcon />
        </div>
        <p className="text-[#1e293b] font-semibold mb-2">Coming Soon</p>
        <p className="text-[#94a3b8] text-sm max-w-xs">
          Annual plan management for <strong>{title}</strong> will be available
          here.
        </p>
        <span className="mt-4 inline-block bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] text-xs font-semibold px-4 py-2 rounded-full">
          Under Development
        </span>
      </div>
    </div>
  );
}

// ─── Work Analysis Page ───────────────────────────────────────────────────────
// Woredas shown as tab buttons on the page, not in the sidebar
function WorkAnalysisPage({ sector }) {
  const [activeWoreda, setActiveWoreda] = useState(WOREDAS[0].id);
  const sectorLabel = SECTORS.find((s) => s.id === sector)?.label ?? sector;
  const woredaLabel =
    WOREDAS.find((w) => w.id === activeWoreda)?.name ?? activeWoreda;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          Work Analysis — {sectorLabel}
        </h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Select a woreda to view performance data.
        </p>
      </div>

      {/* Woreda tab selector — same style as Woreda Reports */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {WOREDAS.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveWoreda(w.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeWoreda === w.id
                ? "text-white shadow"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a3a5c] hover:text-[#1a3a5c]"
            }`}
            style={
              activeWoreda === w.id
                ? {
                    background:
                      "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
                  }
                : {}
            }
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* Content placeholder per woreda */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
          }}
        >
          <p className="text-sm font-semibold text-white">
            {woredaLabel} — {sectorLabel}
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Performance analysis will appear here once connected.
          </p>
        </div>
        <div className="px-6 py-14 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#eef4fb] flex items-center justify-center mb-4 text-[#1a3a5c]">
            <AnalysisIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-2">Coming Soon</p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Analytics for <strong>{sectorLabel}</strong> ·{" "}
            <strong>{woredaLabel}</strong> will be available here.
          </p>
          <span className="mt-4 inline-block bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] text-xs font-semibold px-4 py-2 rounded-full">
            Under Development
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Woreda Reports Page ──────────────────────────────────────────────────────
function ReportsPage({ dbPlan }) {
  const [activeWoreda, setActiveWoreda] = useState(WOREDAS[0].id);
  const woreda = WOREDAS.find((w) => w.id === activeWoreda);
  const hasPlan =
    dbPlan && PLAN_FIELDS.some((f) => Number(dbPlan[f.key] || 0) > 0);
  const totalWeight = dbPlan
    ? WOREDAS.reduce((s, w) => s + Number(dbPlan[`weight_${w.id}`] || 0), 0)
    : 0;
  const share = (woredaId, total) => {
    if (!dbPlan || totalWeight === 0) return Math.round(total / 4);
    return Math.round(
      (Number(dbPlan[`weight_${woredaId}`] || 0) / totalWeight) * total,
    );
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Woreda Reports</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Select a woreda to view submitted reports.
        </p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {WOREDAS.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveWoreda(w.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeWoreda === w.id
                ? "text-white shadow"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a3a5c] hover:text-[#1a3a5c]"
            }`}
            style={
              activeWoreda === w.id
                ? {
                    background:
                      "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
                  }
                : {}
            }
          >
            {w.name}
          </button>
        ))}
      </div>
      {hasPlan && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {PLAN_FIELDS.map(({ key, label, color }) => {
            const s = share(activeWoreda, Number(dbPlan[key] || 0));
            return (
              <div
                key={key}
                className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-4 py-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide truncate">
                    {label}
                  </p>
                </div>
                <p className="text-xl font-extrabold text-[#1e293b]">
                  {s.toLocaleString()}
                </p>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Allocated target
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
          }}
        >
          <p className="text-sm font-semibold text-white">
            {woreda.name} — Submitted Reports
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Live data will appear once connected.
          </p>
        </div>
        <div className="px-6 py-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#eef4fb] flex items-center justify-center mb-3 text-[#1a3a5c]">
            <ListIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-1">No data yet</p>
          <p className="text-[#94a3b8] text-sm max-w-sm">
            Wire to{" "}
            <code className="bg-[#f4f6f9] px-1 rounded text-xs">
              /api/reports?woreda={activeWoreda}
            </code>{" "}
            once backend is ready.
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

  // ── nav state ──
  // activeNav: "overview" | "plan" | "analysis" | "reports"
  // activePlanSector: sector id (for plan dropdown)
  // activeAnalysisSector: sector id (for analysis dropdown)
  // activeAnalysisWoreda: woreda id (for analysis woreda sub-dropdown)
  const [activeNav, setActiveNav] = useState("overview");
  const [activePlanSector, setActivePlanSector] = useState(null);
  const [activeAnalysisSector, setActiveAnalysisSector] = useState(null);

  // dropdown open states
  const [planOpen, setPlanOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  // ── data ──
  const [dbPlan, setDbPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    fetchSubcityOwnPlan()
      .then((d) => setDbPlan(d.plan))
      .catch(() => setDbPlan(null))
      .finally(() => setPlanLoading(false));
  }, []);

  const handleSavePlan = async (data, wForm) => {
    await saveSubcityOwnPlan(data, wForm);
    await saveSubcityPlan(data, wForm);
    const fresh = await fetchSubcityOwnPlan();
    setDbPlan(fresh.plan);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sideW = collapsed ? "w-16" : "w-60";

  // ── helpers for nav active state ──
  const isPlanActive = activeNav === "plan";
  const isAnalysisActive = activeNav === "analysis";

  // ── main content renderer ──
  const renderContent = () => {
    if (activeNav === "overview") {
      if (planLoading)
        return (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
          </div>
        );
      return <OverviewPage dbPlan={dbPlan} u={u} />;
    }
    if (activeNav === "reports") return <ReportsPage dbPlan={dbPlan} />;
    if (activeNav === "plan") {
      if (!activePlanSector)
        return (
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
              Annual Plan
            </h1>
            <p className="text-[#64748b] text-sm mb-6">
              Select a sector from the sidebar.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActivePlanSector(s.id);
                    setPlanOpen(true);
                  }}
                  className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-6 text-left hover:border-[#1a3a5c]/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-[#1e293b]">{s.label}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    {s.id === "buusaa" ? "Active" : "Coming soon"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      if (activePlanSector === "buusaa")
        return <BuusaaPlanPage onSave={handleSavePlan} />;
      return (
        <ComingSoonPage
          title={SECTORS.find((s) => s.id === activePlanSector)?.label ?? ""}
        />
      );
    }
    if (activeNav === "analysis") {
      if (!activeAnalysisSector)
        return (
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
              Work Analysis
            </h1>
            <p className="text-[#64748b] text-sm mb-6">
              Select a sector from the sidebar.
            </p>
            <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#eef4fb] flex items-center justify-center mb-4 text-[#1a3a5c]">
                <AnalysisIcon />
              </div>
              <p className="text-[#94a3b8] text-sm">
                Choose a sector from the sidebar to view analysis.
              </p>
            </div>
          </div>
        );
      return <WorkAnalysisPage sector={activeAnalysisSector} />;
    }
    return null;
  };

  return (
    <div
      className="flex h-screen max-h-screen bg-[#f4f6f9] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{
          background: "linear-gradient(180deg,#1a3a5c 0%,#0d1f35 100%)",
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-contain bg-white flex-shrink-0 p-0.5"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight truncate">
                Sub-city
              </p>
              <p className="text-white/50 text-xs truncate">Reporting System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {/* Overview */}
          <button
            onClick={() => {
              setActiveNav("overview");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "overview"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <GridIcon />
            {!collapsed && <span className="truncate">Overview</span>}
          </button>

          {/* ── Annual Plan (dropdown) ── */}
          <div>
            <button
              onClick={() => {
                setPlanOpen((o) => !o);
                setActiveNav("plan");
                setActivePlanSector(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isPlanActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <TargetIcon />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Annual Plan</span>
                  <ChevronIcon open={planOpen && !collapsed} />
                </>
              )}
            </button>
            {!collapsed && planOpen && (
              <div className="ml-4 pl-2 border-l border-white/10 mt-0.5 space-y-0.5">
                {SECTORS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveNav("plan");
                      setActivePlanSector(s.id);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isPlanActive && activePlanSector === s.id
                        ? "bg-white/15 text-white"
                        : "text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Work Analysis (dropdown) ── */}
          <div>
            <button
              onClick={() => {
                setAnalysisOpen((o) => !o);
                setActiveNav("analysis");
                setActiveAnalysisSector(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isAnalysisActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <AnalysisIcon />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">
                    Work Analysis
                  </span>
                  <ChevronIcon open={analysisOpen && !collapsed} />
                </>
              )}
            </button>
            {!collapsed && analysisOpen && (
              <div className="ml-4 pl-2 border-l border-white/10 mt-0.5 space-y-0.5">
                {SECTORS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveNav("analysis");
                      setActiveAnalysisSector(s.id);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isAnalysisActive && activeAnalysisSector === s.id
                        ? "bg-white/15 text-white"
                        : "text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Woreda Reports */}
          <button
            onClick={() => {
              setActiveNav("reports");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "reports"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ListIcon />
            {!collapsed && <span className="truncate">Woreda Reports</span>}
          </button>
        </nav>

        {/* Bottom: logout + collapse toggle */}
        <div className="px-2 py-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
          {/* Collapse / expand button always visible at the bottom */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center gap-2.5 px-3 py-2 mt-0.5 rounded-lg text-xs font-medium text-white/40 hover:bg-white/10 hover:text-white transition-all"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon collapsed={collapsed} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{renderContent()}</div>
      </main>
    </div>
  );
}

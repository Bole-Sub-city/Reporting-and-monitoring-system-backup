import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import {
  saveSubcityPlan,
  saveSubcityOwnPlan,
  fetchSubcityOwnPlan,
  saveSubcityQonnaPlan,
  fetchSubcityQonnaPlan,
} from "../api/planApi";

// ─── Shared allocation helpers ────────────────────────────────────────────────
/**
 * Parse four woreda percentage strings into numbers.
 * Returns { w1, w2, w3, w4 } as Numbers (NaN if blank/invalid).
 */
function parsePcts(raw) {
  return Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v === "" ? NaN : Number(v)]),
  );
}

/**
 * Validate that four percentage values:
 *  - are all finite numbers
 *  - are all >= 0
 *  - sum to exactly 100 (±0.01 for float precision)
 * Returns { ok: bool, total: number, error: string|null }
 */
function validatePcts(pcts) {
  const vals = Object.values(pcts);
  if (vals.some((v) => isNaN(v))) {
    return {
      ok: false,
      total: null,
      error: "Enter a percentage for every woreda.",
    };
  }
  if (vals.some((v) => v < 0)) {
    return { ok: false, total: null, error: "Percentages cannot be negative." };
  }
  const total = vals.reduce((s, v) => s + v, 0);
  const rounded = Math.round(total * 100) / 100; // safe to 2 decimal places
  if (Math.abs(rounded - 100) > 0.01) {
    return {
      ok: false,
      total: rounded,
      error: `Woreda allocation must equal 100%. Current total: ${rounded}%`,
    };
  }
  return { ok: true, total: rounded, error: null };
}

/** Distribute a subcity total to a woreda using validated percentage object.
 *  Special case: w2 (Aanaa Dhadacha Araaraa) uses 25% for actual math even
 *  though the display label shows 25.5%. */
function pctShare(pcts, woredaId, categoryTotal) {
  // w2 is always calculated at exactly 25% regardless of the displayed value
  const effectivePct = woredaId === "w2" ? 25 : Number(pcts[woredaId] || 0);
  return Math.round((effectivePct / 100) * Number(categoryTotal || 0));
}

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
  { key: "sukkaara", label: "Sukkaara", color: "#ea580c" },
  { key: "zayitii", label: "Zayitii", color: "#65a30d" },
];

const EMPTY_PLAN = {
  hubannoo_uummuu: "",
  horannaa_misensaa: "",
  buusi_jiraataa: "",
  gumaata_jirataa: "",
  buusi_daldalaa: "",
  inisheetiviiBuusaaGonofaa: "",
  gumaata_mootummaa: "",
  nyaata_barataa: "",
  sukkaara: "",
  zayitii: "",
};

// Sectors used in Annual Plan and Work Analysis dropdowns
const SECTORS = [
  { id: "buusaa", label: "Buusaa Gonofaa" },
  { id: "qonna", label: "Qonna" },
  { id: "galii", label: "Galii Sassaabu" },
  { id: "carraa", label: "Carraa Hojii Uumuu" },
];

// ─── Default woreda percentage split (editable in plan forms) ────────────────
// These are defaults only — the planner can adjust them in each plan form.
// The form enforces that all four values must sum to exactly 100%.
const DEFAULT_WOREDA_PCTS = { w1: "27", w2: "25.5", w3: "24.5", w4: "23" };

// ─── Qonna category definitions ───────────────────────────────────────────────
const QONNA_CATEGORIES = [
  {
    key: "furdisa",
    label: "Furdisa",
    unit: "animals",
    color: "#065f46",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  {
    key: "annan",
    label: "Annan",
    unit: "horii",
    color: "#0f766e",
    bgColor: "#f0fdfa",
    borderColor: "#99f6e4",
  },
  {
    key: "lukkuu",
    label: "Lukkuu",
    unit: "lukkuu",
    color: "#1e40af",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  {
    key: "booyee",
    label: "Booyyee",
    unit: "booyyee",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  {
    key: "kannisaa",
    label: "Kannisaa",
    unit: "gaaguraa",
    color: "#b45309",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  {
    key: "qurxummii",
    label: "Qurxummii",
    unit: "Pondii",
    color: "#0369a1",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
];

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
              Annual Plan Per Woreda Allocation
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

// ─── Shared Woreda Percentage Inputs ─────────────────────────────────────────
// Reused by both BuusaaPlanPage and QonnaPlanPage.
function WoRedaPctInputs({ pcts, onChange }) {
  const parsed = parsePcts(pcts);
  const { ok, total, error } = validatePcts(parsed);
  const colors = ["#065f46", "#1e40af", "#475569", "#64748b"];
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div
        className="px-5 py-3 border-b border-[#e2e8f0]"
        style={{ background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }}
      >
        <p className="text-sm font-semibold text-white">
          Woreda Allocation (%)
        </p>
        <p className="text-white/60 text-xs mt-0.5">
          Enter the percentage share for each woreda. Total must equal exactly
          100%.
        </p>
      </div>
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {WOREDAS.map((w, i) => (
            <div key={w.id}>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                {w.name}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={pcts[w.id]}
                  onChange={(e) => onChange(w.id, e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#e2e8f0] rounded-lg pl-3 pr-8 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] pointer-events-none">
                  %
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: colors[i] }}>
                {!isNaN(Number(pcts[w.id])) && pcts[w.id] !== ""
                  ? `${pcts[w.id]}%`
                  : "—"}
              </p>
            </div>
          ))}
        </div>
        {/* Live total indicator */}
        {total !== null ? (
          ok ? (
            <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-2.5">
              <svg
                className="w-4 h-4 text-[#166534] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[#166534] text-sm font-semibold">
                Total Allocation: {total}% ✓
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5">
              <svg
                className="w-4 h-4 text-[#dc2626] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-[#dc2626] text-sm">{error}</span>
            </div>
          )
        ) : (
          <div className="bg-[#f4f6f9] border border-[#e2e8f0] rounded-lg px-4 py-2.5">
            <span className="text-[#94a3b8] text-sm">
              Enter percentages above — total must equal 100%.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Buusaa Gonofaa Plan Page ─────────────────────────────────────────────────
function BuusaaPlanPage({ onSave }) {
  const [form, setForm] = useState({ ...EMPTY_PLAN });
  const [pcts, setPcts] = useState({ ...DEFAULT_WOREDA_PCTS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handlePct = (id, val) => setPcts((p) => ({ ...p, [id]: val }));
  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const parsed = parsePcts(pcts);
  const pctValid = validatePcts(parsed);
  const hasValues = PLAN_FIELDS.some((f) => Number(form[f.key] || 0) > 0);
  const canSubmit = hasValues && pctValid.ok;

  const share = (woredaId, categoryTotal) =>
    pctValid.ok ? pctShare(parsed, woredaId, categoryTotal) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pctValid.ok) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);
    // Scale percentages ×10 and round to integers so decimal values like 25.5
    // become 255. w2 is forced to 250 (25%) so the backend uses the correct
    // effective percentage for Aanaa Dhadacha Araaraa.
    const wForm = Object.fromEntries(
      WOREDAS.map((w) => {
        const effectivePct = w.id === "w2" ? 25 : parsed[w.id];
        return [w.id, Math.round(effectivePct * 10)];
      }),
    );
    try {
      await onSave(form, wForm);
      setSaved(true);
      setForm({ ...EMPTY_PLAN });
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
          Buusaa Gonofaa Annual Plan
        </h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter subcity totals and woreda allocation percentages. The system
          distributes the targets proportionally.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Woreda percentage inputs */}
        <WoRedaPctInputs pcts={pcts} onChange={handlePct} />

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

        {/* Allocation preview */}
        {hasValues && pctValid.ok && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f4f6f9] border-b border-[#e2e8f0]">
              <p className="text-sm font-semibold text-[#1e293b]">
                Allocation Preview
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">
                Auto-calculated from entered percentages
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
                        <span className="block text-[#94a3b8] font-normal normal-case">
                          {pcts[w.id]}%
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FIELDS.map(({ key, label, color }) => {
                    const total = Number(form[key] || 0);
                    if (total === 0) return null;
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

        {/* Save bar */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#166534] text-sm font-semibold">
                <CheckIcon /> Saved successfully.
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
            disabled={saving || !canSubmit}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1a3a5c" }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon /> Save Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Qonna Annual Plan Page ───────────────────────────────────────────────────
// Furdisa animal types
const FURDISA_ANIMAL_TYPES = [
  { value: "cattle", label: "Cattle" },
  { value: "goat", label: "Goat" },
  { value: "sheep", label: "Sheep" },
  { value: "ox", label: "Ox" },
  { value: "other", label: "Other (specify)" },
];

// ── QonnaPlanRow ──────────────────────────────────────────────────────────────
// Each category asks:
//   1. How many "houses" (mana/gaaguraa/ponds depending on category)
//   2. How many hectares per "house"  → total land = houses × ha/house
//   3. How many animals/units per "house" → total animals = houses × units/house
//      (for Annan: "how many cows per house", for Lukkuu: chickens per house, etc.)
//
// Config per category:
//   houseLabel   – label for field 1 (the "house" count)
//   haLabel      – label for field 2 (ha per house)
//   unitLabel    – label for field 3 (animals/units per house)
//   unitName     – short name used in the info row (e.g. "horii", "lukkuu")
const QONNA_ROW_CFG = {
  furdisa: {
    houseLabel: "Lakk.Sheedii",
    haLabel: "Hektaara /Sheedii",
    unitLabel: "Lakk.Horii /sheedii ",
    unitName: "horii",
  },
  annan: {
    houseLabel: "Lakk.Sheedii",
    haLabel: "Hektaara / sheedii ",
    unitLabel: "Lakk.Sa'a / sheedii",
    unitName: "sa'aa",
  },
  lukkuu: {
    houseLabel: "Lakk.Sheedii",
    haLabel: "Hektaara / Sheedii",
    unitLabel: "Lakk.Lukkuu / Sheedii",
    unitName: "lukkuu",
  },
  booyee: {
    houseLabel: "Lakk.Sheedii",
    haLabel: "Hektaara / sheedii",
    unitLabel: "Lakk. Booyyee / Sheedii",
    unitName: "booyyee",
  },
  kannisaa: {
    houseLabel: "Lakk.Gaaguraa",
    haLabel: "Hektaara/Gaaguraa",
    unitLabel: "Lakk.Kannisaa/Gaaguraa",
    unitName: "kannisaa",
  },
  qurxummii: {
    houseLabel: "Lakk.Pondii",
    haLabel: "Hektaara /Pondii",
    unitLabel: "Lakk.Qurxummii/Pondii",
    unitName: "qurxummii",
  },
};

const EMPTY_QONNA_FORM = {
  furdisa: { houses: "", haPerHouse: "", unitsPerHouse: "" },
  annan: { houses: "", haPerHouse: "", unitsPerHouse: "" },
  lukkuu: { houses: "", haPerHouse: "", unitsPerHouse: "" },
  booyee: { houses: "", haPerHouse: "", unitsPerHouse: "" },
  kannisaa: { houses: "", haPerHouse: "", unitsPerHouse: "" },
  qurxummii: { houses: "", haPerHouse: "", unitsPerHouse: "" },
};

function QonnaPlanRow({ cat, form, onChange }) {
  const cfg = QONNA_ROW_CFG[cat.key];
  const houses = Number(form.houses);
  const haPerHouse = Number(form.haPerHouse);
  const unitsPerHouse = Number(form.unitsPerHouse);

  // Calculated outputs
  const totalLand =
    houses > 0 && haPerHouse > 0
      ? Math.round(houses * haPerHouse * 100) / 100
      : null;
  const totalUnits =
    houses > 0 && unitsPerHouse > 0 ? houses * unitsPerHouse : null;

  const inputCls =
    "w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]";
  const readonlyCls =
    "w-full border-2 rounded-lg px-3 py-2.5 text-sm font-bold bg-white";
  const emptyReadonly =
    "w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-xs text-[#94a3b8] bg-[#f1f5f9]";

  return (
    <div
      className="rounded-xl border px-4 py-5 space-y-4"
      style={{ borderColor: cat.borderColor, backgroundColor: cat.bgColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
      
        
        <span className="text-xs text-[#94a3b8] ml-1"> {cat.description}</span>
      </div>

      {/* Row 1: inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Field 1: number of houses / gaaguraa / ponds */}
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            {cfg.houseLabel}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.houses}
            onChange={(e) => onChange("houses", e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>

        {/* Field 2: ha per house */}
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            {cfg.haLabel}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={form.haPerHouse}
            onChange={(e) => onChange("haPerHouse", e.target.value)}
            placeholder="fkn. 0.5"
            className={inputCls}
          />
        </div>

        {/* Computed: total land */}
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            Qophi Lafaa Waliigalaa (ha){" "}
            <span className="text-[#94a3b8]">(auto)</span>
          </label>
          {totalLand !== null ? (
            <div
              className={readonlyCls}
              style={{ borderColor: cat.color, color: cat.color }}
            >
              {totalLand.toLocaleString()}{" "}
              <span className="text-xs font-normal text-[#64748b] ml-1">
                ha
              </span>
            </div>
          ) : (
            <div className={emptyReadonly}>Mana fi hektaara galchi…</div>
          )}
        </div>
      </div>

      {/* Row 2: units per house → total units */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Field 3: animals / units per house */}
        <div>
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            {cfg.unitLabel}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.unitsPerHouse}
            onChange={(e) => onChange("unitsPerHouse", e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>

        {/* Computed: total animals */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#64748b] mb-1.5">
            Lakk. {cfg.unitName} Waliigalaa{" "}
            <span className="text-[#94a3b8]">(auto)</span>
          </label>
          {totalUnits !== null ? (
            <div
              className={readonlyCls}
              style={{ borderColor: cat.color, color: cat.color }}
            >
              {totalUnits.toLocaleString()}{" "}
              <span className="text-xs font-normal text-[#64748b] ml-1">
                {cfg.unitName}
              </span>
            </div>
          ) : (
            <div className={emptyReadonly}>
              Mana fi {cfg.unitName}/mana galchi…
            </div>
          )}
        </div>
      </div>

      {/* Info hint */}
      {totalLand !== null && totalUnits !== null && (
        <div
          className="bg-white/60 border rounded-lg px-3 py-2 text-xs text-[#64748b] space-y-1"
          style={{ borderColor: cat.borderColor }}
        >
          <div>
            ℹ <strong>{form.houses}</strong> mana ×{" "}
            <strong>{form.haPerHouse} ha</strong> ={" "}
            <strong style={{ color: cat.color }}>
              {totalLand} ha qophi lafaa
            </strong>
          </div>
          <div>
            ℹ <strong>{form.houses}</strong> mana ×{" "}
            <strong>
              {form.unitsPerHouse} {cfg.unitName}/mana
            </strong>{" "}
            ={" "}
            <strong style={{ color: cat.color }}>
              {totalUnits.toLocaleString()} {cfg.unitName} waliigalaa
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

function QonnaPlanPage() {
  const [pcts, setPcts] = useState({ ...DEFAULT_WOREDA_PCTS });
  // Each category has { houses, haPerHouse, unitsPerHouse }
  const [forms, setForms] = useState({ ...EMPTY_QONNA_FORM });
  // Furdisa: animal type
  const [furdisaType, setFurdisaType] = useState("cattle");
  const [furdisaOther, setFurdisaOther] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handlePct = (id, val) => setPcts((p) => ({ ...p, [id]: val }));
  const handleForm = (key, field, val) =>
    setForms((p) => ({ ...p, [key]: { ...p[key], [field]: val } }));

  const parsed = parsePcts(pcts);
  const pctValid = validatePcts(parsed);

  // Compute total animals per category from houses x unitsPerHouse
  const totalAnimals = Object.fromEntries(
    QONNA_CATEGORIES.map((c) => {
      const f = forms[c.key];
      const h = Number(f.houses);
      const u = Number(f.unitsPerHouse);
      return [c.key, h > 0 && u > 0 ? h * u : 0];
    }),
  );
  const hasAnyTarget = QONNA_CATEGORIES.some((c) => totalAnimals[c.key] > 0);
  const canSubmit = hasAnyTarget && pctValid.ok;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!pctValid.ok) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);

    // Save total animals (houses x unitsPerHouse) as the target for each category
    const qophi = Object.fromEntries(
      QONNA_CATEGORIES.map((c) => [c.key, totalAnimals[c.key]]),
    );
    const weights = Object.fromEntries(
      WOREDAS.map((w) => [w.id, Math.round(parsed[w.id] * 10)]),
    );

    try {
      await saveSubcityQonnaPlan(qophi, weights);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || "Failed to save Qonna plan.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">
           Annual Plan for Qonna
        </h1>
        <p className="text-[#64748b] text-sm mt-0.5">
         Enter The Required Information Below
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Woreda % allocation */}
        <WoRedaPctInputs pcts={pcts} onChange={handlePct} />

        {/* ── Furdisa ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#065f46 0%,#047857 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Furdisa
            </p>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                  Gosa Furdisaa
                </label>
                <select
                  value={furdisaType}
                  onChange={(e) => setFurdisaType(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 focus:border-[#065f46]"
                >
                  {FURDISA_ANIMAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {furdisaType === "other" && (
                <div>
                  <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                    Gosa Ibsi
                  </label>
                  <input
                    type="text"
                    value={furdisaOther}
                    onChange={(e) => setFurdisaOther(e.target.value)}
                    placeholder="fkn. Gaala, Harree…"
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 focus:border-[#065f46]"
                  />
                </div>
              )}
            </div>
            <QonnaPlanRow
              cat={QONNA_CATEGORIES[0]}
              form={forms.furdisa}
              onChange={(field, val) => handleForm("furdisa", field, val)}
            />
          </div>
        </div>

        {/* ── Kannisaa ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#b45309 0%,#d97706 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Kannisaa
            </p>
          </div>
          <div className="px-5 py-5">
            <QonnaPlanRow
              cat={QONNA_CATEGORIES.find((c) => c.key === "kannisaa")}
              form={forms.kannisaa}
              onChange={(field, val) => handleForm("kannisaa", field, val)}
            />
          </div>
        </div>

        {/* ── Qurxummii ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#0369a1 0%,#0284c7 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Qurxummii
            </p>
          </div>
          <div className="px-5 py-5">
            <QonnaPlanRow
              cat={QONNA_CATEGORIES.find((c) => c.key === "qurxummii")}
              form={forms.qurxummii}
              onChange={(field, val) => handleForm("qurxummii", field, val)}
            />
          </div>
        </div>

        {/* ── Annan, Lukkuu, Booyyee ── */}
        {[
          QONNA_CATEGORIES.find((c) => c.key === "annan"),
          QONNA_CATEGORIES.find((c) => c.key === "lukkuu"),
          QONNA_CATEGORIES.find((c) => c.key === "booyee"),
        ].map((cat) => (
          <div
            key={cat.key}
            className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden"
          >
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: `linear-gradient(90deg,${cat.color} 0%,${cat.color}cc 100%)`,
              }}
            >
              <p className="text-sm font-semibold text-white">{cat.label}</p>
              
            </div>
            <div className="px-5 py-5">
              <QonnaPlanRow
                cat={cat}
                form={forms[cat.key]}
                onChange={(field, val) => handleForm(cat.key, field, val)}
              />
            </div>
          </div>
        ))}

        {/* ── Allocation preview ── */}
        {hasAnyTarget && pctValid.ok && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f4f6f9] border-b border-[#e2e8f0]">
              <p className="text-sm font-semibold text-[#1e293b]">
                Woreda Allocation Preview
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">
                Waliigalli horii/mana x mana  woreda hundaaf qoodama
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
                        <span className="block text-[#94a3b8] font-normal normal-case">
                          {pcts[w.id]}%
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {QONNA_CATEGORIES.map((cat) => {
                    const total = totalAnimals[cat.key];
                    if (total === 0) return null;
                    return (
                      <tr
                        key={cat.key}
                        className="border-b border-[#f1f5f9] hover:bg-[#f4f6f9] transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-[#1e293b]">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">
                          {total.toLocaleString()}
                        </td>
                        {WOREDAS.map((w) => (
                          <td key={w.id} className="px-5 py-3 text-[#64748b]">
                            {pctShare(parsed, w.id, total).toLocaleString()}
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

        {/* ── Save bar ── */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#166534] text-sm font-semibold">
                <CheckIcon /> Qonna plan saved to all 4 woredas.
              </p>
            )}
            {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
            {!saved && !saveError && (
              <p className="text-[#94a3b8] text-xs">
                Saving distributes targets to all 4 woreda plan tables.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#065f46" }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon /> Save Qonna Plan
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
           Annual Plan For {title} 
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
          here
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
          Work Analysis For {sectorLabel}
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
             {sectorLabel}
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
  const [activeSector, setActiveSector] = useState("buusaa");
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

  const REPORT_SECTORS = [
    { id: "buusaa",     label: "Buusaa Gonofaa",    color: "#1a3a5c" },
    { id: "carraaHojii",label: "Carraa Hojii Uumuu",color: "#1e40af" },
    { id: "qonna",      label: "Qonna",             color: "#065f46" },
    { id: "revenue",    label: "Galii Sassaabu",    color: "#475569" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Woreda Reports</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Select a woreda and sector to view submitted reports.
        </p>
      </div>

      {/* Woreda tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {WOREDAS.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveWoreda(w.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeWoreda === w.id
                ? "text-white shadow"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a3a5c] hover:text-[#1a3a5c]"
            }`}
            style={activeWoreda === w.id
              ? { background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }
              : {}}
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* Sector tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {REPORT_SECTORS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSector(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeSector === s.id
                ? "text-white shadow"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#1e293b]"
            }`}
            style={activeSector === s.id ? { backgroundColor: s.color } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Buusaa Gonofaa plan allocation */}
      {activeSector === "buusaa" && hasPlan && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
                <p className="text-xs text-[#94a3b8] mt-0.5">Allocated target</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Report table per sector */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 border-b border-[#e2e8f0]"
          style={{
            background: `linear-gradient(90deg,${
              REPORT_SECTORS.find((s) => s.id === activeSector)?.color ?? "#1a3a5c"
            } 0%,${
              REPORT_SECTORS.find((s) => s.id === activeSector)?.color ?? "#1e4976"
            }cc 100%)`,
          }}
        >
          <p className="text-sm font-semibold text-white">
            {woreda.name} — {REPORT_SECTORS.find((s) => s.id === activeSector)?.label} Reports
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Submitted reports will appear here once the backend is connected.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                {["Date", "Report Type", "Sector", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#f4f6f9] flex items-center justify-center text-[#94a3b8]">
                      <ListIcon />
                    </div>
                    <p className="text-[#94a3b8] text-sm">
                      No {REPORT_SECTORS.find((s) => s.id === activeSector)?.label} reports
                      found for {woreda.name}.
                    </p>
                    <code className="text-xs bg-[#f4f6f9] px-2 py-1 rounded text-[#64748b]">
                      GET /api/reports?woreda={activeWoreda}&sector={activeSector}
                    </code>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
                    {s.id === "buusaa" || s.id === "qonna"
                      ? "Active"
                      : "Coming soon"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      if (activePlanSector === "buusaa")
        return <BuusaaPlanPage onSave={handleSavePlan} />;
      if (activePlanSector === "qonna") return <QonnaPlanPage />;
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

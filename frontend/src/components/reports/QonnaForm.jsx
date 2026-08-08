import { useState } from "react";
import { submitQonnaReport } from "../../api/reportApi";

// ─── Furdisa animal types ─────────────────────────────────────────────────────
// Easy to extend once the planner confirms the final official list.
const FURDISA_ANIMAL_TYPES = [
  { value: "cattle", label: "Cattle" },
  { value: "goat",   label: "Goat" },
  { value: "sheep",  label: "Sheep" },
  { value: "ox",     label: "Ox" },
  { value: "other",  label: "Other (specify)" },
];

// ─── Category metadata ────────────────────────────────────────────────────────
const QONNA_CATS = [
  { name: "furdisa",   label: "Furdisa",   description: "Livestock",          color: "#065f46", bgColor: "#f0fdf4", borderColor: "#bbf7d0" },
  { name: "annan",     label: "Annan",     description: "Dairy — horii",      color: "#0f766e", bgColor: "#f0fdfa", borderColor: "#99f6e4" },
  { name: "lukkuu",    label: "Lukkuu",    description: "Poultry",             color: "#1e40af", bgColor: "#eff6ff", borderColor: "#bfdbfe" },
  { name: "booyyee",   label: "Booyyee",   description: "Pig farming",         color: "#7c3aed", bgColor: "#f5f3ff", borderColor: "#ddd6fe" },
  { name: "kanniissa", label: "Kanniissa", description: "Apiculture",          color: "#b45309", bgColor: "#fffbeb", borderColor: "#fde68a" },
  { name: "qurxummii", label: "Qurxummii", description: "Fish / pond farming", color: "#0369a1", bgColor: "#f0f9ff", borderColor: "#bae6fd" },
];

const REPORT_TYPES = [
  "Daily Report — Gabaasa Guyyaa",
  "Weekly Report — Gabaasa Torban",
  "Monthly Report — Gabaasa Ji'aa",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ─── Small icons ──────────────────────────────────────────────────────────────
function SubmitIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
const QonnaForm = ({ userId }) => {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [reportDate, setReportDate] = useState(todayStr());

  // Furdisa: flexible animal type
  const [furdisaType, setFurdisaType] = useState("cattle");
  const [furdisaOther, setFurdisaOther] = useState("");

  // Numeric values for all 6 categories
  const [values, setValues] = useState({
    furdisa: "",
    annan: "",
    lukkuu: "",
    booyyee: "",
    kanniissa: "",
    qurxummii: "",
  });

  const [yaada, setYaada] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleValue = (name, raw) => {
    // Allow empty string while typing; coerce on submit
    setValues((p) => ({ ...p, [name]: raw }));
  };

  const handleClear = () => {
    setValues({ furdisa: "", annan: "", lukkuu: "", booyyee: "", kanniissa: "", qurxummii: "" });
    setYaada("");
    setFurdisaType("cattle");
    setFurdisaOther("");
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await submitQonnaReport({
        user_id: userId,
        report_date: reportDate,
        report_type: reportType,
        furdisa:   parseFloat(values.furdisa)   || 0,
        annan:     parseFloat(values.annan)     || 0,
        lukkuu:    parseFloat(values.lukkuu)    || 0,
        booyyee:   parseFloat(values.booyyee)   || 0,
        kanniissa: parseFloat(values.kanniissa) || 0,
        qurxummii: parseFloat(values.qurxummii) || 0,
        // Furdisa animal type stored in notes for now (backend field TBD)
        yaada_gudinaa: [
          furdisaType === "other"
            ? `Furdisa type: ${furdisaOther || "Other"}`
            : `Furdisa type: ${FURDISA_ANIMAL_TYPES.find((t) => t.value === furdisaType)?.label ?? furdisaType}`,
          yaada,
        ]
          .filter(Boolean)
          .join(" | "),
      });
      setSuccess(true);
      handleClear();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Status messages ── */}
      {success && (
        <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
          <CheckIcon />
          <span className="text-[#166534] text-sm font-semibold">
            Qonna report submitted successfully.
          </span>
        </div>
      )}
      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Report type + date row ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5 uppercase tracking-wide">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
            >
              {REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:w-44">
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5 uppercase tracking-wide">
              Report Date
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
            />
          </div>
        </div>

        {/* ── Furdisa — flexible animal type ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{ background: "linear-gradient(90deg,#065f46 0%,#047857 100%)" }}
          >
            <p className="text-sm font-semibold text-white">Furdisa — Livestock</p>
            <p className="text-white/60 text-xs mt-0.5">Select the animal type and enter the reported count</p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Animal type selector */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Animal Type</label>
              <select
                value={furdisaType}
                onChange={(e) => setFurdisaType(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 focus:border-[#065f46]"
              >
                {FURDISA_ANIMAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {/* Specify if "other" */}
            {furdisaType === "other" ? (
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Specify</label>
                <input
                  type="text"
                  value={furdisaOther}
                  onChange={(e) => setFurdisaOther(e.target.value)}
                  placeholder="e.g. Camel, Donkey…"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 focus:border-[#065f46]"
                />
              </div>
            ) : (
              <div className="flex items-end">
                <p className="text-xs text-[#94a3b8] pb-3">
                  Selected:{" "}
                  <span className="font-semibold text-[#065f46]">
                    {FURDISA_ANIMAL_TYPES.find((t) => t.value === furdisaType)?.label}
                  </span>
                </p>
              </div>
            )}
            {/* Count */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Count (animals)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={values.furdisa}
                onChange={(e) => handleValue("furdisa", e.target.value)}
                placeholder="0"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 focus:border-[#065f46]"
              />
            </div>
          </div>
        </div>

        {/* ── Remaining 5 categories ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{ background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }}
          >
            <p className="text-sm font-semibold text-white">Qonna Categories</p>
            <p className="text-white/60 text-xs mt-0.5">
              Enter reported actual values for each category
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {QONNA_CATS.slice(1).map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border px-4 py-4"
                style={{ borderColor: cat.borderColor, backgroundColor: cat.bgColor }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <p className="text-sm font-semibold" style={{ color: cat.color }}>
                    {cat.label}
                  </p>
                  <span className="text-xs text-[#94a3b8]">— {cat.description}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={values[cat.name]}
                  onChange={(e) => handleValue(cat.name, e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": `${cat.color}33` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Yaada Gudinaa ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-5">
          <label className="block text-sm font-semibold text-[#334155] mb-2">
            Yaada Gudinaa
            <span className="ml-1 text-xs text-[#94a3b8] font-normal">(optional)</span>
          </label>
          <textarea
            value={yaada}
            onChange={(e) => setYaada(e.target.value)}
            rows={3}
            placeholder="Enter Yaada Gudinaa details…"
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 resize-none"
          />
        </div>

        {/* ── Submit bar ── */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 shadow-sm">
          <p className="text-[#94a3b8] text-xs">
            Report date: <span className="font-semibold text-[#1e293b]">{reportDate}</span>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="border border-[#e2e8f0] text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f4f6f9] transition-all"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#065f46" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                <><SubmitIcon /> Submit Qonna Report</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QonnaForm;

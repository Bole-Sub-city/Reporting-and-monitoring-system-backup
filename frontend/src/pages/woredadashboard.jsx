import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { submitBuusaaReport } from "../api/reportApi";
import { submitAnnualPlan, fetchMyPlan, fetchSummary } from "../api/planApi";

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
function PlanIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}
function AnalysisIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
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
function LockIcon() {
  return (
    <svg
      className="w-4 h-4 inline-block ml-1"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ── Constants ─────────────────────────────────────────────────
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
    label: "Buusii Jiraataa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaa",
    label: "Buusii Daldalaa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaaFiGumaataa",
    label: "Buusii Daldalaa fi Gumaataa",
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
  { name: "zayitii", label: "Zayitii", required: false, type: "number" },
  {
    name: "sukkaara",
    label: "Sukkaara",
    required: false,
    type: "number",
    fullWidth: true,
  },
];

const REPORT_TYPES = [
  "Daily Report — Gabaasa Guyyaa",
  "Weekly Report — Gabaasa Torban",
  "Monthly Report — Gabaasa Ji'aa",
];

// Plan fields with their display info and matching summary key
const PLAN_FIELDS = [
  {
    key: "hubannoo_uummuu",
    planKey: "hubannoo_uummuu_target",
    label: "Hubannoo Uummuu",
    description: "Awareness targets",
    color: "#7c3aed",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
  },
  {
    key: "horannaa_misensaa",
    planKey: "horannaa_misensaa_target",
    label: "Horannaa Misensaa",
    description: "Member enrollment targets",
    color: "#059669",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
  },
  {
    key: "buusi_jirataa",
    planKey: "buusii_jirataa_target",
    label: "Buusii Jirataa",
    description: "Household beneficiary targets",
    color: "#2563eb",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  {
    key: "buusi_daldalaa",
    planKey: "buusi_daldalaa_target",
    label: "Buusii Daldalaa Sadarkaa B",
    description: "Business beneficiary targets",
    color: "#d97706",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
];

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

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

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// Partition annual target to the given period
function partitionTarget(annual, period) {
  if (!annual) return 0;
  const divisors = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    annual: 1,
  };
  return Math.round(annual / (divisors[period] || 1));
}

// ── Pure SVG Ring Chart — no external library ─────────────────
function RingChart({ actual, target, color, label, description }) {
  const pct =
    target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center shadow-sm">
      <p className="text-sm font-bold text-gray-700 mb-0.5 text-center">
        {label}
      </p>
      <p className="text-xs text-gray-400 mb-3 text-center">{description}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />
        </svg>
        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-extrabold leading-none"
            style={{ color }}
          >
            {pct}%
          </span>
          <span className="text-xs text-gray-400 mt-1">done</span>
        </div>
      </div>
      <div className="mt-4 w-full space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Actual</span>
          <span className="font-semibold text-gray-800">
            {actual.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Target (period)</span>
          <span className="font-semibold text-gray-800">
            {target.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Annual Plan Form / View ───────────────────────────────────
function AnnualPlanSection({ u }) {
  const [plan, setPlan] = useState(null); // null = not loaded
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hubannoo_uummuu_target: "",
    horannaa_misensaa_target: "",
    buusi_jirataa_target: "",
    buusi_daldalaa_target: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchMyPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await submitAnnualPlan({
        hubannoo_uummuu_target: Number(form.hubannoo_uummuu_target),
        horannaa_misensaa_target: Number(form.horannaa_misensaa_target),
        buusi_jirataa_target: Number(form.buusi_jirataa_target),
        buusi_daldalaa_target: Number(form.buusi_daldalaa_target),
      });
      setSuccess("Annual plan saved and locked successfully.");
      const d = await fetchMyPlan();
      setPlan(d.plan);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Annual Plan</h1>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {year}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Set your yearly targets for each category. Once submitted, the plan is{" "}
        <strong>locked</strong> and cannot be changed.
      </p>

      {/* Already submitted — show locked view */}
      {plan ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 flex items-center gap-3 border-b border-gray-100"
            style={{
              background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)",
            }}
          >
            <PlanIcon />
            <div>
              <p className="text-white font-bold text-base">
                Annual Plan — {year} <LockIcon />
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {u.name} · {u.woreda} · Read-only
              </p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLAN_FIELDS.map(
                ({ planKey, label, bgColor, borderColor, textColor }) => (
                  <div
                    key={planKey}
                    className={`rounded-xl border ${borderColor} ${bgColor} px-5 py-4`}
                  >
                    <p
                      className={`text-xs font-bold uppercase tracking-wide ${textColor} mb-1`}
                    >
                      {label}
                    </p>
                    <p className="text-3xl font-extrabold text-gray-800">
                      {(plan[planKey] ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Annual target</p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              <p className="text-green-700 text-sm font-medium">
                Plan is locked. Contact your administrator if changes are
                needed.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Not yet submitted — show form */
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-4">
            <div
              className="px-6 py-4 border-b border-gray-100"
              style={{
                background: "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)",
              }}
            >
              <p className="text-white font-bold text-base">
                Enter Annual Targets — {year}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {u.name} · {u.woreda}
              </p>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PLAN_FIELDS.map(
                ({ planKey, label, description, borderColor }) => (
                  <div key={planKey}>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-1.5">
                      {description}
                    </p>
                    <input
                      type="number"
                      name={planKey}
                      value={form[planKey]}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Enter annual target"
                      className={`w-full border ${borderColor} rounded-xl px-3 py-2.5 text-sm
                      text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300
                      focus:border-transparent placeholder-gray-400 transition-all`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">
              {success}
            </div>
          )}
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-gray-400 text-xs">
              ⚠ Once submitted, this plan <strong>cannot be edited</strong>.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60
                text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <PlanIcon />
              {saving ? "Saving..." : "Submit & Lock Plan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Analysis Section ──────────────────────────────────────────
function AnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load plan once
  useEffect(() => {
    fetchMyPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null));
  }, []);

  // Load summary whenever period changes
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => setSummary(d.summary))
      .catch(() => setError("Failed to load summary data."))
      .finally(() => setLoading(false));
  }, [period]);

  const noPlan = !plan;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Work Analysis</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Comparing actual performance against partitioned plan targets
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {noPlan && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-amber-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-amber-700 text-sm">
            No annual plan set. Please submit your Annual Plan first to see
            targets in the charts.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* Period info banner */}
          <div className="mb-5 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-purple-700 text-xs font-bold uppercase tracking-wide">
              {PERIODS.find((p) => p.value === period)?.label} View
            </span>
            <span className="text-purple-400 text-xs">—</span>
            <span className="text-purple-600 text-xs">
              Targets are auto-partitioned from the annual plan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLAN_FIELDS.map(({ key, planKey, label, description, color }) => {
              const annualTarget = plan ? (plan[planKey] ?? 0) : 0;
              const periodTarget = partitionTarget(annualTarget, period);
              const actual = summary ? (summary[key] ?? 0) : 0;
              return (
                <RingChart
                  key={key}
                  actual={actual}
                  target={periodTarget}
                  color={color}
                  label={label}
                  description={description}
                />
              );
            })}
          </div>

          {/* Summary table */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">
                {PERIODS.find((p) => p.value === period)?.label} Summary Table
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Category",
                    "Annual Target",
                    "Period Target",
                    "Actual",
                    "% Complete",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FIELDS.map(({ key, planKey, label, color }) => {
                  const annualTarget = plan ? (plan[planKey] ?? 0) : 0;
                  const periodTarget = partitionTarget(annualTarget, period);
                  const actual = summary ? (summary[key] ?? 0) : 0;
                  const pct =
                    periodTarget > 0
                      ? Math.min(Math.round((actual / periodTarget) * 100), 100)
                      : 0;
                  return (
                    <tr
                      key={key}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-gray-800">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          {label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {annualTarget.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {periodTarget.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        {actual.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: `${color}22`,
                            color,
                          }}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Placeholder submit ────────────────────────────────────────
function PlaceholderSubmit({ title, color, icon: Icon, u, onBack }) {
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
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 flex flex-col items-center justify-center text-center">
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

// ── Buusaa Gonofaa submit form ────────────────────────────────
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitBuusaaReport({
        report_type: reportType,
        report_date: todayStr(),
        hubannoo_uummuu: Number(form.hubannooUummuu || 0),
        horannaa_misensaa: Number(form.hojiiwwanMootummaa || 0),
        buusi_jirataa: Number(form.buuusiJirataa || 0),
        buusi_daldalaa: Number(form.buuusiDaldalaa || 0),
        buusi_daldalaa_fi_gumaataa: Number(form.buuusiDaldalaaFiGumaataa || 0),
        gumaata_midhaani: Number(form.gumaataMootummaa || 0),
        nyaata_barataa: Number(form.nyaataBarataa || 0),
        zayitii: Number(form.zayitii || 0),
        sukkaara: Number(form.sukkaara || 0),
        yaada_gudinaa: yaada,
      });
      alert("Report submitted successfully.");
      handleClear();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report.");
    }
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
        <button className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all">
          <HistoryIcon /> History
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
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
          <p className="text-amber-600 text-xs mt-0.5">⏰ Deadline: —</p>
        </div>
      </div>
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all resize-none"
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
              className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon /> Submit Report
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Works overview ────────────────────────────────────────────
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
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
export default function WoRedaDashboard() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const u = loggedUser
    ? {
        name: loggedUser.username,
        role: loggedUser.role,
        woreda: "Woreda 08",
        subcity: "Adama Bole",
        initials: loggedUser.username.substring(0, 2).toUpperCase(),
      }
    : {
        name: "Guest",
        role: "wereda",
        woreda: "Woreda 08",
        subcity: "Adama Bole",
        initials: "GU",
      };

  const [activeNav, setActiveNav] = useState("dashboard");
  const [worksOpen, setWorksOpen] = useState(true);
  const [activeWork, setActiveWork] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const sideW = collapsed ? "w-16" : "w-60";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const topLabel = () => {
    if (activeNav === "works") {
      if (!activeWork) return "Works";
      return WORKS.find((w) => w.id === activeWork)?.label ?? "Works";
    }
    return (
      {
        dashboard: "Dashboard",
        history: "Report History",
        plan: "Annual Plan",
        analysis: "Work Analysis",
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
    <div
      className="flex h-screen max-h-screen bg-[#f0f2f5] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ════ SIDEBAR ════ */}
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

          {/* Works collapsible */}
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

          {/* Annual Plan & Analysis */}
          {navBtn("plan", "Annual Plan", PlanIcon)}
          {navBtn("analysis", "Work Analysis", AnalysisIcon)}

          {navBtn("announcements", "Announcements", AnnouncementsIcon)}
          {navBtn("profile", "Profile & Settings", ProfileIcon)}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 py-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <CollapseIcon collapsed={collapsed} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
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
              <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {u.initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-gray-800 text-sm font-semibold leading-tight">
                  {u.name}
                </p>
                <p className="text-gray-500 text-xs capitalize">{u.role}</p>
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
                  {
                    label: "Total Submitted",
                    value: "—",
                    color: "bg-purple-50 border-purple-200 text-purple-700",
                  },
                  {
                    label: "Pending Review",
                    value: "—",
                    color: "bg-amber-50 border-amber-200 text-amber-700",
                  },
                  {
                    label: "Approved",
                    value: "—",
                    color: "bg-green-50 border-green-200 text-green-700",
                  },
                  {
                    label: "Rejected",
                    value: "—",
                    color: "bg-red-50 border-red-200 text-red-700",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl border p-5 ${color}`}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>
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
                    className="bg-white rounded-xl border border-gray-200 px-4 py-5 flex flex-col items-center hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
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
              <h1 className="text-2xl font-bold text-gray-800 mb-5">
                Report History
              </h1>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {[
                        "Date",
                        "Section",
                        "Report Type",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-gray-400 text-sm"
                      >
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
              {!activeWork && <WorksOverview u={u} onSelect={setActiveWork} />}
              {activeWork === "buusaa" && <BuusaaSubmitForm u={u} />}
              {activeWork === "revenue" && (
                <PlaceholderSubmit
                  title="Revenue"
                  color="bg-green-100 text-green-600"
                  icon={RevenueIcon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              )}
              {activeWork === "work1" && (
                <PlaceholderSubmit
                  title="Work Area 1"
                  color="bg-blue-100 text-blue-600"
                  icon={WorkAreaIcon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              )}
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

          {/* ANNUAL PLAN */}
          {activeNav === "plan" && <AnnualPlanSection u={u} />}

          {/* WORK ANALYSIS */}
          {activeNav === "analysis" && <AnalysisSection />}

          {/* ANNOUNCEMENTS */}
          {activeNav === "announcements" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-5">
                Announcements
              </h1>
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
                    { label: "Role", value: u.role },
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

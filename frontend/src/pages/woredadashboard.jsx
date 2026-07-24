import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import {
  submitBuusaaReport,
  submitCarraaHojiiReport,
  submitQonnaReport,
  submitRevenueReport,
} from "../api/reportApi";
import {
  submitAnnualPlan,
  fetchMyPlan,
  fetchSummary,
  fetchSummaryByDateRange,
} from "../api/planApi";
import adamaLogo from "../assets/adamalogo.png";

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
function AgricultureIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function JobsIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    label: "Buusii Daldalaa Sadarka B",
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
  { value: "custom", label: "Custom Date Range" },
];

// Afaan Oromo months with their approximate Gregorian date ranges
// Each month is ~30 days; start dates are approximate Gregorian equivalents
const OROMO_MONTHS = [
  { name: "Adoolessa", gregStart: "07-08" },
  { name: "Hagayya", gregStart: "08-07" },
  { name: "Fulbaana", gregStart: "09-06" },
  { name: "Onkololeessa", gregStart: "10-06" },
  { name: "Sadaasa", gregStart: "11-05" },
  { name: "Mudde", gregStart: "12-05" },
  { name: "Amajjii", gregStart: "01-04" },
  { name: "Guraandhala", gregStart: "02-03" },
  { name: "Bitooteessa", gregStart: "03-05" },
  { name: "Ebla", gregStart: "04-04" },
  { name: "Caamsaa", gregStart: "05-04" },
  { name: "Waxabajjii", gregStart: "06-03" },
];

// Generate day options 1-30
const OROMO_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const CARRAA_HOJII_FIELDS = [
  { name: "qusannnaa", label: "Qusannnaa", required: true, type: "number" },
  { name: "liqii", label: "Liqii", required: true, type: "number" },
  {
    name: "qusanna_dirqii",
    label: "Qusanna Dirqii",
    required: true,
    type: "number",
  },
  {
    name: "deebii_liqii_bilchaate",
    label: "Deebii Liqii Bilchaate",
    required: true,
    type: "number",
  },
  {
    name: "deebii_liqii_bulee",
    label: "Deebii Liqii Bulee",
    required: true,
    type: "number",
  },
  {
    name: "carraa_hojii_dhaabbii",
    label: "Carraa Hojii Dhaabbii",
    required: true,
    type: "number",
  },
  {
    name: "carraa_hojii_qacarrii",
    label: "Carraa Hojii Qacarrii",
    required: true,
    type: "number",
  },
  { name: "leenjii", label: "Leenjii", required: true, type: "number" },
  {
    name: "industrii_godoo",
    label: "Industrii Godoo",
    required: true,
    type: "number",
  },
];
const QONNA_FIELDS = [
  { name: "furdisa", label: "Furdisa", required: true, type: "number" },
  { name: "annan", label: "Annan", required: true, type: "number" },
  { name: "lukkuu", label: "Lukkuu", required: true, type: "number" },
  { name: "booyyee", label: "Booyyee", required: true, type: "number" },
  { name: "qurxummii", label: "Qurxummii", required: true, type: "number" },
  { name: "kanniissa", label: "Kanniissa", required: true, type: "number" },
];
const REVENUE_FIELDS = [
  {
    name: "galiiIdilee",
    label: "Galii Idilee",
    required: true,
    type: "number",
  },
  {
    name: "galiiManaQophessaa",
    label: "Galii Mana Qophessaa",
    required: true,
    type: "number",
  },
];
const WORKS = [
  {
    id: "buusaa",
    label: "Buusaa Gonofaa",
    icon: BuusaaIcon,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "carraaHojii",
    label: "Carraa Hojii Uummuu",
    icon: JobsIcon,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "qonna",
    label: "Qonna",
    icon: AgricultureIcon,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "revenue",
    label: "Revenue Collection",
    icon: RevenueIcon,
    color: "bg-amber-100 text-amber-600",
  },
];
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function partitionTarget(annual, period) {
  if (!annual) return 0;
  const d = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, annual: 1 };
  return Math.round(annual / (d[period] || 1));
}

function RingChart({ actual, target, color, label, description }) {
  const pct =
    target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  const size = 140,
    sw = 14,
    r = (size - sw) / 2,
    circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center shadow-sm">
      <p className="text-sm font-bold text-gray-700 mb-0.5 text-center">
        {label}
      </p>
      <p className="text-xs text-gray-400 mb-3 text-center">{description}</p>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={sw}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s ease" }}
          />
        </svg>
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

function AnnualPlanSection({ u }) {
  const [plan, setPlan] = useState(null);
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
  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
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
                      className={`w-full border ${borderColor} rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all`}
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
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
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

// Convert an Oromo month name + day + year to a Gregorian ISO date string
function oromoToGregorian(monthName, day, year) {
  const month = OROMO_MONTHS.find((m) => m.name === monthName);
  if (!month) return null;
  // Parse the base Gregorian date for this month in the given year
  const [mm, dd] = month.gregStart.split("-").map(Number);
  // Amajjii-Waxabajjii fall in the next Gregorian year relative to Ethiopian year start
  const gregYear = mm <= 6 ? year + 1 : year;
  const base = new Date(gregYear, mm - 1, dd);
  base.setDate(base.getDate() + (day - 1));
  return base.toISOString().split("T")[0];
}

function AnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Custom date range state
  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState("Adoolessa");
  const [startDay, setStartDay] = useState(1);
  const [endMonth, setEndMonth] = useState("Adoolessa");
  const [endDay, setEndDay] = useState(30);
  const [customYear, setCustomYear] = useState(currentYear - 1); // Ethiopian fiscal year start
  const [customSummary, setCustomSummary] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [customRange, setCustomRange] = useState(null); // { from, to } labels

  useEffect(() => {
    fetchMyPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null));
  }, []);

  useEffect(() => {
    if (period === "custom") return;
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => setSummary(d.summary))
      .catch(() => setError("Failed to load summary data."))
      .finally(() => setLoading(false));
  }, [period]);

  const handleGenerateReport = async () => {
    const dateFrom = oromoToGregorian(startMonth, startDay, customYear);
    const dateTo = oromoToGregorian(endMonth, endDay, customYear);
    if (!dateFrom || !dateTo) {
      setCustomError("Invalid date selection.");
      return;
    }
    if (dateFrom > dateTo) {
      setCustomError("Start date must be before end date.");
      return;
    }
    setCustomLoading(true);
    setCustomError("");
    setCustomSummary(null);
    try {
      const d = await fetchSummaryByDateRange(dateFrom, dateTo);
      setCustomSummary(d.summary);
      setCustomRange({
        from: `${startMonth} ${startDay}`,
        to: `${endMonth} ${endDay}`,
      });
    } catch {
      setCustomError("Failed to load custom range data.");
    } finally {
      setCustomLoading(false);
    }
  };

  const isCustom = period === "custom";
  const activeSummary = isCustom ? customSummary : summary;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Work Analysis</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Comparing actual performance against partitioned plan targets
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setCustomSummary(null);
              setCustomRange(null);
            }}
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

      {/* No plan warning */}
      {!plan && (
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

      {/* ── Custom Date Range picker ── */}
      {isCustom && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Select Custom Date Range (Afaan Oromo Calendar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Ethiopian fiscal year */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Fiscal Year (starts Adoolessa)
              </label>
              <input
                type="number"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                min="2000"
                max="2100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            {/* Start */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {OROMO_MONTHS.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {OROMO_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* End */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                End Date
              </label>
              <div className="flex gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {OROMO_MONTHS.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={endDay}
                  onChange={(e) => setEndDay(Number(e.target.value))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {OROMO_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {customError && (
            <p className="text-red-600 text-sm mb-3">{customError}</p>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={customLoading}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <AnalysisIcon />
            {customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* ── Standard period loading ── */}
      {!isCustom && loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : !isCustom && error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      ) : isCustom && customLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : isCustom && !customSummary ? null : (
        <>
          {/* Period label banner */}
          <div className="mb-5 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-purple-700 text-xs font-bold uppercase tracking-wide">
              {isCustom && customRange
                ? `${customRange.from} — ${customRange.to}`
                : `${periodLabel} View`}
            </span>
            {!isCustom && (
              <>
                <span className="text-purple-400 text-xs">—</span>
                <span className="text-purple-600 text-xs">
                  Targets are auto-partitioned from the annual plan
                </span>
              </>
            )}
          </div>

          {/* Ring charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLAN_FIELDS.map(({ key, planKey, label, description, color }) => {
              const at = plan ? (plan[planKey] ?? 0) : 0;
              const pt = isCustom ? 0 : partitionTarget(at, period);
              const ac = activeSummary ? (activeSummary[key] ?? 0) : 0;
              return (
                <RingChart
                  key={key}
                  actual={ac}
                  target={pt}
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
                {isCustom && customRange
                  ? `${customRange.from} — ${customRange.to} Summary`
                  : `${periodLabel} Summary Table`}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Category",
                    isCustom ? "Total Actual" : "Annual Target",
                    isCustom ? "—" : "Period Target",
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
                  const at = plan ? (plan[planKey] ?? 0) : 0;
                  const pt = isCustom ? 0 : partitionTarget(at, period);
                  const ac = activeSummary ? (activeSummary[key] ?? 0) : 0;
                  const pct =
                    pt > 0 ? Math.min(Math.round((ac / pt) * 100), 100) : 0;
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
                        {isCustom ? "—" : at.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {isCustom ? "—" : pt.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        {ac.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {isCustom ? (
                          "—"
                        ) : (
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ backgroundColor: `${color}22`, color }}
                          >
                            {pct}%
                          </span>
                        )}
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

function PlaceholderAnnualPlan({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {title} — Annual Plan
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {u.woreda} &middot; {u.subcity}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <PlanIcon />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Annual Plan
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          The annual plan for <strong>{title}</strong> will be managed here —
          targets and progress tracking for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

function PlaceholderAnalysis({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {title} — Work Analysis
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {u.woreda} &middot; {u.subcity}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <AnalysisIcon />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Work Analysis
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          Performance analytics for <strong>{title}</strong> will be shown here
          — charts, trends, and targets for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 flex flex-col items-center gap-4 min-w-[320px] animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
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
        </div>
        <h2 className="text-xl font-bold text-gray-800">Report Submitted</h2>
        <p className="text-gray-500 text-sm text-center">
          Your report has been submitted successfully.
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function BuusaaSubmitForm({ u }) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(true);
      handleClear();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report.");
    }
  };
  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all resize-none"
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

function GenericSubmitForm({
  u,
  fields,
  submitFn,
  title,
  headerColor = "linear-gradient(90deg,#1e1456 0%,#2d1f7a 100%)",
}) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClear = () => {
    setForm({});
    setYaada("");
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        report_type: reportType,
        report_date: todayStr(),
        yaada_gudinaa: yaada,
      };
      fields.forEach(({ name }) => {
        payload[name] = Number(form[name] || 0);
      });
      await submitFn(payload);
      setShowModal(true);
      handleClear();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Submit Report</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {title} — complete all required fields
          </p>
        </div>
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
          <div className="px-5 py-4" style={{ background: headerColor }}>
            <p className="text-white font-bold text-base">{title}</p>
            <p className="text-white/60 text-xs mt-0.5">
              {u.name} &middot; {u.subcity} &middot; {u.woreda}
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {fields.map(({ name, label, required, type }) => (
              <div key={name}>
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder-gray-400 transition-all resize-none"
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}
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
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon />
              {saving ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

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
                : id === "carraaHojii"
                  ? "Employment and job creation reports"
                  : id === "qonna"
                    ? "Agriculture sector reports"
                    : id === "revenue"
                      ? "Revenue collection and financial reports"
                      : "Content coming soon"}
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
  const [expandedWork, setExpandedWork] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? "w-16" : "w-64";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const topLabel = () => {
    if (activeNav === "works") {
      if (!activeWork) return "Works";
      const [wid, sub] = activeWork.split(":");
      const wl = WORKS.find((w) => w.id === wid)?.label ?? "Works";
      if (sub === "plan") return `${wl} — Annual Plan`;
      if (sub === "analysis") return `${wl} — Work Analysis`;
      return wl;
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
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${active ? "bg-green-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
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
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-contain bg-white flex-shrink-0 p-0.5"
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
        <nav className="flex-1 py-3 overflow-y-auto">
          {navBtn("dashboard", "Dashboard", DashboardIcon)}
          <div>
            <button
              onClick={() => {
                setActiveNav("works");
                setWorksOpen((p) => !p);
                setActiveWork(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeNav === "works" ? "bg-green-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
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
                  const isExp = expandedWork === id;
                  const isPlanActive =
                    activeNav === "works" && activeWork === `${id}:plan`;
                  const isAnalysisActive =
                    activeNav === "works" && activeWork === `${id}:analysis`;
                  const anySubActive = isPlanActive || isAnalysisActive;
                  const handleRowClick = () => {
                    setActiveNav("works");
                    setExpandedWork(isExp ? null : id);
                    if (!anySubActive) setActiveWork(null);
                  };
                  return (
                    <div key={id}>
                      <button
                        onClick={handleRowClick}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${anySubActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                      >
                        <Icon />
                        <span className="flex-1 truncate text-left">
                          {label}
                        </span>
                        <ChevronIcon open={isExp || anySubActive} />
                      </button>
                      {(isExp || anySubActive) && (
                        <div className="ml-3 border-l border-white/10 pl-2 mt-0.5 mb-1 space-y-0.5">
                          <button
                            onClick={() => {
                              setActiveNav("works");
                              setActiveWork(`${id}:plan`);
                              setExpandedWork(id);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isPlanActive ? "bg-white/15 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
                          >
                            <PlanIcon />
                            <span className="truncate">Annual Plan</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveNav("works");
                              setActiveWork(`${id}:analysis`);
                              setExpandedWork(id);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isAnalysisActive ? "bg-white/15 text-white" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
                          >
                            <AnalysisIcon />
                            <span className="truncate">Work Analysis</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {navBtn("history", "Report History", HistoryIcon)}
          {navBtn("announcements", "Announcements", AnnouncementsIcon)}
          {navBtn("profile", "Profile & Settings", ProfileIcon)}
        </nav>
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
        <main className="flex-1 overflow-y-auto px-6 py-6">
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
                      setExpandedWork(id);
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

          {activeNav === "works" &&
            (() => {
              if (!activeWork)
                return (
                  <WorksOverview
                    u={u}
                    onSelect={(id) => {
                      setActiveWork(id);
                      setExpandedWork(id);
                    }}
                  />
                );
              const [wid, sub] = activeWork.split(":");
              const work = WORKS.find((w) => w.id === wid);
              if (sub === "plan") {
                if (wid === "buusaa") return <AnnualPlanSection u={u} />;
                return <PlaceholderAnnualPlan title={work?.label} u={u} />;
              }
              if (sub === "analysis") {
                if (wid === "buusaa") return <AnalysisSection />;
                return <PlaceholderAnalysis title={work?.label} u={u} />;
              }
              if (wid === "buusaa") return <BuusaaSubmitForm u={u} />;
              if (wid === "carraaHojii")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={CARRAA_HOJII_FIELDS}
                    submitFn={submitCarraaHojiiReport}
                    title="Carraa Hojii Uummuu"
                    headerColor="linear-gradient(90deg,#1e40af 0%,#2563eb 100%)"
                  />
                );
              if (wid === "qonna")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={QONNA_FIELDS}
                    submitFn={submitQonnaReport}
                    title="Qonna"
                    headerColor="linear-gradient(90deg,#065f46 0%,#059669 100%)"
                  />
                );
              if (wid === "revenue")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={REVENUE_FIELDS}
                    submitFn={submitRevenueReport}
                    title="Revenue Collection"
                    headerColor="linear-gradient(90deg,#92400e 0%,#d97706 100%)"
                  />
                );
              return (
                <PlaceholderSubmit
                  title={work?.label}
                  color={work?.color}
                  icon={work?.icon}
                  u={u}
                  onBack={() => setActiveWork(null)}
                />
              );
            })()}

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

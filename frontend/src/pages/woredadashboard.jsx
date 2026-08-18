import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import {
  submitBuusaaReport,
  submitCarraaHojiiReport,
  submitQonnaReport,
  submitRevenueReport,
  submitDaldalReport,
  submitAtkReport,
} from "../api/reportApi";
import {
  fetchMyPlan,
  fetchSummary,
  fetchSummaryByDateRange,
  fetchWeredaPlan,
  fetchWeredaQonnaPlan,
  fetchWeredaDaldalaPlan,
  fetchWeredaAtkPlan,
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
function BuildingIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
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
    label: "Hubannoo Uumuu",
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
    name: "gumaataJiraataa",
    label: "Gumaata Jiraataa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaa",
    label: "Buusii Daldalaa ",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaaFiGumaataa",
    label: "Buusii Fi Gumaataa  Daldalaa ",
    required: true,
    type: "number",
  },
  {
    name: "inisheetiviiBuusaaGonofaa",
    label: "inisheetivii Buusaa Gonofaa",
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
    required: true,
    type: "number",
  },
  { name: "zayitii", label: "Zayitii", required: true, type: "number" },
  {
    name: "sukkaara",
    label: "Sukkaara",
    required: true,
    type: "number",
    fullWidth: true,
  },
];
const REPORT_TYPES = [
  "Daily Report (Gabaasa Guyyaa)",
  "Weekly Report (Gabaasa Torban)",
  "Monthly Report (Gabaasa Ji'aa)",
];
const PLAN_FIELDS = [
  {
    key: "hubannoo_uummuu",
    planKey: "hubannoo_uummuu_target",
    label: "Hubannoo Uumuu",
    description: "Awareness targets",
    color: "#0f766e",
    bgColor: "bg-[#f0fdf9]",
    borderColor: "border-[#99f6e4]",
    textColor: "text-[#0f766e]",
  },
  {
    key: "horannaa_misensaa",
    planKey: "horannaa_misensaa_target",
    label: "Horannaa Misensaa",
    description: "Member enrollment targets",
    color: "#1e40af",
    bgColor: "bg-[#eff6ff]",
    borderColor: "border-[#bfdbfe]",
    textColor: "text-[#1e40af]",
  },
  {
    key: "buusi_jiraataa",
    planKey: "buusi_jiraataa_target",
    label: "Buusi Jiraataa",
    description: "Household beneficiary targets",
    color: "#475569",
    bgColor: "bg-[#f8fafc]",
    borderColor: "border-[#e2e8f0]",
    textColor: "text-[#475569]",
  },
  {
    key: "gumaata_jirataa",
    planKey: "gumaata_jirataa_target",
    label: "Gumaata Jiraataa",
    description: "Charity beneficiary targets",
    color: "#64748b",
    bgColor: "bg-[#f8fafc]",
    borderColor: "border-[#e2e8f0]",
    textColor: "text-[#64748b]",
  },
  {
    key: "buusi_daldalaa",
    planKey: "buusi_daldalaa_target",
    label: "Buusi Fi Gumaataa Daldalaa",
    description: "Business beneficiary targets",
    color: "#7c3aed",
    bgColor: "bg-[#f5f3ff]",
    borderColor: "border-[#ddd6fe]",
    textColor: "text-[#7c3aed]",
  },
  {
    key: "inisheetivii_buusaa_gonofaa",
    planKey: "inisheetivii_buusaa_gonofaa_target",
    label: "inisheetivii Buusaa Gonofaa",
    description: "Initiative targets",
    color: "#b45309",
    bgColor: "bg-[#fffbeb]",
    borderColor: "border-[#fde68a]",
    textColor: "text-[#b45309]",
  },
  {
    key: "gumaata_mootummaa",
    planKey: "gumaata_mootummaa_target",
    label: "Gumaata Midhaani",
    description: "Food charity targets",
    color: "#065f46",
    bgColor: "bg-[#f0fdf4]",
    borderColor: "border-[#bbf7d0]",
    textColor: "text-[#065f46]",
  },
  {
    key: "nyaata_barataa",
    planKey: "nyaata_barataa_target",
    label: "Nyaata Barataa",
    description: "Student food targets",
    color: "#0369a1",
    bgColor: "bg-[#f0f9ff]",
    borderColor: "border-[#bae6fd]",
    textColor: "text-[#0369a1]",
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
  { name: "leenjii", label: "Leenjii", required: true, type: "number" },
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

  {
    name: "qusannaa_haawaasaa",
    label: "Qusannaa Haawaasaa",
    required: true,
    type: "number",
  },

  {
    name: "qusanna_dirqii",
    label: "Qusanna Dirqii",
    required: true,
    type: "number",
  },
  {
    name: "kenna_liqii",
    label: "Kenna Liqii ",
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
    name: "industrii_godoo",
    label: "Industrii Godoo",
    required: true,
    type: "number",
  },
];
const QONNA_FIELDS = [
  {
    name: "furdisa",
    label: "Furdisa (Lakk. Horii)",
    required: true,
    type: "number",
  },
  {
    name: "furdisa_bakka_qophaawe",
    label: "Furdisa Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
  {
    name: "annan",
    label: "Annan (Lakk. Horii)",
    required: true,
    type: "number",
  },
  {
    name: "annan_bakka_qophaawe",
    label: "Annan Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
  {
    name: "lukkuu",
    label: "Lukkuu (Lakk. Lukkuu)",
    required: true,
    type: "number",
  },
  {
    name: "lukkuu_bakka_qophaawe",
    label: "Lukkuu  Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
  {
    name: "booyyee",
    label: "Booyyee (Lakk. Booyyee)",
    required: true,
    type: "number",
  },
  {
    name: "booyyee_bakka_qophaawe",
    label: "Booyyee  Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
  {
    name: "qurxummii",
    label: "Qurxummii (Lakk. Dhaabbii/Ponds)",
    required: true,
    type: "number",
  },
  {
    name: "qurxummii_bakka_qophaawe",
    label: "Qurxummii Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
  {
    name: "kanniissa",
    label: "Kanniissa (Lakk. Gaaguraa)",
    required: true,
    type: "number",
  },
  {
    name: "kanniissa_bakka_qophaawe",
    label: "Kanniissaa Bakka Qophaawe (ha)",
    required: false,
    type: "number",
  },
];

// Qonna category metadata — keeps colours and descriptions consistent across
// the annual-plan view and the analysis view.
const QONNA_CATS = [
  {
    key: "furdisa",
    planKey: "furdisa_target",
    label: "Furdisa",
    color: "#065f46",
  },
  {
    key: "annan",
    planKey: "annan_target",
    label: "Annan",
    color: "#0f766e",
  },
  {
    key: "lukkuu",
    planKey: "lukkuu_target",
    label: "Lukkuu",
    color: "#1e40af",
  },
  {
    key: "booyee",
    planKey: "booyee_target",
    label: "Booyyee",
    color: "#7c3aed",
  },
  {
    key: "kannisaa",
    planKey: "kannisaa_target",
    label: "Kannisaa",
    color: "#b45309",
  },
  {
    key: "qurxummii",
    planKey: "qurxummii_target",
    label: "Qurxummii",
    color: "#0369a1",
  },
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

// Revenue categories and their sources
const REVENUE_CATEGORIES = [
  {
    id: "manaQophessaa",
    label: "Mana Qophessaa",
    color: "#0f766e",
    bgColor: "bg-[#f0fdf9]",
    borderColor: "border-[#99f6e4]",
    textColor: "text-[#0f766e]",
    sources: [
      "Lizii",
      "Kiraa",
      "Baaxii fi Gooroo",
      "Kiraa Mana Daldalaa",
      "Kiraa Mana Jireenyaa",
      "Other",
    ],
  },
  {
    id: "idilee",
    label: "Idilee",
    color: "#1e40af",
    bgColor: "bg-[#eff6ff]",
    borderColor: "border-[#bfdbfe]",
    textColor: "text-[#1e40af]",
    sources: [
      "Idilee Madda Galii 1 (Placeholder)",
      "Idilee Madda Galii 2 (Placeholder)",
      "Idilee Madda Galii 3 (Placeholder)",
      "Idilee Madda Galii 4 (Placeholder)",
    ],
  },
];
const WORKS = [
  {
    id: "buusaa",
    label: "Buusaa Gonofaa",
    icon: BuusaaIcon,
    color: "bg-[#eef4fb] text-[#1a3a5c]",
  },
  {
    id: "carraaHojii",
    label: "Carraa Hojii Uumuu",
    icon: JobsIcon,
    color: "bg-[#eff6ff] text-[#1e40af]",
  },
  {
    id: "qonna",
    label: "Qonna",
    icon: AgricultureIcon,
    color: "bg-[#f0fdf9] text-[#0f766e]",
  },
  {
    id: "revenue",
    label: "Galii Sassaabu",
    sidebarLabel: "Galii Sassaabu",
    icon: RevenueIcon,
    color: "bg-[#f8fafc] text-[#475569]",
  },
  {
    id: "daldala",
    label: "Daldala",
    sidebarLabel: "Daldala",
    icon: RevenueIcon,
    color: "bg-[#fefce8] text-[#854d0e]",
  },
  {
    id: "atk",
    label: "ATK",
    sidebarLabel: "ATK",
    icon: BuildingIcon,
    color: "bg-[#fdf4ff] text-[#7e22ce]",
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
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col items-center shadow-sm">
      <p className="text-sm font-bold text-[#334155] mb-0.5 text-center">
        {label}
      </p>
      <p className="text-xs text-[#94a3b8] mb-3 text-center">{description}</p>
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
          <span className="text-xs text-[#94a3b8] mt-1">done</span>
        </div>
      </div>
      <div className="mt-4 w-full space-y-1">
        <div className="flex justify-between text-xs text-[#64748b]">
          <span>Actual</span>
          <span className="font-semibold text-[#1e293b]">
            {actual.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-[#64748b]">
          <span>Target (period)</span>
          <span className="font-semibold text-[#1e293b]">
            {target.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-2">
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
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchWeredaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {plan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <PlanIcon />
            <div>
              <p className="text-white font-bold text-base">
                Annual Plan  {year} <LockIcon />
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                Read only
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
                    <p className="text-3xl font-extrabold text-[#1e293b]">
                      {(plan[planKey] ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#64748b] mt-1">Annual target</p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-5 flex items-center gap-2 bg-[#eef4fb] border border-[#dce8f4] rounded-xl px-4 py-3">
              <svg
                className="w-5 h-5 text-[#1a3a5c] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-[#1a3a5c] text-sm">
                These targets were assigned by your sub-city office. Contact
                them if you believe the numbers are incorrect.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#f4f6f9] flex items-center justify-center mb-3 text-amber-400">
            <PlanIcon />
          </div>
          <p className="text-[#334155] font-semibold mb-1">
            No Plan Assigned Yet
          </p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Your sub-city office hasn't saved an annual plan for {year} yet.
            Once they do, your targets will appear here automatically.
          </p>
        </div>
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
          <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Comparing actual performance against partitioned plan targets
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setCustomSummary(null);
              setCustomRange(null);
            }}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer"
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
        <div className="mb-5 bg-[#f4f6f9] border border-[#dce8f4] rounded-xl px-4 py-3 flex items-center gap-3">
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
          <p className="text-[#1a3a5c] text-sm">
            No annual plan set. Please submit your Annual Plan first to see
            targets in the charts.
          </p>
        </div>
      )}

      {/* ── Custom Date Range picker ── */}
      {isCustom && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#334155] mb-4">
            Select Custom Date Range (Afaan Oromo Calendar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Ethiopian fiscal year */}
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Fiscal Year (starts Adoolessa)
              </label>
              <input
                type="number"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                min="2000"
                max="2100"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
            </div>
            {/* Start */}
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                End Date
              </label>
              <div className="flex gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
            <p className="text-[#dc2626] text-sm mb-3">{customError}</p>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={customLoading}
            className="flex items-center gap-2 bg-[#1e4976] hover:bg-[#122840] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <AnalysisIcon />
            {customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* ── Standard period loading ── */}
      {!isCustom && loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : !isCustom && error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : isCustom && customLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : isCustom && !customSummary ? null : (
        <>
          {/* Period label banner */}
          <div className="mb-5 bg-[#eef4fb] border border-[#dce8f4] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#1a3a5c] text-xs font-bold uppercase tracking-wide">
              {isCustom && customRange
                ? `${customRange.from} — ${customRange.to}`
                : `${periodLabel} View`}
            </span>
            {!isCustom && (
              <>
                <span className="text-[#1a3a5c] text-xs">—</span>
                <span className="text-[#1a3a5c] text-xs">
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
          <div className="mt-6 bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f4f6f9]">
              <p className="text-sm font-semibold text-[#334155]">
                {isCustom && customRange
                  ? `${customRange.from} — ${customRange.to} Summary`
                  : `${periodLabel} Summary Table`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    {[
                      "Category",
                      isCustom ? "Total Actual" : "Annual Target",
                      isCustom ? "—" : "Period Target",
                      "Actual",
                      "% Complete",
                      isCustom ? "—" : "Remaining (carry-over)",
                    ].map((h) => (
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
                  {PLAN_FIELDS.map(({ key, planKey, label, color }) => {
                    const at = plan ? (plan[planKey] ?? 0) : 0;
                    const pt = isCustom ? 0 : partitionTarget(at, period);
                    const ac = activeSummary ? (activeSummary[key] ?? 0) : 0;
                    const pct =
                      pt > 0 ? Math.min(Math.round((ac / pt) * 100), 100) : 0;
                    const remaining = pt > 0 ? Math.max(pt - ac, 0) : 0;
                    return (
                      <tr
                        key={key}
                        className="border-b border-gray-50 hover:bg-[#f4f6f9] transition-colors"
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
                        <td className="px-5 py-3 text-[#64748b]">
                          {isCustom ? "—" : at.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-[#64748b]">
                          {isCustom ? "—" : pt.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">
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
                        <td className="px-5 py-3">
                          {isCustom ? (
                            "—"
                          ) : remaining > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                              <svg
                                className="w-3 h-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              {remaining.toLocaleString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                              <svg
                                className="w-3 h-3 flex-shrink-0"
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
                              Done
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
          className="text-[#94a3b8] hover:text-[#334155] text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#1e293b]">
          {title} Submit Report
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-12 flex flex-col items-center justify-center text-center">
        <div
          className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4`}
        >
          <Icon />
        </div>
        <h2 className="text-lg font-semibold text-[#334155] mb-2">
          {title} Report Form
        </h2>
        <p className="text-[#94a3b8] text-sm max-w-sm mb-6">
          The submission form for <strong>{title}</strong> is under development.
          <br />
          It will be available here for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-[#eef4fb] text-[#1a3a5c] text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ─── Qonna Submit Report Form (Woreda) ───────────────────────────────────────
// Per category: houses/ponds/gaaguraa built, actual animals, land prepared (ha)
const QONNA_HOUSE_LABEL = {
  furdisa: {
    house: "Sheedii Ijaaraman",
    housePH: "Lakk. mana",
    animalLabel: "Lakk.Horii ",
    animalPH: "0",
  },
  annan: {
    house: "Sheedii Ijaaraman",
    housePH: "Lakk.Sheedii",
    animalLabel: "Lakk.Sa\u2019aa",
    animalPH: "0",
  },
  lukkuu: {
    house: "Sheedii Ijaaraman",
    housePH: "Lakk.Sheedii",
    animalLabel: "Lakk.Lukkuu",
    animalPH: "0",
  },
  booyee: {
    house: "Sheedii Ijaaraman",
    housePH: "Lakk.Sheedii",
    animalLabel: "Lakk.Booyyee",
    animalPH: "0",
  },
  kannisaa: {
    house: "Gaaguraa Ijaaraman",
    housePH: "Lakk. gaaguraa",
    animalLabel: "Lakk.Kannisaa ",
    animalPH: "0",
  },
  qurxummii: {
    house: "Pondii Ijaaraman",
    housePH: "Lakk.Pondii",
    animalLabel: "Lakk.Qurxummii ",
    animalPH: "0",
  },
};

function QonnaSubmitForm({ u }) {
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWeredaQonnaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setPlanLoading(false));
  }, []);

  const handleField = (name, val) => setForm((p) => ({ ...p, [name]: val }));

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
      QONNA_CATS.forEach(({ key }) => {
        payload[key] = Number(form[key] || 0);
        payload[`${key}_mana`] = Number(form[`${key}_mana`] || 0);
        payload[`${key}_bakka_qophaawe`] = Number(
          form[`${key}_bakka_qophaawe`] || 0,
        );
      });
      await submitQonnaReport(payload);
      setShowModal(true);
      handleClear();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSaving(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#1e293b]">
           Submit Report
        </h1>
      </div>

      {/* ── Annual Plan Card removed per requirement ── */}

      {/* ── Report Type + Date ── */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[#64748b] text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-1">
            Reporting  Period
          </p>
          <p className="text-2xl font-bold text-[#1e293b]">{todayStr()}</p>
        </div>
      </div>

      {/* ── Category fields ── */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-5">
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(90deg,#065f46 0%,#059669 100%)",
            }}
          >
           
          </div>
          <div className="px-5 py-5 space-y-5">
            {QONNA_CATS.map(({ key, label, description, color, planKey }) => {
              const annualTarget = plan ? (plan[planKey] ?? 0) : null;
              const cfg = QONNA_HOUSE_LABEL[key];
              return (
                <div
                  key={key}
                  className="rounded-xl border border-[#e2e8f0] overflow-hidden"
                >
                  {/* Category header */}
                  <div
                    className="px-4 py-2.5 flex items-center gap-2 flex-wrap"
                    style={{
                      backgroundColor: `${color}18`,
                      borderBottom: `1px solid ${color}33`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-sm font-bold" style={{ color }}>
                      {label}
                    </p>
                    <span className="text-xs text-[#94a3b8] ml-1">
                      {description}
                    </span>
                    {annualTarget !== null && (
                      <span
                        className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        Plan: {annualTarget.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {/* Three inputs: land prepared, houses/ponds/gaaguraa built, actual animals */}
                  <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">
                        Bakka Qophaawe (ha)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={form[`${key}_bakka_qophaawe`] ?? ""}
                        onChange={(e) =>
                          handleField(`${key}_bakka_qophaawe`, e.target.value)
                        }
                        placeholder="0"
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">
                        {cfg.house} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form[`${key}_mana`] ?? ""}
                        onChange={(e) =>
                          handleField(`${key}_mana`, e.target.value)
                        }
                        placeholder={cfg.housePH}
                        required
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">
                        {cfg.animalLabel}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form[key] ?? ""}
                        onChange={(e) => handleField(key, e.target.value)}
                        placeholder={cfg.animalPH}
                        required
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Yaada Gudinaa */}
            <div>
              <label className="block text-[#334155] text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Yaada Gudinaa galchi…"
                rows={3}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20 resize-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <p className="text-[#94a3b8] text-xs">
            Fields marked <span className="text-red-500">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="border border-[#e2e8f0] text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f4f6f9] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#065f46] hover:bg-[#064e3b] disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
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

// ─── Qonna Annual Plan Section (Woreda — read-only) ──────────────────────────
function QonnaAnnualPlanSection({ u }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchWeredaQonnaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#065f46] rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {plan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#065f46 0%,#047857 100%)",
            }}
          >
            <PlanIcon />
            <div>
              <p className="text-white font-bold text-base">
                Qonna Annual Plan  {year}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {u.name} · {u.woreda} · Read-only
              </p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QONNA_CATS.map(({ planKey, label, description, color }) => (
                <div
                  key={planKey}
                  className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-5 py-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs font-bold uppercase tracking-wide text-[#64748b]">
                      {label}
                    </p>
                  </div>
                  <p className="text-3xl font-extrabold text-[#1e293b]">
                    {(plan[planKey] ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
              <svg
                className="w-5 h-5 text-[#065f46] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-[#065f46] text-sm">
                These targets were assigned by your sub-city office. Contact
                them if you believe the numbers are incorrect.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
            <PlanIcon />
          </div>
          <p className="text-[#334155] font-semibold mb-1">
            No Qonna Plan Assigned Yet
          </p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Your sub-city office hasn't saved a Qonna annual plan for {year}{" "}
            yet. Once they do, your targets will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Qonna Work Analysis Section (Woreda) ────────────────────────────────────
// Shows plan targets (animals) + actual values: houses built, animals, land (ha)
function QonnaAnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState("Adoolessa");
  const [startDay, setStartDay] = useState(1);
  const [endMonth, setEndMonth] = useState("Adoolessa");
  const [endDay, setEndDay] = useState(30);
  const [customYear, setCustomYear] = useState(currentYear - 1);
  const [customSummary, setCustomSummary] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [customRange, setCustomRange] = useState(null);

  useEffect(() => {
    fetchWeredaQonnaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setPlanLoading(false));
  }, []);

  useEffect(() => {
    if (period === "custom") return;
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => setSummary(d.summary))
      .catch(() => setError("Failed to load Qonna summary data."))
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
      {/* ── Header + period selector ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
             Work Analysis
          </h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Planned targets vs actual performance ( animals, houses &amp; land)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setCustomSummary(null);
              setCustomRange(null);
            }}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!plan && !planLoading && (
        <div className="mb-5 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 flex items-center gap-3">
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
          <p className="text-[#92400e] text-sm">
            No Qonna plan assigned yet by sub-city. Targets will be 0 until the
            plan is set.
          </p>
        </div>
      )}

      {/* ── Custom date range picker ── */}
      {isCustom && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#334155] mb-4">
            Select Custom Date Range (Afaan Oromo Calendar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Fiscal Year
              </label>
              <input
                type="number"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                min="2000"
                max="2100"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
                >
                  {OROMO_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                End Date
              </label>
              <div className="flex gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
            <p className="text-[#dc2626] text-sm mb-3">{customError}</p>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={customLoading}
            className="flex items-center gap-2 bg-[#065f46] hover:bg-[#064e3b] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <AnalysisIcon />
            {customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* Loading / error states */}
      {!isCustom && loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#065f46] rounded-full animate-spin" />
        </div>
      ) : !isCustom && error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : isCustom && customLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#065f46] rounded-full animate-spin" />
        </div>
      ) : isCustom && !customSummary ? null : (
        <>
          {/* Period banner */}
          <div className="mb-5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#065f46] text-xs font-bold uppercase tracking-wide">
              {isCustom && customRange
                ? `${customRange.from} — ${customRange.to}`
                : `${periodLabel} View`}
            </span>
            {!isCustom && (
              <span className="text-[#065f46] text-xs">
                Targets partitioned from annual plan
              </span>
            )}
          </div>
          {/* Ring charts — animals achieved vs period target */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {QONNA_CATS.map((cat) => {
              const annualTarget = plan ? (plan[cat.planKey] ?? 0) : 0;
              const periodTarget = isCustom
                ? 0
                : partitionTarget(annualTarget, period);
              const actual = activeSummary ? (activeSummary[cat.key] ?? 0) : 0;
              const pct =
                periodTarget > 0
                  ? Math.min(Math.round((actual / periodTarget) * 100), 100)
                  : 0;
              const size = 110,
                sw = 11,
                r = (size - sw) / 2,
                circ = 2 * Math.PI * r;
              const offset = circ - (pct / 100) * circ;
              return (
                <div
                  key={cat.key}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-3 flex flex-col items-center shadow-sm"
                >
                  <p className="text-xs font-bold text-[#334155] mb-0.5 text-center">
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-[#94a3b8] mb-2 text-center">
                    {cat.description}
                  </p>
                  <div
                    className="relative"
                    style={{ width: size, height: size }}
                  >
                    <svg
                      width={size}
                      height={size}
                      style={{ transform: "rotate(-90deg)" }}
                    >
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
                        stroke={cat.color}
                        strokeWidth={sw}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.7s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="text-lg font-extrabold leading-none"
                        style={{ color: cat.color }}
                      >
                        {pct}%
                      </span>
                      <span className="text-[10px] text-[#94a3b8] mt-0.5">
                        done
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full space-y-0.5">
                    <div className="flex justify-between text-[10px] text-[#64748b]">
                      <span>Actual</span>
                      <span className="font-semibold text-[#1e293b]">
                        {actual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#64748b]">
                      <span>Target</span>
                      <span className="font-semibold text-[#1e293b]">
                        {periodTarget.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1 mt-1">
                      <div
                        className="h-1 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ring charts — Houses / Ponds / Gaaguraa Built and Land Prepared */}
          {(() => {
            // Sum houses built across all categories (_mana fields)
            const totalHouses = activeSummary
              ? QONNA_CATS.reduce((s, c) => s + (activeSummary[`${c.key}_mana`] ?? 0), 0)
              : 0;
            // Qurxummii ponds specifically
            const totalPonds = activeSummary ? (activeSummary["qurxummii_mana"] ?? 0) : 0;
            // Kannisaa gaaguraa specifically
            const totalGaaguraa = activeSummary ? (activeSummary["kannisaa_mana"] ?? 0) : 0;
            // Sum land prepared across all categories (_bakka_qophaawe fields)
            const totalLand = activeSummary
              ? QONNA_CATS.reduce((s, c) => s + (activeSummary[`${c.key}_bakka_qophaawe`] ?? 0), 0)
              : 0;

            const extraCharts = [
              { key: "houses_built",   label: "Houses Built",         description: "Mana Ijaaraman",       color: "#0f766e", value: totalHouses },
              { key: "ponds_built",    label: "Ponds Built",          description: "Dhaabbii Ijaaraman",   color: "#0369a1", value: totalPonds },
              { key: "gaaguraa_built", label: "Gaaguraa Built",       description: "Gaaguraa Ijaaraman",   color: "#b45309", value: totalGaaguraa },
              { key: "land_prepared",  label: "Land Prepared (ha)",   description: "Bakka Qophaawe",       color: "#065f46", value: totalLand },
            ];

            return (
              <div className="mb-6">
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide mb-3">
                  Infrastructure &amp; Land
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {extraCharts.map(({ key, label, description, color, value }) => {
                    const size = 110, sw = 11, r = (size - sw) / 2, circ = 2 * Math.PI * r;
                    // No plan target for these — show raw actuals with a filled ring when > 0
                    const pct = value > 0 ? 100 : 0;
                    const offset = circ - (pct / 100) * circ;
                    return (
                      <div
                        key={key}
                        className="bg-white rounded-xl border border-[#e2e8f0] p-3 flex flex-col items-center shadow-sm"
                      >
                        <p className="text-xs font-bold text-[#334155] mb-0.5 text-center">{label}</p>
                        <p className="text-[10px] text-[#94a3b8] mb-2 text-center">{description}</p>
                        <div className="relative" style={{ width: size, height: size }}>
                          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
                            <circle
                              cx={size/2} cy={size/2} r={r} fill="none"
                              stroke={color} strokeWidth={sw} strokeLinecap="round"
                              strokeDasharray={circ} strokeDashoffset={offset}
                              style={{ transition: "stroke-dashoffset 0.7s ease" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-extrabold leading-none" style={{ color }}>
                              {value.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#94a3b8] mt-0.5">actual</span>
                          </div>
                        </div>
                        <div className="mt-2 w-full">
                          <div className="flex justify-between text-[10px] text-[#64748b]">
                            <span>Total</span>
                            <span className="font-semibold text-[#1e293b]">{value.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Full plan vs actual — all dimensions */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm mb-6">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: "linear-gradient(90deg,#065f46 0%,#059669 100%)",
              }}
            >
              <p className="text-sm font-semibold text-white">
                Full Plan vs Actual (
                {isCustom && customRange
                  ? `${customRange.from}–${customRange.to}`
                  : periodLabel}
                )
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                Annual target · Period target · Actual animals ·
                Shed/Ponds/Hive built · Land prepared
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {[
                      "Category",
                      "Annual Target",
                      isCustom ? "—" : "Period Target",
                      "Actual Animals",
                      "Houses / Ponds / Gaaguraa Built",
                      "Land Prepared (ha)",
                      "% Complete",
                      isCustom ? "—" : "Remaining (carry-over)",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {QONNA_CATS.map((cat) => {
                    const annualTarget = plan ? (plan[cat.planKey] ?? 0) : 0;
                    const periodTarget = isCustom
                      ? 0
                      : partitionTarget(annualTarget, period);
                    const actual = activeSummary
                      ? (activeSummary[cat.key] ?? 0)
                      : 0;
                    const actualMana = activeSummary
                      ? (activeSummary[`${cat.key}_mana`] ?? 0)
                      : 0;
                    const actualLand = activeSummary
                      ? (activeSummary[`${cat.key}_bakka_qophaawe`] ?? 0)
                      : 0;
                    const pct =
                      periodTarget > 0
                        ? Math.min(
                            Math.round((actual / periodTarget) * 100),
                            999,
                          )
                        : 0;
                    const remaining =
                      periodTarget > 0 ? Math.max(periodTarget - actual, 0) : 0;
                    return (
                      <tr
                        key={cat.key}
                        className="border-b border-gray-50 hover:bg-[#f4f6f9] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-[#1e293b]">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#1e293b]">
                          {annualTarget.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[#64748b]">
                          {isCustom ? "—" : periodTarget.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1e293b]">
                          {actual.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[#64748b]">
                          {actualMana.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[#64748b]">
                          {actualLand > 0 ? `${actualLand} ha` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {isCustom ? (
                            "—"
                          ) : (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${cat.color}22`,
                                color: cat.color,
                              }}
                            >
                              {pct}%
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isCustom ? (
                            "—"
                          ) : remaining > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                              <svg
                                className="w-3 h-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              {remaining.toLocaleString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                              <svg
                                className="w-3 h-3 flex-shrink-0"
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
                              Done
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Period target breakdown */}
          {!isCustom && plan && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f4f6f9]">
                <p className="text-sm font-semibold text-[#334155]">
                  Period Target Breakdown
                </p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Annual plan divided — Daily · Weekly · Monthly · Annual
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      {[
                        "Category",
                        "Annual",
                        "Monthly (÷12)",
                        "Weekly (÷52)",
                        "Daily (÷365)",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {QONNA_CATS.map((cat) => {
                      const annual = plan ? (plan[cat.planKey] ?? 0) : 0;
                      return (
                        <tr
                          key={cat.key}
                          className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[#1e293b]">
                            <span className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-[#1e293b]">
                            {annual.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-[#64748b]">
                            {Math.round(annual / 12).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-[#64748b]">
                            {Math.round(annual / 52).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-[#64748b]">
                            {Math.round(annual / 365).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
// ─── CarraaHojii Annual Plan fields with display metadata ────────────────────
const CARRAA_PLAN_FIELDS = [
  {
    planKey: "leenjii_target",
    label: "Leenjii",
    color: "#1e40af",
    bg: "bg-[#eff6ff]",
    border: "border-[#bfdbfe]",
    text: "text-[#1e40af]",
  },
  {
    planKey: "carraa_hojii_dhaabbii_target",
    label: "Carraa Hojii Dhaabbii",
    color: "#0f766e",
    bg: "bg-[#f0fdfa]",
    border: "border-[#99f6e4]",
    text: "text-[#0f766e]",
  },
  {
    planKey: "carraa_hojii_qacarrii_target",
    label: "Carraa Hojii Qacarrii",
    color: "#7c3aed",
    bg: "bg-[#f5f3ff]",
    border: "border-[#ddd6fe]",
    text: "text-[#7c3aed]",
  },
  {
    planKey: "qusannaa_target",
    label: "Qusannaa Haawaasaa",
    color: "#475569",
    bg: "bg-[#f8fafc]",
    border: "border-[#e2e8f0]",
    text: "text-[#475569]",
  },
  {
    planKey: "qusanna_dirqii_target",
    label: "Qusanna Dirqii",
    color: "#475569",
    bg: "bg-[#f8fafc]",
    border: "border-[#e2e8f0]",
    text: "text-[#475569]",
  },
  {
    planKey: "liqii_target",
    label: "Kenna Liqii",
    color: "#b45309",
    bg: "bg-[#fffbeb]",
    border: "border-[#fde68a]",
    text: "text-[#b45309]",
  },
  {
    planKey: "deebii_liqii_bilchaate_target",
    label: "Deebii Liqii Bilchaate",
    color: "#065f46",
    bg: "bg-[#f0fdf4]",
    border: "border-[#bbf7d0]",
    text: "text-[#065f46]",
  },
  {
    planKey: "deebii_liqii_bulee_target",
    label: "Deebii Liqii Bulee",
    color: "#dc2626",
    bg: "bg-[#fef2f2]",
    border: "border-[#fecaca]",
    text: "text-[#dc2626]",
  },
  {
    planKey: "industrii_godoo_target",
    label: "Industrii Godoo",
    color: "#0369a1",
    bg: "bg-[#f0f9ff]",
    border: "border-[#bae6fd]",
    text: "text-[#0369a1]",
  },
];

// CarraaHojii summary keys that correspond to the plan keys
const CARRAA_SUMMARY_KEYS = [
  {
    summaryKey: "leenjii",
    key: "leenjii_target",
    label: "Leenjii",
    color: "#1e40af",
  },
  {
    summaryKey: "carraa_hojii_dhaabbii",
    key: "carraa_hojii_dhaabbii_target",
    label: "Carraa Hojii Dhaabbii",
    color: "#0f766e",
  },
  {
    summaryKey: "carraa_hojii_qacarrii",
    key: "carraa_hojii_qacarrii_target",
    label: "Carraa Hojii Qacarrii",
    color: "#7c3aed",
  },
  {
    summaryKey: "qusannnaa",
    key: "qusannaa_target",
    label: "Qusannaa Haawaasaa",
    color: "#475569",
  },
  {
    summaryKey: "qusanna_dirqii",
    key: "qusanna_dirqii_target",
    label: "Qusanna Dirqii",
    color: "#475569",
  },
  {
    summaryKey: "liqii",
    key: "liqii_target",
    label: "Kenna Liqii",
    color: "#b45309",
  },
  {
    summaryKey: "deebii_liqii_bilchaate",
    key: "deebii_liqii_bilchaate_target",
    label: "Deebii Liqii Bilchaate",
    color: "#065f46",
  },
  {
    summaryKey: "deebii_liqii_bulee",
    key: "deebii_liqii_bulee_target",
    label: "Deebii Liqii Bulee",
    color: "#dc2626",
  },
  {
    summaryKey: "industrii_godoo",
    key: "industrii_godoo_target",
    label: "Industrii Godoo",
    color: "#0369a1",
  },
];

// ─── CarraaHojii Annual Plan Section (read-only, same style as AnnualPlanSection) ──
function CarraaHojiiAnnualPlanSection({ u }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    // Reuses the existing fetchWeredaPlan endpoint — the backend returns the
    // woreda's row which already contains all category targets.
    fetchWeredaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1e40af] rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {plan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1e40af 0%,#2563eb 100%)",
            }}
          >
            <PlanIcon />
            <div>
              <p className="text-white font-bold text-base">
                Carraa Hojii Uummuu Annual Plan  {year}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                 Read-only
              </p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CARRAA_PLAN_FIELDS.map(
                ({ planKey, label, bg, border, text, color }) => (
                  <div
                    key={planKey}
                    className={`rounded-xl border ${border} ${bg} px-5 py-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <p
                        className={`text-xs font-bold uppercase tracking-wide ${text}`}
                      >
                        {label}
                      </p>
                    </div>
                    <p className="text-3xl font-extrabold text-[#1e293b]">
                      {(plan[planKey] ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1">Annual target</p>
                  </div>
                ),
              )}
            </div>
            <div className="mt-5 flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3">
              <svg
                className="w-5 h-5 text-[#1e40af] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p className="text-[#1e40af] text-sm">
                These targets were assigned by your sub-city office. Contact
                them if the numbers need correction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mb-3">
            <PlanIcon />
          </div>
          <p className="text-[#334155] font-semibold mb-1">
            No Plan Assigned Yet
          </p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Your sub-city office hasn't saved a Carraa Hojii plan for {year}{" "}
            yet. Once they do, your targets will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── CarraaHojii Work Analysis Section ───────────────────────────────────────
// Mirrors AnalysisSection (Buusaa) exactly — same period selector, same Oromo
// date picker, same ring charts + summary table pattern.
function CarraaHojiiAnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState("Adoolessa");
  const [startDay, setStartDay] = useState(1);
  const [endMonth, setEndMonth] = useState("Adoolessa");
  const [endDay, setEndDay] = useState(30);
  const [customYear, setCustomYear] = useState(currentYear - 1);
  const [customSummary, setCustomSummary] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [customRange, setCustomRange] = useState(null);

  useEffect(() => {
    fetchWeredaPlan()
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
            Work Analysis
          </h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Actual performance vs assigned annual plan targets
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setCustomSummary(null);
              setCustomRange(null);
            }}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!plan && (
        <div className="mb-5 bg-[#f4f6f9] border border-[#dce8f4] rounded-xl px-4 py-3 flex items-center gap-3">
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
          <p className="text-[#1a3a5c] text-sm">
            No annual plan assigned yet. Targets will appear once the sub-city
            saves the plan.
          </p>
        </div>
      )}

      {/* Custom date picker */}
      {isCustom && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#334155] mb-4">
            Select Custom Date Range (Afaan Oromo Calendar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Fiscal Year
              </label>
              <input
                type="number"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                min="2000"
                max="2100"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
                >
                  {OROMO_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                End Date
              </label>
              <div className="flex gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none"
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
            <p className="text-[#dc2626] text-sm mb-3">{customError}</p>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={customLoading}
            className="flex items-center gap-2 bg-[#1e40af] hover:bg-[#1e3a8a] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <AnalysisIcon />
            {customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {!isCustom && loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1e40af] rounded-full animate-spin" />
        </div>
      ) : !isCustom && error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : isCustom && customLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1e40af] rounded-full animate-spin" />
        </div>
      ) : isCustom && !customSummary ? null : (
        <>
          <div className="mb-5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#1e40af] text-xs font-bold uppercase tracking-wide">
              {isCustom && customRange
                ? `${customRange.from} — ${customRange.to}`
                : `${periodLabel} View`}
            </span>
            {!isCustom && (
              <>
                <span className="text-[#1e40af] text-xs">—</span>
                <span className="text-[#1e40af] text-xs">
                  Targets partitioned from annual plan
                </span>
              </>
            )}
          </div>

          {/* Ring charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {CARRAA_SUMMARY_KEYS.map(({ summaryKey, key, label, color }) => {
              const annualTarget = plan ? (plan[key] ?? 0) : 0;
              const periodTarget = isCustom
                ? 0
                : partitionTarget(annualTarget, period);
              const actual = activeSummary
                ? (activeSummary[summaryKey] ?? 0)
                : 0;
              const pct =
                periodTarget > 0
                  ? Math.min(Math.round((actual / periodTarget) * 100), 100)
                  : 0;
              const size = 130,
                sw = 13,
                r = (size - sw) / 2,
                circ = 2 * Math.PI * r;
              const offset = circ - (pct / 100) * circ;
              return (
                <div
                  key={key}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex flex-col items-center shadow-sm"
                >
                  <p className="text-xs font-bold text-[#334155] mb-2 text-center">
                    {label}
                  </p>
                  <div
                    className="relative"
                    style={{ width: size, height: size }}
                  >
                    <svg
                      width={size}
                      height={size}
                      style={{ transform: "rotate(-90deg)" }}
                    >
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="text-xl font-extrabold leading-none"
                        style={{ color }}
                      >
                        {pct}%
                      </span>
                      <span className="text-xs text-[#94a3b8] mt-0.5">
                        done
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 w-full space-y-1">
                    <div className="flex justify-between text-xs text-[#64748b]">
                      <span>Actual</span>
                      <span className="font-semibold text-[#1e293b]">
                        {actual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#64748b]">
                      <span>Target</span>
                      <span className="font-semibold text-[#1e293b]">
                        {periodTarget.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mt-1">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f4f6f9]">
              <p className="text-sm font-semibold text-[#334155]">
                {isCustom && customRange
                  ? `${customRange.from} — ${customRange.to} Summary`
                  : `${periodLabel} Summary Table`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    {[
                      "Category",
                      isCustom ? "Total Actual" : "Annual Target",
                      isCustom ? "—" : "Period Target",
                      "Actual",
                      "% Complete",
                      isCustom ? "—" : "Remaining (carry-over)",
                    ].map((h) => (
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
                  {CARRAA_SUMMARY_KEYS.map(
                    ({ summaryKey, key, label, color }) => {
                      const annualTarget = plan ? (plan[key] ?? 0) : 0;
                      const periodTarget = isCustom
                        ? 0
                        : partitionTarget(annualTarget, period);
                      const actual = activeSummary
                        ? (activeSummary[summaryKey] ?? 0)
                        : 0;
                      const pct =
                        periodTarget > 0
                          ? Math.min(
                              Math.round((actual / periodTarget) * 100),
                              999,
                            )
                          : 0;
                      const remaining =
                        periodTarget > 0
                          ? Math.max(periodTarget - actual, 0)
                          : 0;
                      return (
                        <tr
                          key={key}
                          className="border-b border-gray-50 hover:bg-[#f4f6f9] transition-colors"
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
                          <td className="px-5 py-3 text-[#64748b]">
                            {isCustom ? "—" : annualTarget.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-[#64748b]">
                            {isCustom ? "—" : periodTarget.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 font-semibold text-[#1e293b]">
                            {actual.toLocaleString()}
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
                          <td className="px-5 py-3">
                            {isCustom ? (
                              "—"
                            ) : remaining > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                {remaining.toLocaleString()}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
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
                                Done
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Placeholder pages (non-implemented sectors) ─────────────────────────────
function PlaceholderAnnualPlan({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
        {title}  Annual Plan
      </h1>
      <p className="text-[#64748b] text-sm mb-6">
        {u.woreda} &middot; {u.subcity}
      </p>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#eef4fb] text-[#64748b] flex items-center justify-center mb-4">
          <PlanIcon />
        </div>
        <h2 className="text-lg font-semibold text-[#334155] mb-2">
          Annual Plan
        </h2>
        <p className="text-[#94a3b8] text-sm max-w-sm mb-6">
          The annual plan for <strong>{title}</strong> will be managed here 
          targets and progress tracking for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-[#eef4fb] text-[#1a3a5c] text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ─── Daldala sector ──────────────────────────────────────────────────────────
const DALDALA_FIELDS = [
  { name: "galmee_haraa",           label: "Galmee Haraa",           required: true,  type: "number" },
  { name: "heyyema_haraa",          label: "Heyyema Haraa",          required: true,  type: "number" },
  { name: "harahessaa",             label: "Harahessaa",             required: true,  type: "number" },
  { name: "galii_daldalarra_galuu", label: "Galii Daldalarra Galuu", required: true,  type: "number" },
  { name: "toannoo_walii_gala",     label: "To'annoo Walii Gala",    required: true,  type: "number" },
  { name: "tmd",                    label: " Leenjii TMD",                    required: true,  type: "number" },
  { name: "intarshippii",           label: "Intarshippii",           required: false, type: "number" },
  { name: "ggg",                    label: "Giddu Gala Gabaa",                    required: false, type: "number" },
  { name: "gabayaa_sanbata",        label: "Gabaa Sanbata",        required: false, type: "number" },
  { name: "whg_kudraa",             label: "Walitti hidhinsaa Gabaa - Kudraa",           required: false, type: "number" },
  { name: "whg_mudraa",             label: "Walitti hidhinsaa Gabaa - Mudraa",           required: false, type: "number" },
];

const DALDALA_CATS = DALDALA_FIELDS.map((f, i) => ({
  key: f.name,
  planKey: `${f.name}_target`,
  label: f.label,
  color: ["#0f766e","#1e40af","#7c3aed","#b45309","#065f46","#0369a1","#dc2626","#475569","#854d0e","#166534","#1a3a5c"][i % 11],
}));

// ─── ATK sector ───────────────────────────────────────────────────────────────
const ATK_FIELDS = [
  { name: "waliigaltee_pilaanii_kennuu",    label: "Waliigaltee Pilaanii Kennuu",    required: true,  type: "number" },
  { name: "heeyyama_ijaarsaa_kennamee",     label: "Heeyyama Ijaarsaa Kennamee",     required: true,  type: "number" },
  { name: "toannoo_fi_hordoffii_gamoo",     label: "To'annoo Fi Hordoffii Gamoo",    required: true,  type: "number" },
  { name: "galii_atk_galchuu",             label: "Galii ATK Galchuu",              required: true,  type: "number" },
];

const ATK_CATS = ATK_FIELDS.map((f, i) => ({
  key: f.name,
  planKey: `${f.name}_target`,
  label: f.label,
  color: ["#7e22ce","#0369a1","#065f46","#b45309"][i % 4],
}));

// ─── Shared GenericAnnualPlanSection ─────────────────────────────────────────
// Reusable read-only plan display for Daldala and ATK.
function GenericAnnualPlanSection({ u, cats, fetchPlanFn, title, accentColor, accentLight, accentBorder }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();
  useEffect(() => {
    fetchPlanFn()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, [fetchPlanFn]);
  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-4 border-[#dce8f4] rounded-full animate-spin" style={{ borderTopColor: accentColor }} />
    </div>
  );
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-[#1e293b]">{title} — Annual Plan</h1>
        <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ background: accentLight, color: accentColor, borderColor: accentBorder }}>{year}</span>
      </div>
      <p className="text-[#64748b] text-sm mb-6">{u.woreda} · Targets assigned by the sub-city office. Read-only.</p>
      {plan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <div className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
            style={{ background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)` }}>
            <PlanIcon />
            <div>
              <p className="text-white font-bold text-base">{title} Annual Plan — {year}</p>
              <p className="text-white/60 text-xs mt-0.5">{u.name} · {u.woreda} · Read-only</p>
            </div>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cats.map(({ planKey, label, color }) => (
              <div key={planKey} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <p className="text-xs font-bold uppercase tracking-wide text-[#64748b]">{label}</p>
                </div>
                <p className="text-3xl font-extrabold text-[#1e293b]">{(plan[planKey] ?? 0).toLocaleString()}</p>
                <p className="text-xs text-[#94a3b8] mt-1">Annual target</p>
              </div>
            ))}
          </div>
          <div className="mx-6 mb-5 flex items-center gap-2 rounded-xl px-4 py-3 border"
            style={{ background: accentLight, borderColor: accentBorder }}>
            <svg className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-sm" style={{ color: accentColor }}>Targets assigned by sub-city. Contact them if numbers need correction.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
          <PlanIcon />
          <p className="text-[#334155] font-semibold mb-1 mt-3">No {title} Plan Assigned Yet</p>
          <p className="text-[#94a3b8] text-sm max-w-xs">Sub-city hasn't saved a {title} annual plan for {year} yet.</p>
        </div>
      )}
    </div>
  );
}

// ─── Shared GenericAnalysisSection ───────────────────────────────────────────
function GenericAnalysisSection({ cats, fetchPlanFn, title, accentColor, accentLight, accentBorder }) {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState("Adoolessa");
  const [startDay, setStartDay] = useState(1);
  const [endMonth, setEndMonth] = useState("Adoolessa");
  const [endDay, setEndDay] = useState(30);
  const [customYear, setCustomYear] = useState(currentYear - 1);
  const [customSummary, setCustomSummary] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [customRange, setCustomRange] = useState(null);

  useEffect(() => { fetchPlanFn().then((d) => setPlan(d.plan)).catch(() => setPlan(null)); }, [fetchPlanFn]);
  useEffect(() => {
    if (period === "custom") return;
    setLoading(true); setError("");
    fetchSummary(period).then((d) => setSummary(d.summary)).catch(() => setError("Failed to load summary.")).finally(() => setLoading(false));
  }, [period]);

  const handleGenerateReport = async () => {
    const dateFrom = oromoToGregorian(startMonth, startDay, customYear);
    const dateTo   = oromoToGregorian(endMonth, endDay, customYear);
    if (!dateFrom || !dateTo) { setCustomError("Invalid date selection."); return; }
    if (dateFrom > dateTo) { setCustomError("Start date must be before end date."); return; }
    setCustomLoading(true); setCustomError(""); setCustomSummary(null);
    try {
      const d = await fetchSummaryByDateRange(dateFrom, dateTo);
      setCustomSummary(d.summary);
      setCustomRange({ from: `${startMonth} ${startDay}`, to: `${endMonth} ${endDay}` });
    } catch { setCustomError("Failed to load custom range data."); }
    finally { setCustomLoading(false); }
  };

  const isCustom = period === "custom";
  const activeSummary = isCustom ? customSummary : summary;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">{title} — Work Analysis</h1>
          <p className="text-[#64748b] text-sm mt-0.5">Actual performance vs assigned annual plan targets</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select value={period} onChange={(e) => { setPeriod(e.target.value); setCustomSummary(null); setCustomRange(null); }}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer">
            {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {!plan && (
        <div className="mb-5 border rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: accentLight, borderColor: accentBorder }}>
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm" style={{ color: accentColor }}>No annual plan assigned yet. Targets will appear once sub-city saves the plan.</p>
        </div>
      )}

      {isCustom && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#334155] mb-4">Select Custom Date Range (Afaan Oromo Calendar)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Fiscal Year</label>
              <input type="number" value={customYear} onChange={(e) => setCustomYear(Number(e.target.value))} min="2000" max="2100"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Start Date</label>
              <div className="flex gap-2">
                <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none">
                  {OROMO_MONTHS.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
                <select value={startDay} onChange={(e) => setStartDay(Number(e.target.value))} className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none">
                  {OROMO_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">End Date</label>
              <div className="flex gap-2">
                <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none">
                  {OROMO_MONTHS.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
                <select value={endDay} onChange={(e) => setEndDay(Number(e.target.value))} className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none">
                  {OROMO_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          {customError && <p className="text-[#dc2626] text-sm mb-3">{customError}</p>}
          <button onClick={handleGenerateReport} disabled={customLoading}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ backgroundColor: accentColor }}>
            <AnalysisIcon />{customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {!isCustom && loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-[#dce8f4] rounded-full animate-spin" style={{ borderTopColor: accentColor }} /></div>
      ) : !isCustom && error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">{error}</div>
      ) : isCustom && customLoading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-[#dce8f4] rounded-full animate-spin" style={{ borderTopColor: accentColor }} /></div>
      ) : isCustom && !customSummary ? null : (
        <>
          <div className="mb-5 rounded-xl px-4 py-2.5 flex items-center gap-2 border" style={{ background: accentLight, borderColor: accentBorder }}>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
              {isCustom && customRange ? `${customRange.from} — ${customRange.to}` : `${periodLabel} View`}
            </span>
            {!isCustom && <span className="text-xs" style={{ color: accentColor }}>— Targets partitioned from annual plan</span>}
          </div>

          {/* Ring charts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {cats.map((cat) => {
              const annualTarget = plan ? plan[cat.planKey] ?? 0 : 0;
              const periodTarget = isCustom ? 0 : partitionTarget(annualTarget, period);
              const actual = activeSummary ? activeSummary[cat.key] ?? 0 : 0;
              const pct = periodTarget > 0 ? Math.min(Math.round((actual / periodTarget) * 100), 100) : 0;
              const size = 110, sw = 11, r = (size - sw) / 2, circ = 2 * Math.PI * r;
              const offset = circ - (pct / 100) * circ;
              return (
                <div key={cat.key} className="bg-white rounded-xl border border-[#e2e8f0] p-3 flex flex-col items-center shadow-sm">
                  <p className="text-xs font-bold text-[#334155] mb-2 text-center">{cat.label}</p>
                  <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
                      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={cat.color} strokeWidth={sw}
                        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.7s ease" }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-extrabold leading-none" style={{ color: cat.color }}>{pct}%</span>
                      <span className="text-[10px] text-[#94a3b8] mt-0.5">done</span>
                    </div>
                  </div>
                  <div className="mt-2 w-full space-y-0.5">
                    <div className="flex justify-between text-[10px] text-[#64748b]"><span>Actual</span><span className="font-semibold text-[#1e293b]">{actual.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[10px] text-[#64748b]"><span>Target</span><span className="font-semibold text-[#1e293b]">{periodTarget.toLocaleString()}</span></div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1 mt-1">
                      <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary table with Remaining */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-[#e2e8f0]" style={{ background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)` }}>
              <p className="text-sm font-semibold text-white">
                {isCustom && customRange ? `${customRange.from} — ${customRange.to} Summary` : `${periodLabel} Summary Table`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {["Category", "Annual Target", isCustom ? "—" : "Period Target", "Actual", "Achievement", isCustom ? "—" : "Remaining (carry-over)"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cats.map((cat) => {
                    const annualTarget = plan ? plan[cat.planKey] ?? 0 : 0;
                    const periodTarget = isCustom ? 0 : partitionTarget(annualTarget, period);
                    const actual = activeSummary ? activeSummary[cat.key] ?? 0 : 0;
                    const pct = periodTarget > 0 ? Math.min(Math.round((actual / periodTarget) * 100), 999) : 0;
                    const remaining = periodTarget > 0 ? Math.max(periodTarget - actual, 0) : 0;
                    return (
                      <tr key={cat.key} className="border-b border-gray-50 hover:bg-[#f4f6f9] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#1e293b]">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-[#1e293b]">{annualTarget.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#64748b]">{isCustom ? "—" : periodTarget.toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-[#1e293b]">{actual.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {isCustom ? "—" : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>{pct}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isCustom ? "—" : remaining > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              {remaining.toLocaleString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              Done
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Period breakdown */}
          {!isCustom && plan && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm mt-6">
              <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f4f6f9]">
                <p className="text-sm font-semibold text-[#334155]">Period Target Breakdown</p>
                <p className="text-xs text-[#64748b] mt-0.5">Annual plan divided — Daily · Weekly · Monthly · Annual</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      {["Category", "Annual", "Monthly (÷12)", "Weekly (÷52)", "Daily (÷365)"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cats.map((cat) => {
                      const annual = plan ? plan[cat.planKey] ?? 0 : 0;
                      return (
                        <tr key={cat.key} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                          <td className="px-4 py-3 font-medium text-[#1e293b]">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                              {cat.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-[#1e293b]">{annual.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[#64748b]">{Math.round(annual / 12).toLocaleString()}</td>
                          <td className="px-4 py-3 text-[#64748b]">{Math.round(annual / 52).toLocaleString()}</td>
                          <td className="px-4 py-3 text-[#64748b]">{Math.round(annual / 365).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlaceholderAnalysis({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
        {title}  Work Analysis
      </h1>
      <p className="text-[#64748b] text-sm mb-6">
        {u.woreda} &middot; {u.subcity}
      </p>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <AnalysisIcon />
        </div>
        <h2 className="text-lg font-semibold text-[#334155] mb-2">
          Work Analysis
        </h2>
        <p className="text-[#94a3b8] text-sm max-w-sm mb-6">
          Performance analytics for <strong>{title}</strong> will be shown here
           charts, trends, and targets for <strong>{u.woreda}</strong>.
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
      <div className="bg-white rounded-xl shadow-2xl px-10 py-10 flex flex-col items-center gap-4 min-w-[320px] animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#f0faf4] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#166534]"
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
        <h2 className="text-xl font-bold text-[#1e293b]">Report Submitted</h2>
        <p className="text-[#64748b] text-sm text-center">
          Your report has been submitted successfully.
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
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
        gumaata_jirataa: Number(form.gumaataJirataa || 0),
        inisheetivii_buusaa_gonofaa: Number(
          form.inisheetiviiBuusaaGonofaa || 0,
        ),
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
          <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Complete all required fields and submit before the deadline
          </p>
        </div>
        
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[#64748b] text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="text-right flex-shrink-0">
      
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-1">
            Reporting Period
          </p>
          <p className="text-2xl font-bold text-[#1e293b]">{todayStr()}</p>
          
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-5">
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
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
                <label className="block text-[#334155] text-sm font-medium mb-1.5">
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-[#334155] text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Enter Yaada Gudinaa"
                rows={4}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent placeholder-gray-400 transition-all resize-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <p className="text-[#94a3b8] text-xs">
            Fields marked <span className="text-red-500">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f4f6f9] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
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
  headerColor = "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
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
          <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            {title} complete all required fields
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[#64748b] text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-1">
            Reporting Period
          </p>
          <p className="text-2xl font-bold text-[#1e293b]">{todayStr()}</p>
         
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden mb-5">
          <div className="px-5 py-4" style={{ background: headerColor }}>
            <p className="text-white font-bold text-base">{title}</p>
            <p className="text-white/60 text-xs mt-0.5">
              {u.name} &middot; {u.subcity} &middot; {u.woreda}
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {fields.map(({ name, label, required, type }) => (
              <div key={name}>
                <label className="block text-[#334155] text-sm font-medium mb-1.5">
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-[#334155] text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Enter Yaada Gudinaa"
                rows={4}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-transparent placeholder-gray-400 transition-all resize-none"
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <p className="text-[#94a3b8] text-xs">
            Fields marked <span className="text-red-500">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="border border-gray-300 text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f4f6f9] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
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

// ─── Revenue Submit Form ──────────────────────────────────────────────────────
function RevenueSubmitForm({ u }) {
  // ── Submit state ──
  const [category, setCategory] = useState(REVENUE_CATEGORIES[0].id);
  const [source, setSource] = useState(REVENUE_CATEGORIES[0].sources[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [entries, setEntries] = useState([]);
  const [entryError, setEntryError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const catObj = REVENUE_CATEGORIES.find((c) => c.id === category);

  const handleCategoryChange = (val) => {
    setCategory(val);
    const cat = REVENUE_CATEGORIES.find((c) => c.id === val);
    setSource(cat.sources[0]);
    setEntryError("");
  };

  const handleAddEntry = () => {
    if (!amount || Number(amount) <= 0) {
      setEntryError("Enter a valid amount greater than zero.");
      return;
    }
    if (!date) {
      setEntryError("Select a date.");
      return;
    }
    setEntryError("");
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        category: catObj.label,
        categoryId: category,
        source,
        amount: Number(amount),
        date,
      },
    ]);
    setAmount("");
    setDate(todayStr());
  };

  const handleRemoveEntry = (id) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmitReport = async () => {
    if (entries.length === 0) {
      setEntryError("Add at least one entry before submitting.");
      return;
    }
    setSubmitting(true);
    setEntryError("");
    try {
      await submitRevenueReport({ entries, total, report_date: todayStr() });
      setEntries([]);
      setShowModal(true);
    } catch (err) {
      setEntryError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Galii Complete all required fields
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Steps 1+2 side by side — combo boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1 — Gosa Galii (Category) */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
              }}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <p className="text-sm font-semibold text-white">Gosa Galii</p>
            </div>
            <div className="px-5 py-4">
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                Gosa Galii filadhu
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] cursor-pointer"
              >
                {REVENUE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">
                Filatame:{" "}
                <span className="font-semibold text-[#1a3a5c]">
                  {catObj.label}
                </span>
              </p>
            </div>
          </div>

          {/* Step 2 — Madda Galii (Source) */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
              }}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <p className="text-sm font-semibold text-white">
                Madda Galii{" "}
                <span className="font-normal text-white/70 ml-1">
                  ({catObj.label})
                </span>
              </p>
            </div>
            <div className="px-5 py-4">
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                Madda Galii filadhu
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] cursor-pointer"
              >
                {catObj.sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">
                Filatame:{" "}
                <span className="font-semibold text-[#1a3a5c]">{source}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 — Entry */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              3
            </span>
            <p className="text-sm font-semibold text-white">Galii Galchi</p>
            {entries.length > 0 && (
              <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {entries.length} galame
              </span>
            )}
          </div>
          <div className="px-5 py-4">
            {/* Context reminder badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] text-xs font-semibold px-3 py-1 rounded-full">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: catObj.color }}
                />
                {catObj.label}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] text-xs font-semibold px-3 py-1 rounded-full">
                {source}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                  Baasii Galii (ETB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddEntry()}
                  placeholder="0.00"
                  className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
                  Guyyaa <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddEntry}
                  className="w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:opacity-90"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Entry
                </button>
              </div>
            </div>

            {entryError && (
              <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2 mb-3">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[#dc2626] text-xs font-medium">
                  {entryError}
                </p>
              </div>
            )}

            {/* Always-visible entries table */}
            <div className="rounded-xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#f4f6f9] border-b border-[#f1f5f9] flex items-center justify-between">
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Galmeewwan Galame
                </p>
                {entries.length > 0 && (
                  <span className="text-xs font-bold text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] px-2.5 py-0.5 rounded-full">
                    Walii Galii: ETB {total.toLocaleString()}
                  </span>
                )}
              </div>
              {entries.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[#94a3b8] text-sm">
                    No entries yet. Fill in the fields above and click "Add
                    Entry".
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-[#f4f6f9] border-b border-[#f1f5f9]">
                    <tr>
                      {[
                        "Gosa Galii",
                        "Madda Galii",
                        "Baasii (ETB)",
                        "Guyyaa",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-gray-50 hover:bg-[#eef4fb]/50 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  REVENUE_CATEGORIES.find(
                                    (c) => c.id === e.categoryId,
                                  )?.color ?? "#6b7280",
                              }}
                            />
                            <span className="text-[#334155] font-medium">
                              {e.category}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#64748b]">
                          {e.source}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-[#1e293b]">
                          {e.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-[#64748b] text-xs">
                          {e.date}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleRemoveEntry(e.id)}
                            className="text-red-400 hover:text-[#dc2626] hover:bg-[#fef2f2] text-xs font-medium px-2 py-0.5 rounded transition-all"
                          >
                            Haqi
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#f4f6f9] border-t border-[#e2e8f0]">
                      <td
                        colSpan={2}
                        className="px-4 py-3 font-bold text-[#1a3a5c] text-sm"
                      >
                        Walii Galii
                      </td>
                      <td className="px-4 py-3 font-extrabold text-[#1a3a5c] text-base">
                        ETB {total.toLocaleString()}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Submit footer */}
        {entries.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 shadow-sm">
            <div>
              <p className="text-[#1e293b] text-sm font-semibold">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
                ready to submit
              </p>
              <p className="text-[#64748b] text-xs mt-0.5">
                Total:{" "}
                <strong className="text-[#1e293b]">
                  ETB {total.toLocaleString()}
                </strong>
              </p>
            </div>
            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <SubmitIcon />
              {submitting ? "Submitting..." : "Submit Daily Revenue Report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revenue Analytics ────────────────────────────────────────────────────────
const REVENUE_CHART_FIELDS = [
  {
    key: "mana_qophessaa",
    label: "Mana Qophessaa",
    description: "Mana Qophessaa category total",
    color: "#0f766e",
  },
  {
    key: "idilee",
    label: "Idilee",
    description: "Idilee category total",
    color: "#1e40af",
  },
  {
    key: "total",
    label: "Total Revenue",
    description: "Combined all categories",
    color: "#1a3a5c",
  },
];

// Simple bar chart — better than ring charts for revenue (no target, just totals)
function RevenueBarChart({ fields, summary }) {
  const max = Math.max(
    ...fields.map((f) => (summary ? (summary[f.key] ?? 0) : 0)),
    1,
  );
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-[#f4f6f9] border-b border-[#f1f5f9]">
        <p className="text-sm font-semibold text-[#334155]">
          Revenue by Category
        </p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {fields.map(({ key, label, color }) => {
          const val = summary ? (summary[key] ?? 0) : 0;
          const pct = max > 0 ? Math.round((val / max) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-medium text-[#334155]">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </span>
                <span className="text-sm font-bold text-[#1e293b]">
                  ETB {val.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RevenueAnalysis() {
  const [period, setPeriod] = useState("monthly");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Annual summary — fixed "till today" view, fetched once on mount
  const [annualSummary, setAnnualSummary] = useState(null);
  const [annualLoading, setAnnualLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const [startMonth, setStartMonth] = useState("Adoolessa");
  const [startDay, setStartDay] = useState(1);
  const [endMonth, setEndMonth] = useState("Adoolessa");
  const [endDay, setEndDay] = useState(30);
  const [customYear, setCustomYear] = useState(currentYear - 1);
  const [customSummary, setCustomSummary] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState("");
  const [customRange, setCustomRange] = useState(null);

  // Fetch annual once on mount — always shows current year running totals
  useEffect(() => {
    setAnnualLoading(true);
    fetchSummary("annual")
      .then((d) => setAnnualSummary(d.summary))
      .catch(() => setAnnualSummary(null))
      .finally(() => setAnnualLoading(false));
  }, []);

  useEffect(() => {
    if (period === "custom") return;
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => setSummary(d.summary))
      .catch(() => setError("Failed to load revenue data."))
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]"> Work Analysis</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Revenue totals by category and time period
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setCustomSummary(null);
              setCustomRange(null);
            }}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom date picker */}
      {isCustom && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-6 py-5 mb-6">
          <p className="text-sm font-semibold text-[#334155] mb-4">
            Select Custom Date Range
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Fiscal Year (starts Adoolessa)
              </label>
              <input
                type="number"
                value={customYear}
                onChange={(e) => setCustomYear(Number(e.target.value))}
                min="2000"
                max="2100"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                >
                  {OROMO_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">
                End Date
              </label>
              <div className="flex gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
                  className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
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
            <p className="text-[#dc2626] text-sm mb-3">{customError}</p>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={customLoading}
            className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <AnalysisIcon />
            {customLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* Loading / error */}
      {(!isCustom && loading) || (isCustom && customLoading) ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : !isCustom && error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : isCustom && !customSummary ? null : (
        <>
          {/* ── Section 1: Annual / Till Today ── */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#334155] uppercase tracking-wide">
                Current Year Till Today
              </h2>
              <span className="text-xs text-[#94a3b8]">
                Annual running totals
              </span>
            </div>
            {annualLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="w-6 h-6 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {REVENUE_CHART_FIELDS.map(({ key, label, color }) => (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                        {label}
                      </p>
                    </div>
                    <p className="text-2xl font-extrabold text-[#1e293b]">
                      ETB{" "}
                      {(annualSummary
                        ? (annualSummary[key] ?? 0)
                        : 0
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section 2: Filtered Period Breakdown ── */}
          <div className="bg-[#eef4fb] border border-[#dce8f4] rounded-xl px-4 py-2.5 flex items-center gap-2 mb-5">
            <span className="text-[#1a3a5c] text-xs font-bold uppercase tracking-wide">
              {isCustom && customRange
                ? `${customRange.from} — ${customRange.to}`
                : `${periodLabel} View`}
            </span>
          </div>

          {/* Bar chart — filtered */}
          <RevenueBarChart
            fields={REVENUE_CHART_FIELDS}
            summary={activeSummary}
          />

          {/* By-source breakdown table — filtered */}
          {activeSummary?.by_source &&
            Object.keys(activeSummary.by_source).length > 0 && (
              <div className="mt-5 bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f4f6f9]">
                  <p className="text-sm font-semibold text-[#334155]">
                    {isCustom && customRange
                      ? `${customRange.from} — ${customRange.to}`
                      : `${periodLabel}`}{" "}
                    — By Revenue Source
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      {["Revenue Source", "Total (ETB)"].map((h) => (
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
                    {Object.entries(activeSummary.by_source)
                      .sort(([, a], [, b]) => b - a)
                      .map(([src, val]) => (
                        <tr
                          key={src}
                          className="border-b border-gray-50 hover:bg-[#f4f6f9] transition-colors"
                        >
                          <td className="px-5 py-3 font-medium text-[#1e293b]">
                            {src}
                          </td>
                          <td className="px-5 py-3 font-semibold text-[#1e293b]">
                            {val.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
        </>
      )}
    </div>
  );
}

function WorksOverview({ u, onSelect }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {WORKS.map(({ id, label, sidebarLabel, icon: Icon, color }) => (
          <div
            key={id}
            className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-7 flex flex-col items-center text-center"
          >
            <div
              className={`w-14 h-14 rounded-full ${color} flex items-center justify-center mb-4`}
            >
              <Icon />
            </div>
            <h2 className="font-semibold text-[#1e293b] text-base mb-1">
              {sidebarLabel ?? label}
            </h2>
            <p className="text-[#94a3b8] text-xs mb-5">
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
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon /> Submit Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Maps logged-in username to the aanaa (woreda) name shown in the UI
const USERNAME_TO_WOREDA_NAME = {
  "Aanaa Gooroo": "Aanaa Gooroo",
  "Aanaa Dhadacha Araaraa": "Aanaa Dhadacha Araaraa",
  "Aanaa Dhakaa Adii": "Aanaa Dhakaa Adii",
  "Aanaa Andoodee": "Aanaa Andoodee",
};

export default function WoRedaDashboard() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const waredaName =
    (loggedUser && USERNAME_TO_WOREDA_NAME[loggedUser.username]) ||
    loggedUser?.username ||
    "Aanaa";
  const u = loggedUser
    ? {
        name: loggedUser.username,
        role: loggedUser.role,
        woreda: waredaName,
        subcity: "Adama Bole",
        initials: loggedUser.username.substring(0, 2).toUpperCase(),
      }
    : {
        name: "Guest",
        role: "wereda",
        woreda: "Aanaa",
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
      if (sub === "analysis") return "Work Analysis";
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
    const handleClick = () => {
      if (id === "announcements") {
        setActiveNav("announcements");
        setActiveWork(null);
        // Scroll to announcements section after state update
        setTimeout(() => {
          const el = document.getElementById("announcements-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else {
        setActiveNav(id);
        setActiveWork(null);
      }
    };
    return (
      <button
        key={id}
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-white/15 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon />
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <div
      className="flex h-screen max-h-screen bg-[#f4f6f9] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ════ SIDEBAR ════ */}
      <aside
        className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{
          background: "linear-gradient(180deg,#1a3a5c 0%,#0d1f35 100%)",
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
                activeNav === "works"
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
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
                {WORKS.map(({ id, label, sidebarLabel, icon: Icon }) => {
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
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          anySubActive
                            ? "bg-white/15 text-white"
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon />
                        <span className="flex-1 truncate text-left">
                          {sidebarLabel ?? label}
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
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isPlanActive
                                ? "bg-white/15 text-white"
                                : "text-white/50 hover:bg-white/10 hover:text-white"
                            }`}
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
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isAnalysisActive
                                ? "bg-white/15 text-white"
                                : "text-white/50 hover:bg-white/10 hover:text-white"
                            }`}
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
        <header className="bg-white border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[#1e293b] font-semibold text-base">
            {topLabel()}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveNav("announcements")}
              className="relative text-[#64748b] hover:text-[#1e293b]"
            >
              <BellIcon />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#dc2626] rounded-full" />
            </button>
            
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {activeNav === "dashboard" && (
            <div>
              <p className="text-[#1e293b] text-lg font-bold mb-6">
                Welcome back! {u.name}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Submitted",
                    value: "—",
                    color: "bg-[#eef4fb] border-[#dce8f4] text-[#1a3a5c]",
                  },
                  {
                    label: "Pending Review",
                    value: "—",
                    color: "bg-[#f4f6f9] border-[#dce8f4] text-[#1a3a5c]",
                  },
                  {
                    label: "Approved",
                    value: "—",
                    color: "bg-green-50 border-[#bbf7d0] text-[#166534]",
                  },
                  {
                    label: "Rejected",
                    value: "—",
                    color: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl border p-5 ${color}`}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm mt-1 font-medium">{label}</p>
                  </div>
                ))}
              </div>
              <h2 className="text-base font-semibold text-[#334155] mb-3">
                Quick Submit
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {WORKS.map(({ id, label, sidebarLabel, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveNav("works");
                      setActiveWork(id);
                      setExpandedWork(id);
                      setWorksOpen(true);
                    }}
                    className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-5 flex flex-col items-center hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-3`}
                    >
                      <Icon />
                    </div>
                    <p className="text-xs font-semibold text-[#334155]">
                      {sidebarLabel ?? label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeNav === "history" && (
            <div>
              <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#f4f6f9] border-b border-[#e2e8f0]">
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
                          className="text-left px-5 py-3 text-[#64748b] font-semibold text-xs uppercase tracking-wide"
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
                        className="px-5 py-10 text-center text-[#94a3b8] text-sm"
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
                if (wid === "qonna") return <QonnaAnnualPlanSection u={u} />;
                if (wid === "carraaHojii")
                  return <CarraaHojiiAnnualPlanSection u={u} />;
                if (wid === "daldala")
                  return (
                    <GenericAnnualPlanSection
                      u={u}
                      cats={DALDALA_CATS}
                      fetchPlanFn={fetchWeredaDaldalaPlan}
                      title="Daldala"
                      accentColor="#854d0e"
                      accentLight="#fefce8"
                      accentBorder="#fde68a"
                    />
                  );
                if (wid === "atk")
                  return (
                    <GenericAnnualPlanSection
                      u={u}
                      cats={ATK_CATS}
                      fetchPlanFn={fetchWeredaAtkPlan}
                      title="ATK"
                      accentColor="#7e22ce"
                      accentLight="#fdf4ff"
                      accentBorder="#e9d5ff"
                    />
                  );
                return <PlaceholderAnnualPlan title={work?.label} u={u} />;
              }
              if (sub === "analysis") {
                if (wid === "buusaa") return <AnalysisSection />;
                if (wid === "revenue") return <RevenueAnalysis />;
                if (wid === "qonna") return <QonnaAnalysisSection />;
                if (wid === "carraaHojii")
                  return <CarraaHojiiAnalysisSection />;
                if (wid === "daldala")
                  return (
                    <GenericAnalysisSection
                      cats={DALDALA_CATS}
                      fetchPlanFn={fetchWeredaDaldalaPlan}
                      title="Daldala"
                      accentColor="#854d0e"
                      accentLight="#fefce8"
                      accentBorder="#fde68a"
                    />
                  );
                if (wid === "atk")
                  return (
                    <GenericAnalysisSection
                      cats={ATK_CATS}
                      fetchPlanFn={fetchWeredaAtkPlan}
                      title="ATK"
                      accentColor="#7e22ce"
                      accentLight="#fdf4ff"
                      accentBorder="#e9d5ff"
                    />
                  );
                return <PlaceholderAnalysis title={work?.label} u={u} />;
              }
              if (wid === "buusaa") return <BuusaaSubmitForm u={u} />;
              if (wid === "carraaHojii")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={CARRAA_HOJII_FIELDS}
                    submitFn={submitCarraaHojiiReport}
                    title="Carraa Hojii Uumuu"
                    headerColor="linear-gradient(90deg,#1e40af 0%,#2563eb 100%)"
                  />
                );
              if (wid === "qonna") return <QonnaSubmitForm u={u} />;
              if (wid === "revenue") return <RevenueSubmitForm u={u} />;
              if (wid === "daldala")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={DALDALA_FIELDS}
                    submitFn={submitDaldalReport}
                    title="Daldala"
                    headerColor="linear-gradient(90deg,#854d0e 0%,#a16207 100%)"
                  />
                );
              if (wid === "atk")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={ATK_FIELDS}
                    submitFn={submitAtkReport}
                    title="ATK"
                    headerColor="linear-gradient(90deg,#7e22ce 0%,#9333ea 100%)"
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
            <div id="announcements-section">
              <h1 className="text-2xl font-bold text-[#1e293b] mb-5">
                Announcements
              </h1>
              <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-10 text-center">
                <p className="text-[#94a3b8] text-sm">No announcements yet.</p>
              </div>
            </div>
          )}

          {activeNav === "profile" && (
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b] mb-5">
                Profile & Settings
              </h1>
              <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-6 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-lg font-bold">
                    {u.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#1e293b] text-lg">{u.name}</p>
                    <p className="text-[#64748b] text-sm">
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
                      <p className="text-xs text-[#64748b] font-semibold uppercase tracking-wide mb-1">
                        {label}
                      </p>
                      <p className="text-[#1e293b] text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f4f6f9]">
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

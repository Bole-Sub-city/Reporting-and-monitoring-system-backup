import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import {
  submitBuusaaReport,
  submitCarraaHojiiReport,
  submitQonnaReport,
  submitRevenueReport,
  submitDaldalReport,
  submitAtkReport,
  fetchMyReports,
  fetchLockStatus,
  requestEditAccess,
  fetchMyEditRequests,
} from "../api/reportApi";
import {
  fetchMyPlan,
  fetchSummary,
  fetchWeredaPlan,
  fetchWeredaQonnaPlan,
  fetchWeredaDaldalaPlan,
  fetchWeredaAtkPlan,
  fetchWeredaRevenuePlan,
  fetchWeredaCarraaHojiiPlan,
  fetchAnnouncements,
  fetchUnreadCount,
  markAnnouncementsRead,
  fetchWoRedaAnalysis,
  submitWoredaPhoto,
  fetchMyPhotos,
  deleteWoredaPhoto,
} from "../api/planApi";
import adamaLogo from "../assets/adamalogo.png";
import RingChart from "../components/ui/RingChart";

// ─── Network-aware error message helper ─────────────────────────────────────
function friendlyError(
  err,
  fallback = "Something went wrong. Please try again.",
) {
  if (!err) return fallback;
  if (!err.response) return "No connection. Check your internet and try again.";
  const msg = err.response?.data?.message;
  return msg || fallback;
}

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
function EyeIconWD({ show }) {
  return show ? (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CameraIconWD() {
  return (
    <svg
      className="w-3.5 h-3.5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function CheckIconWD() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
    label: "Buusii Daldalaa",
    required: true,
    type: "number",
  },
  {
    name: "buuusiDaldalaaFiGumaataa",
    label: "Buusii Fi Gumaataa Daldalaa",
    required: true,
    type: "number",
  },
  {
    name: "inisheetiviiBuusaaGonofaa",
    label: "Inisheetivii Buusaa Gonofaa",
    required: true,
    type: "number",
  },
  {
    name: "gumaataMootummaa",
    label: "Gumaata Midhaani (Kuntal)",
    required: true,
    type: "number",
  },
  {
    name: "gumaataMidhaaniTarsiimoo",
    label: "Gumaata Midhaani Tarsiimoo",
    required: true,
    type: "number",
  },
  {
    name: "gumaataMidhaaniSardamaa",
    label: "Gumaata Midhaani Sardamaa",
    required: true,
    type: "number",
  },
  {
    name: "nyaataBarataa",
    label: "Nyaata Barataa",
    required: true,
    type: "number",
  },
  { name: "zayitii", label: "Zayitii (Litre)", required: true, type: "number" },
  {
    name: "sukkaara",
    label: "Sukkaara (KG)",
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

// Maps logged-in username to the woreda ID used by the subcity analysis API
const USERNAME_TO_WOREDA_ID_FE = {
  "Aanaa Gooroo": "w1",
  "Aanaa Dhadacha Araaraa": "w2",
  "Aanaa Dhakaa Adii": "w3",
  "Aanaa Andoodee": "w4",
};

// Helper: returns the woredaId for the currently logged-in user
function getMyWoredaId() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    return USERNAME_TO_WOREDA_ID_FE[u?.username] ?? null;
  } catch {
    return null;
  }
}
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
    key: "gumaata_jiraataa",
    planKey: "gumaata_jiraataa_target",
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
    label: "Gumaata Midhaani (Kuntal)",
    description: "Food charity targets",
    color: "#78350f",
    bgColor: "bg-[#fffbeb]",
    borderColor: "border-[#fde68a]",
    textColor: "text-[#78350f]",
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
  {
    key: "sukkaara",
    planKey: "sukkaara_target",
    label: "Sukkaara (KG)",
    description: "Sugar targets (KG)",
    color: "#ea580c",
    bgColor: "bg-[#fff7ed]",
    borderColor: "border-[#fed7aa]",
    textColor: "text-[#ea580c]",
  },
  {
    key: "zayitii",
    planKey: "zayitii_target",
    label: "Zayitii (Litre)",
    description: "Oil targets (Litre)",
    color: "#65a30d",
    bgColor: "bg-[#f7fee7]",
    borderColor: "border-[#d9f99d]",
    textColor: "text-[#65a30d]",
  },
  {
    key: "gumaata_midhaani_tarsiimoo",
    planKey: "gumaata_midhaani_tarsiimoo_target",
    label: "Gumaata Midhaani Tarsiimoo",
    description: "Planned food (Tarsiimoo)",
    color: "#0f766e",
    bgColor: "bg-[#f0fdf9]",
    borderColor: "border-[#99f6e4]",
    textColor: "text-[#0f766e]",
  },
  {
    key: "gumaata_midhaani_sardamaa",
    planKey: "gumaata_midhaani_sardamaa_target",
    label: "Gumaata Midhaani Sardamaa",
    description: "Planned food (Sardamaa)",
    color: "#7c3aed",
    bgColor: "bg-[#f5f3ff]",
    borderColor: "border-[#ddd6fe]",
    textColor: "text-[#7c3aed]",
  },
  {
    key: "daldala_b_group_a",
    planKey: "daldala_b_group_a_target",
    label: "Daldala B – Group A (4,200)",
    description: "Stored value = count × 4,200",
    color: "#0369a1",
    bgColor: "bg-[#f0f9ff]",
    borderColor: "border-[#bae6fd]",
    textColor: "text-[#0369a1]",
  },
  {
    key: "daldala_b_group_b",
    planKey: "daldala_b_group_b_target",
    label: "Daldala B – Group B (8,700)",
    description: "Stored value = count × 8,700",
    color: "#b45309",
    bgColor: "bg-[#fffbeb]",
    borderColor: "border-[#fde68a]",
    textColor: "text-[#b45309]",
  },
];
const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

// Afaan Oromo months with their approximate Gregorian date ranges
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

// Qonna category metadata
const QONNA_CATS = [
  {
    key: "furdisa",
    manaKey: "furdisa_sheedii_ijaaraman",
    lakkKey: "furdisa_lakk_horii",
    planKey: "furdisa_target",
    label: "Furdisa",
    color: "#78350f",
  },
  {
    key: "annan",
    manaKey: "annan_sheedii_ijaaraman",
    lakkKey: "annan_lakk_saaa",
    planKey: "annan_target",
    label: "Annan",
    color: "#0f766e",
  },
  {
    key: "lukkuu",
    manaKey: "lukkuu_sheedii_ijaaraman",
    lakkKey: "lukkuu_lakk_lukkuu",
    planKey: "lukkuu_target",
    label: "Lukkuu",
    color: "#1e40af",
  },
  {
    key: "boyyee",
    manaKey: "boyyee_sheedii_ijaaraman",
    lakkKey: "boyyee_lakk_booyyee",
    planKey: "boyyee_target",
    label: "Booyyee",
    color: "#7c3aed",
  },
  {
    key: "kannisaa",
    manaKey: "kannisaa_gaaguraa_ijaaraman",
    lakkKey: "kannisaa_lakk_kannisaa",
    planKey: "kannisaa_target",
    label: "Kannisaa",
    color: "#b45309",
  },
  {
    key: "qurxummii",
    manaKey: "qurxummii_pondii_ijaaraman",
    lakkKey: "qurxummii_lakk_qurxummii",
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

// Revenue categories
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
    color: "bg-[#eff6ff] text-[#0f172a]",
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
// Returns today's date in YYYY-MM-DD using LOCAL timezone (not UTC).
// Using toISOString() would return UTC which can be a day behind in UTC+3.
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function partitionTarget(annual, period) {
  const n = Number(annual || 0);
  if (n === 0) return 0;
  const d = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, annual: 1 };
  return Math.round(n / (d[period] || 1));
}

/**
 * Compute an adjusted period target that accounts for carry-over deficit.
 *
 * Rules:
 *  - If actual YTD >= cumulative target so far → you're on track or ahead.
 *    Return the static partition (don't reduce future targets for extra work).
 *  - If actual YTD < cumulative target so far → there's a deficit (carry-over).
 *    Spread the remaining annual gap across the remaining periods.
 *    adjusted = (annual - acYtd) / periodsRemaining
 *
 * @param {number} annual      - annual plan target
 * @param {string} period      - "daily"|"weekly"|"monthly"|"quarterly"|"annual"
 * @param {number} daysElapsed - days elapsed in the fiscal year (from API)
 * @param {number} acYtd       - actual YTD total submitted so far
 */
function adjustedTarget(annual, period, daysElapsed, acYtd) {
  const n = Number(annual || 0);
  if (n === 0) return 0;

  const TOTAL = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    annual: 1,
  };
  const total = TOTAL[period] || 1;
  const staticTarget = Math.round(n / total);

  // How many periods have elapsed so far?
  const elapsed =
    {
      daily: daysElapsed,
      weekly: Math.ceil(daysElapsed / 7),
      monthly: Math.ceil(daysElapsed / 30.4),
      quarterly: Math.ceil(daysElapsed / 91.25),
      annual: 1,
    }[period] ?? 1;

  const periodsRemaining = Math.max(total - elapsed, 1);

  // Cumulative target up to today using the static daily rate
  const cumulTarget = Math.round((daysElapsed / 365) * n);
  const ytd = Number(acYtd || 0);

  // On track or ahead → use static target (extra work only improves overall %)
  if (ytd >= cumulTarget) return staticTarget;

  // Behind → spread remaining gap across remaining periods
  const remaining = n - ytd;
  return Math.max(Math.round(remaining / periodsRemaining), 0);
}

function _RingChartPlaceholder() {}

function AnnualPlanSection({ u }) {
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchWeredaPlan()
      .then((d) => setPlan(d.plan || {}))
      .catch(() => setPlan({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <div
          className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
          }}
        >
          <PlanIcon />
          <div>
            <p className="text-white font-bold text-base">
              Annual Plan {year} <LockIcon />
            </p>
            <p className="text-white/60 text-xs mt-0.5">Read-only</p>
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
          <div className="mt-5 flex items-center gap-2 bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-3">
            <svg
              className="w-5 h-5 text-[#0f172a] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[#0f172a] text-sm">
              These targets were assigned by your sub-city office. Contact them
              if you believe the numbers are incorrect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Convert an Oromo month name + day + year to a Gregorian ISO date string
function oromoToGregorian(monthName, day, year) {
  const month = OROMO_MONTHS.find((m) => m.name === monthName);
  if (!month) return null;
  const [mm, dd] = month.gregStart.split("-").map(Number);
  const gregYear = mm <= 6 ? year + 1 : year;
  const base = new Date(gregYear, mm - 1, dd);
  base.setDate(base.getDate() + (day - 1));
  return base.toISOString().split("T")[0];
}

function AnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryYtd, setSummaryYtd] = useState(null);
  const [daysElapsed, setDaysElapsed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeredaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => {
        setSummary(d.summary);
        setSummaryYtd(d.summaryYtd ?? d.summary);
        setDaysElapsed(d.daysElapsed ?? 1);
      })
      .catch((err) =>
        setError(friendlyError(err, "Failed to load summary data.")),
      )
      .finally(() => setLoading(false));
  }, [period]);

  const activeSummary = summary;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
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
        <div className="mb-5 bg-[#f8fafc] border border-[#dbeafe] rounded-xl px-4 py-3 flex items-center gap-3">
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
          <p className="text-[#0f172a] text-sm">
            No annual plan set. Please submit your Annual Plan first to see
            targets in the charts.
          </p>
        </div>
      )}

      {/* ── Loading / error ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* Period label banner */}
          <div className="mb-5 bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wide">
              {periodLabel} View
            </span>
            <>
              <span className="text-[#0f172a] text-xs">—</span>
              <span className="text-[#0f172a] text-xs">
                Targets are auto-partitioned from the annual plan
              </span>
            </>
          </div>

          {/* Ring charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLAN_FIELDS.map(({ key, planKey, label, description, color }) => {
              const at = plan ? (plan[planKey] ?? 0) : 0;
              const acYtd = summaryYtd ? (summaryYtd[key] ?? 0) : 0;
              // Use adjusted target so carry-over deficit raises the bar,
              // but overperformance never lowers it
              const pt = adjustedTarget(at, period, daysElapsed, acYtd);
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
            <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
              <p className="text-sm font-semibold text-[#334155]">
                {periodLabel} Summary Table
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    {[
                      "Category",
                      "Annual Target",
                      "Static Target",
                      "Adjusted Target",
                      "Actual",
                      "% Complete",
                      "Remaining (carry-over)",
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
                    const staticPt = partitionTarget(at, period);
                    const acYtd = summaryYtd ? (summaryYtd[key] ?? 0) : 0;
                    const adjPt = adjustedTarget(
                      at,
                      period,
                      daysElapsed,
                      acYtd,
                    );
                    const ac = activeSummary ? (activeSummary[key] ?? 0) : 0;
                    // % is against the adjusted target so carry-over is reflected
                    const pct = adjPt > 0 ? Math.round((ac / adjPt) * 100) : 0;
                    const cumulTarget = Math.round((daysElapsed / 365) * at);
                    const remaining = Math.max(cumulTarget - acYtd, 0);
                    return (
                      <tr
                        key={key}
                        className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
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
                          {at.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-[#64748b]">
                          {staticPt.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">
                          {adjPt.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1e293b]">
                          {ac.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ backgroundColor: `${color}22`, color }}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {remaining > 0 ? (
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
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#d97706]">
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
        <span className="inline-block bg-[#eff6ff] text-[#0f172a] text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ─── Qonna Submit Report Form (Woreda) ───────────────────────────────────────
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
  boyyee: {
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

function QonnaSubmitForm({ u, locked, onSubmitSuccess }) {
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

  // Pre-fill form with today's existing report when lock is cleared (unlocked by admin)
  const prevLocked = useRef(locked);
  useEffect(() => {
    const wasLocked = prevLocked.current;
    prevLocked.current = locked;
    if (wasLocked && !locked) {
      const today = todayStr();
      fetchMyReports({ sector: "qonna", date_from: today, date_to: today })
        .then((data) => {
          const rows = Array.isArray(data) ? data : [];
          const row = rows.find(
            (r) => r.report_date === today && r._sector === "qonna",
          );
          if (!row) return;
          setReportType(row.report_type || REPORT_TYPES[0]);
          setYaada(row.yaada_gudinaa || "");
          // Qonna field names (lakkKey, manaKey, bakka_qophaawe) match DB column names directly
          const prefilled = {};
          QONNA_CATS.forEach(({ key, manaKey, lakkKey }) => {
            if (row[lakkKey] !== undefined)
              prefilled[lakkKey] = String(row[lakkKey]);
            if (row[manaKey] !== undefined)
              prefilled[manaKey] = String(row[manaKey]);
            if (row[`${key}_bakka_qophaawe`] !== undefined)
              prefilled[`${key}_bakka_qophaawe`] = String(
                row[`${key}_bakka_qophaawe`],
              );
          });
          setForm(prefilled);
        })
        .catch(() => {});
    }
  }, [locked]);

  const handleField = (name, val) => setForm((p) => ({ ...p, [name]: val }));

  const handleClear = () => {
    setForm({});
    setYaada("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    setError("");
    setSaving(true);
    try {
      const payload = {
        report_type: reportType,
        report_date: todayStr(),
        yaada_gudinaa: yaada,
      };
      QONNA_CATS.forEach(({ key, manaKey, lakkKey }) => {
        payload[lakkKey] = Number(form[lakkKey] || 0);
        payload[manaKey] = Number(form[manaKey] || 0);
        payload[`${key}_bakka_qophaawe`] = Number(
          form[`${key}_bakka_qophaawe`] || 0,
        );
      });
      await submitQonnaReport(payload);
      setShowModal(true);
      handleClear();
      onSubmitSuccess && onSubmitSuccess();
    } catch (err) {
      setError(friendlyError(err, "Failed to submit report."));
    } finally {
      setSaving(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
      {locked && (
        <div className="mb-5">
          <LockBanner
            sector="qonna"
            reportType={reportType}
            onUnlocked={onSubmitSuccess}
          />
        </div>
      )}

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-[#64748b] text-sm font-medium mb-1.5">
            Report Type
          </p>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#78350f]/20"
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
              background: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
            }}
          ></div>
          <div className="px-5 py-5 space-y-5">
            {QONNA_CATS.map(
              ({
                key,
                manaKey,
                lakkKey,
                label,
                description,
                color,
                planKey,
              }) => {
                const annualTarget = plan ? (plan[planKey] ?? 0) : null;
                const cfg = QONNA_HOUSE_LABEL[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-[#e2e8f0] overflow-hidden"
                  >
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
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#78350f]/20"
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
                          value={form[manaKey] ?? ""}
                          onChange={(e) => handleField(manaKey, e.target.value)}
                          placeholder={cfg.housePH}
                          required
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#78350f]/20"
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
                          value={form[lakkKey] ?? ""}
                          onChange={(e) => handleField(lakkKey, e.target.value)}
                          placeholder={cfg.animalPH}
                          required
                          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#78350f]/20"
                        />
                      </div>
                    </div>
                  </div>
                );
              },
            )}
            <div>
              <label className="block text-[#334155] text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Yaada Gudinaa galchi…"
                rows={3}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#78350f]/20 resize-none"
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
              className="border border-[#e2e8f0] text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={saving || locked}
              className="flex items-center gap-2 bg-[#78350f] hover:bg-[#064e3b] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
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
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetchWeredaQonnaPlan()
      .then((d) => setPlan(d.plan || {}))
      .catch(() => setPlan({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#78350f] rounded-full animate-spin" />
      </div>
    );

  const QONNA_PLAN_CATS = [
    {
      key: "furdisa",
      label: "Furdisa",
      color: "#78350f",
      fields: [
        { planKey: "furdisa_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "furdisa_lakk_sheedii_target", label: "Lakk Sheedii" },
        {
          planKey: "furdisa_lakk_horii_waliigalaa_target",
          label: "Lakk Horii Waliigalaa",
        },
      ],
    },
    {
      key: "annan",
      label: "Annan",
      color: "#0f766e",
      fields: [
        { planKey: "annan_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "annan_lakk_sheedii_target", label: "Lakk Sheedii" },
        {
          planKey: "annan_lakk_saa_waliigalaa_target",
          label: "Lakk Sa'a Waliigalaa",
        },
      ],
    },
    {
      key: "lukkuu",
      label: "Lukkuu",
      color: "#1e40af",
      fields: [
        { planKey: "lukkuu_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "lukkuu_lakk_sheedii_target", label: "Lakk Sheedii" },
        {
          planKey: "lukkuu_lakk_lukkuu_waliigalaa_target",
          label: "Lakk Lukkuu Waliigalaa",
        },
      ],
    },
    {
      key: "booyee",
      label: "Booyyee",
      color: "#7c3aed",
      fields: [
        { planKey: "booyee_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "booyee_lakk_sheedii_target", label: "Lakk Sheedii" },
        {
          planKey: "booyee_lakk_booyyee_waliigalaa_target",
          label: "Lakk Booyyee Waliigalaa",
        },
      ],
    },
    {
      key: "kannisaa",
      label: "Kannisaa",
      color: "#b45309",
      fields: [
        { planKey: "kannisaa_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "kannisaa_lakk_gaaguraa_target", label: "Lakk Gaaguraa" },
        {
          planKey: "kannisaa_lakk_kannisaa_waliigalaa_target",
          label: "Lakk Kannisaa Waliigalaa",
        },
      ],
    },
    {
      key: "qurxummii",
      label: "Qurxummii",
      color: "#0369a1",
      fields: [
        { planKey: "qurxummii_qophi_lafa_target", label: "Qophi Lafa (ha)" },
        { planKey: "qurxummii_lakk_pondii_target", label: "Lakk Pondii" },
        {
          planKey: "qurxummii_lakk_qurxummii_waliigalaa_target",
          label: "Lakk Qurxummii Waliigalaa",
        },
      ],
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <div
          className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
          }}
        >
          <PlanIcon />
          <div>
            <p className="text-white font-bold text-base">Annual Plan {year}</p>
            <p className="text-white/60 text-xs mt-0.5">Read-only</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {QONNA_PLAN_CATS.map(({ key, label, color, fields }) => (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <p
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color }}
                >
                  {label}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {fields.map(({ planKey, label: fieldLabel }) => (
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
                        {fieldLabel}
                      </p>
                    </div>
                    <p className="text-3xl font-extrabold text-[#1e293b]">
                      {(plan[planKey] ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1">Annual target</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-6 mb-5 flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
          <svg
            className="w-5 h-5 text-[#78350f] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-[#78350f] text-sm">
            Targets assigned by sub-city. Contact them if numbers need
            correction.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Qonna Work Analysis Section (Woreda) ────────────────────────────────────
const QONNA_ANALYSIS_CATS = [
  {
    key: "furdisa",
    label: "Furdisa",
    color: "#78350f",
    fields: [
      { key: "furdisa_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "furdisa_lakk_sheedii", label: "Sheedii Ijaaraman", unit: "" },
      { key: "furdisa_lakk_horii_waliigalaa", label: "Lakk Horii", unit: "" },
    ],
  },
  {
    key: "annan",
    label: "Annan",
    color: "#0f766e",
    fields: [
      { key: "annan_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "annan_lakk_sheedii", label: "Sheedii Ijaaraman", unit: "" },
      { key: "annan_lakk_saa_waliigalaa", label: "Lakk Sa'a", unit: "" },
    ],
  },
  {
    key: "lukkuu",
    label: "Lukkuu",
    color: "#1e40af",
    fields: [
      { key: "lukkuu_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "lukkuu_lakk_sheedii", label: "Sheedii Ijaaraman", unit: "" },
      { key: "lukkuu_lakk_lukkuu_waliigalaa", label: "Lakk Lukkuu", unit: "" },
    ],
  },
  {
    key: "booyee",
    label: "Booyyee",
    color: "#7c3aed",
    fields: [
      { key: "booyee_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "booyee_lakk_sheedii", label: "Sheedii Ijaaraman", unit: "" },
      {
        key: "booyee_lakk_booyyee_waliigalaa",
        label: "Lakk Booyyee",
        unit: "",
      },
    ],
  },
  {
    key: "kannisaa",
    label: "Kannisaa",
    color: "#b45309",
    fields: [
      { key: "kannisaa_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "kannisaa_lakk_gaaguraa", label: "Gaaguraa Ijaaraman", unit: "" },
      {
        key: "kannisaa_lakk_kannisaa_waliigalaa",
        label: "Lakk Kannisaa",
        unit: "",
      },
    ],
  },
  {
    key: "qurxummii",
    label: "Qurxummii",
    color: "#0369a1",
    fields: [
      { key: "qurxummii_qophi_lafa", label: "Lafa Qophaawe (ha)", unit: "ha" },
      { key: "qurxummii_lakk_pondii", label: "Pondii Ijaaraman", unit: "" },
      {
        key: "qurxummii_lakk_qurxummii_waliigalaa",
        label: "Lakk Qurxummii",
        unit: "",
      },
    ],
  },
];

function QonnaAnalysisSection() {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [actuals, setActuals] = useState(null);
  const [actualsYtd, setActualsYtd] = useState(null);
  const [daysElapsed, setDaysElapsed] = useState(1);
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeredaQonnaPlan()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setPlanLoading(false));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    const woredaId = getMyWoredaId();
    if (!woredaId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetchWoRedaAnalysis("qonna", woredaId, period)
      .then((d) => {
        setActuals(d.actuals ?? {});
        setActualsYtd(d.actualsYtd ?? d.actuals ?? {});
        setDaysElapsed(d.daysElapsed ?? 1);
        setTargets(d.targets ?? {});
      })
      .catch((err) =>
        setError(friendlyError(err, "Failed to load Qonna data.")),
      )
      .finally(() => setLoading(false));
  }, [period]);

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";
  const accentColor = "#78350f";
  const accentLight = "#fffbeb";
  const accentBorder = "#fde68a";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
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
        <div
          className="mb-5 border rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: accentLight, borderColor: accentBorder }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            style={{ color: accentColor }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm" style={{ color: accentColor }}>
            No Qonna plan assigned yet. Targets will appear once sub-city saves
            the plan.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: accentColor }}
          />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : (
        <>
          <div
            className="mb-5 rounded-xl px-4 py-2.5 flex items-center gap-2 border"
            style={{ background: accentLight, borderColor: accentBorder }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              {periodLabel} View
            </span>
            <span className="text-xs" style={{ color: accentColor }}>
              Targets partitioned from annual plan
            </span>
          </div>

          <div className="space-y-6 mb-8">
            {QONNA_ANALYSIS_CATS.map((cat) => (
              <div
                key={cat.key}
                className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden"
              >
                <div
                  className="px-5 py-3 border-b border-[#e2e8f0] flex items-center gap-2"
                  style={{
                    backgroundColor: `${cat.color}12`,
                    borderLeftColor: cat.color,
                    borderLeftWidth: 4,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <p className="text-sm font-bold" style={{ color: cat.color }}>
                    {cat.label}
                  </p>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {cat.fields.map((f) => {
                    const annualTarget = targets ? (targets[f.key] ?? 0) : 0;
                    const periodTarget = partitionTarget(annualTarget, period);
                    const actual = actuals ? (actuals[f.key] ?? 0) : 0;
                    const pct =
                      periodTarget > 0
                        ? Math.min(
                            Math.round((actual / periodTarget) * 100),
                            100,
                          )
                        : 0;
                    const size = 100,
                      sw = 10,
                      r = (size - sw) / 2,
                      circ = 2 * Math.PI * r;
                    const offset = circ - (pct / 100) * circ;
                    return (
                      <div key={f.key} className="flex flex-col items-center">
                        <p className="text-xs font-semibold text-[#334155] mb-2 text-center">
                          {f.label}
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
                              style={{
                                transition: "stroke-dashoffset 0.7s ease",
                              }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                              className="text-base font-extrabold leading-none"
                              style={{ color: cat.color }}
                            >
                              {pct}%
                            </span>
                            <span className="text-[10px] text-[#94a3b8] mt-0.5">
                              done
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 w-full space-y-0.5 px-2">
                          <div className="flex justify-between text-[10px] text-[#64748b]">
                            <span>Actual</span>
                            <span className="font-semibold text-[#1e293b]">
                              {actual.toLocaleString()}
                              {f.unit ? ` ${f.unit}` : ""}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-[#64748b]">
                            <span>Target</span>
                            <span className="font-semibold text-[#1e293b]">
                              {periodTarget.toLocaleString()}
                              {f.unit ? ` ${f.unit}` : ""}
                            </span>
                          </div>
                          <div className="w-full bg-[#f1f5f9] rounded-full h-1 mt-1">
                            <div
                              className="h-1 rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: cat.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)`,
              }}
            >
              <p className="text-sm font-semibold text-white">
                {periodLabel} Summary Table
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                All 6 categories, all 3 sub-metrics each
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {[
                      "Category",
                      "Metric",
                      "Annual Target",
                      "Period Target",
                      "Actual",
                      "Achievement",
                      "Remaining",
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
                  {QONNA_ANALYSIS_CATS.map((cat) =>
                    cat.fields.map((f, fi) => {
                      const annualTarget = targets ? (targets[f.key] ?? 0) : 0;
                      const periodTarget = partitionTarget(
                        annualTarget,
                        period,
                      );
                      const actual = actuals ? (actuals[f.key] ?? 0) : 0;
                      const pct =
                        periodTarget > 0
                          ? Math.min(
                              Math.round((actual / periodTarget) * 100),
                              999,
                            )
                          : 0;
                      const cumulTarget = Math.round(
                        (daysElapsed / 365) * annualTarget,
                      );
                      const actualYtd = actualsYtd
                        ? (actualsYtd[f.key] ?? 0)
                        : 0;
                      const remaining = Math.max(cumulTarget - actualYtd, 0);
                      return (
                        <tr
                          key={f.key}
                          className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
                        >
                          {fi === 0 ? (
                            <td
                              className="px-4 py-3 font-bold text-[#1e293b] align-top"
                              rowSpan={3}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.label}
                              </span>
                            </td>
                          ) : null}
                          <td className="px-4 py-3 text-[#475569]">
                            {f.label}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#1e293b]">
                            {annualTarget.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-[#64748b]">
                            {periodTarget.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1e293b]">
                            {actual.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${cat.color}22`,
                                color: cat.color,
                              }}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {remaining > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                                <svg
                                  className="w-3 h-3"
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
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#d97706]">
                                <svg
                                  className="w-3 h-3"
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
                    }),
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
    planKey: "qusannaa_haawaasaa_target",
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
    planKey: "kenna_liqii_target",
    label: "Kenna Liqii",
    color: "#b45309",
    bg: "bg-[#fffbeb]",
    border: "border-[#fde68a]",
    text: "text-[#b45309]",
  },
  {
    planKey: "deebii_liqii_bilchaate_target",
    label: "Deebii Liqii Bilchaate",
    color: "#78350f",
    bg: "bg-[#fffbeb]",
    border: "border-[#fde68a]",
    text: "text-[#78350f]",
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
    color: "#78350f",
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

function CarraaHojiiAnnualPlanSection({ u }) {
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
        <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#1e40af] rounded-full animate-spin" />
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
                Annual Plan {year}
              </p>
              <p className="text-white/60 text-xs mt-0.5">Read-only</p>
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

function PlaceholderAnnualPlan({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
        {title} Annual Plan
      </h1>
      <p className="text-[#64748b] text-sm mb-6">
        {u.woreda} &middot; {u.subcity}
      </p>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#eff6ff] text-[#64748b] flex items-center justify-center mb-4">
          <PlanIcon />
        </div>
        <h2 className="text-lg font-semibold text-[#334155] mb-2">
          Annual Plan
        </h2>
        <p className="text-[#94a3b8] text-sm max-w-sm mb-6">
          The annual plan for <strong>{title}</strong> will be managed here
          targets and progress tracking for <strong>{u.woreda}</strong>.
        </p>
        <span className="inline-block bg-[#eff6ff] text-[#0f172a] text-xs font-semibold px-4 py-2 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

// ─── Daldala sector ──────────────────────────────────────────────────────────
const DALDALA_FIELDS = [
  {
    name: "galmee_haraa",
    label: "Galmee Haraa",
    required: true,
    type: "number",
  },
  {
    name: "heyyema_haraa",
    label: "Heyyema Haraa",
    required: true,
    type: "number",
  },
  { name: "harahessaa", label: "Harahessaa", required: true, type: "number" },
  {
    name: "galii_daldalarra_galuu",
    label: "Galii Daldalarra Galuu",
    required: true,
    type: "number",
  },
  {
    name: "toannoo_walii_gala",
    label: "To'annoo Walii Gala",
    required: true,
    type: "number",
  },
  { name: "tmd", label: " Leenjii TMD", required: true, type: "number" },
  {
    name: "intarshippii",
    label: "Intarshippii",
    required: false,
    type: "number",
  },
  { name: "ggg", label: "Giddu Gala Gabaa", required: false, type: "number" },
  {
    name: "gabayaa_sanbata",
    label: "Gabaa Sanbata",
    required: false,
    type: "number",
  },
  {
    name: "whg_kudraa",
    label: "Walitti hidhinsaa Gabaa - Kudraa",
    required: false,
    type: "number",
  },
  {
    name: "whg_mudraa",
    label: "Walitti hidhinsaa Gabaa - Mudraa",
    required: false,
    type: "number",
  },
];

const DALDALA_CATS = DALDALA_FIELDS.map((f, i) => ({
  key: f.name,
  planKey: `${f.name}_target`,
  label: f.label,
  color: [
    "#0f766e",
    "#1e40af",
    "#7c3aed",
    "#b45309",
    "#78350f",
    "#0369a1",
    "#dc2626",
    "#475569",
    "#854d0e",
    "#92400e",
    "#0f172a",
  ][i % 11],
}));

// ─── ATK sector ───────────────────────────────────────────────────────────────
const ATK_FIELDS = [
  {
    name: "waliigaltee_pilaanii_kennuu",
    label: "Waliigaltee Pilaanii Kennuu",
    required: true,
    type: "number",
  },
  {
    name: "heeyyama_ijaarsaa_kennamee",
    label: "Heeyyama Ijaarsaa Kennamee",
    required: true,
    type: "number",
  },
  {
    name: "toannoo_fi_hordoffii_gamoo",
    label: "To'annoo Fi Hordoffii Gamoo",
    required: true,
    type: "number",
  },
  {
    name: "galii_atk_galchuu",
    label: "Galii ATK Galchuu",
    required: true,
    type: "number",
  },
];

const ATK_CATS = ATK_FIELDS.map((f, i) => ({
  key: f.name,
  planKey: `${f.name}_target`,
  label: f.label,
  color: ["#7e22ce", "#0369a1", "#78350f", "#b45309"][i % 4],
}));

const REVENUE_CATS = [
  {
    key: "galii_idilee",
    planKey: "galii_idilee_target",
    label: "Galii Idilee",
    color: "#0f766e",
  },
  {
    key: "galii_mana_qophessaa",
    planKey: "galii_mana_qophessaa_target",
    label: "Galii Mana Qophessaa",
    color: "#1e40af",
  },
];

const CARRAA_WOREDA_CATS = [
  {
    key: "leenjii",
    label: "Leenjii",
    planKey: "leenjii_target",
    color: "#1e40af",
  },
  {
    key: "carraa_hojii_dhaabbii",
    label: "Carraa Hojii Dhaabbii",
    planKey: "carraa_hojii_dhaabbii_target",
    color: "#0f766e",
  },
  {
    key: "carraa_hojii_qacarrii",
    label: "Carraa Hojii Qacarrii",
    planKey: "carraa_hojii_qacarrii_target",
    color: "#7c3aed",
  },
  {
    key: "qusannaa_haawaasaa",
    label: "Qusannaa Haawaasaa",
    planKey: "qusannaa_haawaasaa_target",
    color: "#475569",
  },
  {
    key: "qusanna_dirqii",
    label: "Qusanna Dirqii",
    planKey: "qusanna_dirqii_target",
    color: "#64748b",
  },
  {
    key: "kenna_liqii",
    label: "Kenna Liqii",
    planKey: "kenna_liqii_target",
    color: "#b45309",
  },
  {
    key: "deebii_liqii_bilchaate",
    label: "Deebii Liqii Bilchaate",
    planKey: "deebii_liqii_bilchaate_target",
    color: "#78350f",
  },
  {
    key: "deebii_liqii_bulee",
    label: "Deebii Liqii Bulee",
    planKey: "deebii_liqii_bulee_target",
    color: "#dc2626",
  },
  {
    key: "industrii_godoo",
    label: "Industrii Godoo",
    planKey: "industrii_godoo_target",
    color: "#0369a1",
  },
];

function GenericAnnualPlanSection({
  u,
  cats,
  fetchPlanFn,
  title,
  accentColor,
  accentLight,
  accentBorder,
}) {
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();
  useEffect(() => {
    fetchPlanFn()
      .then((d) => setPlan(d.plan || {}))
      .catch(() => setPlan({}))
      .finally(() => setLoading(false));
  }, [fetchPlanFn]);
  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
          style={{ borderTopColor: accentColor }}
        />
      </div>
    );
  return (
    <div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <div
          className="px-6 py-4 flex items-center gap-3 border-b border-[#e2e8f0]"
          style={{
            background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)`,
          }}
        >
          <PlanIcon />
          <div>
            <p className="text-white font-bold text-base">Annual Plan {year}</p>
            <p className="text-white/60 text-xs mt-0.5">Read-only</p>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map(({ planKey, label, color }) => (
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
              <p className="text-xs text-[#94a3b8] mt-1">Annual target</p>
            </div>
          ))}
        </div>
        <div
          className="mx-6 mb-5 flex items-center gap-2 rounded-xl px-4 py-3 border"
          style={{ background: accentLight, borderColor: accentBorder }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            style={{ color: accentColor }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-sm" style={{ color: accentColor }}>
            Targets assigned by sub-city. Contact them if numbers need
            correction.
          </p>
        </div>
      </div>
    </div>
  );
}

function GenericAnalysisSection({
  cats,
  fetchPlanFn,
  title,
  accentColor,
  accentLight,
  accentBorder,
  sector,
}) {
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [actuals, setActuals] = useState(null);
  const [actualsYtd, setActualsYtd] = useState(null);
  const [daysElapsed, setDaysElapsed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlanFn()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null));
  }, [fetchPlanFn]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    const woredaId = getMyWoredaId();
    if (!woredaId || !sector) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetchWoRedaAnalysis(sector, woredaId, period)
      .then((d) => {
        setActuals(d.actuals ?? {});
        setActualsYtd(d.actualsYtd ?? d.actuals ?? {});
        setDaysElapsed(d.daysElapsed ?? 1);
      })
      .catch((err) =>
        setError(friendlyError(err, "Failed to load work analysis.")),
      )
      .finally(() => setLoading(false));
  }, [period, sector]);

  const activeSummary = actuals;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
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
        <div
          className="mb-5 border rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: accentLight, borderColor: accentBorder }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            style={{ color: accentColor }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm" style={{ color: accentColor }}>
            No annual plan assigned yet. Targets will appear once sub-city saves
            the plan.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: accentColor }}
          />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : (
        <>
          <div
            className="mb-5 rounded-xl px-4 py-2.5 flex items-center gap-2 border"
            style={{ background: accentLight, borderColor: accentBorder }}
          >
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: accentColor }}
            >
              {periodLabel} View
            </span>
            <span className="text-xs" style={{ color: accentColor }}>
              — Targets partitioned from annual plan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {cats.map((cat) => {
              const annualTarget = plan ? (plan[cat.planKey] ?? 0) : 0;
              const periodTarget = partitionTarget(annualTarget, period);
              const actual = activeSummary ? (activeSummary[cat.key] ?? 0) : 0;
              const pct =
                periodTarget > 0
                  ? Math.round((actual / periodTarget) * 100)
                  : 0;
              const arcPct = Math.min(pct, 100);
              const size = 110,
                sw = 11,
                r = (size - sw) / 2,
                circ = 2 * Math.PI * r;
              const offset = circ - (arcPct / 100) * circ;
              return (
                <div
                  key={cat.key}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-3 flex flex-col items-center shadow-sm"
                >
                  <p className="text-xs font-bold text-[#334155] mb-2 text-center">
                    {cat.label}
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
                        style={{
                          width: `${arcPct}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)`,
              }}
            >
              <p className="text-sm font-semibold text-white">
                {periodLabel} Summary Table
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {[
                      "Category",
                      "Annual Target",
                      "Period Target",
                      "Actual",
                      "Achievement",
                      "Remaining (carry-over)",
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
                  {cats.map((cat) => {
                    const annualTarget = plan ? (plan[cat.planKey] ?? 0) : 0;
                    const periodTarget = partitionTarget(annualTarget, period);
                    const actual = activeSummary
                      ? (activeSummary[cat.key] ?? 0)
                      : 0;
                    const pct =
                      periodTarget > 0
                        ? Math.min(
                            Math.round((actual / periodTarget) * 100),
                            999,
                          )
                        : 0;
                    const cumulTarget = Math.round(
                      (daysElapsed / 365) * annualTarget,
                    );
                    const actualYtd = actualsYtd
                      ? (actualsYtd[cat.key] ?? 0)
                      : 0;
                    const remaining = Math.max(cumulTarget - actualYtd, 0);
                    return (
                      <tr
                        key={cat.key}
                        className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
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
                          {periodTarget.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1e293b]">
                          {actual.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: `${cat.color}22`,
                              color: cat.color,
                            }}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {remaining > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626]">
                              <svg
                                className="w-3 h-3"
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
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#d97706]">
                              <svg
                                className="w-3 h-3"
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

function PlaceholderAnalysis({ title, u }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Work Analysis</h1>
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
        <div className="w-20 h-20 rounded-full bg-[#fffbeb] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#92400e]"
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
          className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          OK
        </button>
      </div>
    </div>
  );
}

// ─── LockBanner ──────────────────────────────────────────────────────────────
function LockBanner({ sector, reportType, onUnlocked }) {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [reqError, setReqError] = useState("");

  const handleRequest = async () => {
    setRequesting(true);
    setReqError("");
    try {
      const today = new Date().toISOString().split("T")[0];
      await requestEditAccess(sector, today, reportType || "");
      setRequested(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send request.";
      if (msg.toLowerCase().includes("approved")) {
        onUnlocked && onUnlocked();
      } else {
        setReqError(msg);
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-[#b45309] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-[#b45309]">
            Report already submitted for today
          </p>
          <p className="text-xs text-[#92400e] mt-0.5">
            You can only submit once per day. Request edit access from the admin
            to resubmit.
          </p>
        </div>
      </div>
      {reqError && <p className="text-xs text-[#dc2626]">{reqError}</p>}
      {requested ? (
        <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2">
          <svg
            className="w-4 h-4 text-[#92400e] flex-shrink-0"
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
          <p className="text-xs font-medium text-[#92400e]">
            Request sent. The admin will review and grant access.
          </p>
        </div>
      ) : (
        <button
          onClick={handleRequest}
          disabled={requesting}
          className="self-start flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          {requesting ? "Sending..." : "Request Edit Access"}
        </button>
      )}
    </div>
  );
}

function BuusaaSubmitForm({ u, locked, onSubmitSuccess }) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pre-fill form with today's existing report when lock is cleared (unlocked by admin)
  const prevLocked = useRef(locked);
  useEffect(() => {
    const wasLocked = prevLocked.current;
    prevLocked.current = locked;
    if (wasLocked && !locked) {
      // Just got unlocked — fetch today's report and pre-fill
      const today = todayStr();
      fetchMyReports({ sector: "buusaa", date_from: today, date_to: today })
        .then((data) => {
          const rows = Array.isArray(data) ? data : [];
          const row = rows.find(
            (r) => r.report_date === today && r._sector === "buusaa",
          );
          if (!row) return;
          setReportType(row.report_type || REPORT_TYPES[0]);
          setYaada(row.yaada_gudinaa || "");
          setForm({
            hubannooUummuu: String(row.hubannoo_uummuu ?? ""),
            hojiiwwanMootummaa: String(row.horannaa_misensaa ?? ""),
            buuusiJirataa: String(row.buusi_jirataa ?? ""),
            buuusiDaldalaa: String(row.buusi_daldalaa ?? ""),
            buuusiDaldalaaFiGumaataa: String(
              row.buusi_daldalaa_fi_gumaataa ?? "",
            ),
            gumaataJiraataa: String(row.gumaata_jiraataa ?? ""),
            inisheetiviiBuusaaGonofaa: String(
              row.inisheetivii_buusaa_gonofaa ?? "",
            ),
            gumaataMootummaa: String(row.gumaata_mootummaa ?? ""),
            gumaataMidhaaniTarsiimoo: String(
              row.gumaata_midhaani_tarsiimoo ?? "",
            ),
            gumaataMidhaaniSardamaa: String(
              row.gumaata_midhaani_sardamaa ?? "",
            ),
            nyaataBarataa: String(row.nyaata_barataa ?? ""),
            zayitii: String(row.zayitii ?? ""),
            sukkaara: String(row.sukkaara ?? ""),
            // Daldala B: reverse the multiply to show original count
            daldalaBGroupA:
              row.daldala_b_group_a != null
                ? String(Math.round(row.daldala_b_group_a / 4200))
                : "",
            daldalaBGroupB:
              row.daldala_b_group_b != null
                ? String(Math.round(row.daldala_b_group_b / 8700))
                : "",
          });
        })
        .catch(() => {}); // silently ignore — form stays empty if fetch fails
    }
  }, [locked]);

  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClear = () => {
    setForm({});
    setYaada("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    try {
      await submitBuusaaReport({
        report_type: reportType,
        report_date: todayStr(),
        hubannoo_uummuu: Number(form.hubannooUummuu || 0),
        horannaa_misensaa: Number(form.hojiiwwanMootummaa || 0),
        buusi_jirataa: Number(form.buuusiJirataa || 0),
        buusi_daldalaa: Number(form.buuusiDaldalaa || 0),
        buusi_daldalaa_fi_gumaataa: Number(form.buuusiDaldalaaFiGumaataa || 0),
        gumaata_jiraataa: Number(form.gumaataJiraataa || 0),
        inisheetivii_buusaa_gonofaa: Number(
          form.inisheetiviiBuusaaGonofaa || 0,
        ),
        gumaata_midhaani: Number(form.gumaataMootummaa || 0),
        gumaata_midhaani_tarsiimoo: Number(form.gumaataMidhaaniTarsiimoo || 0),
        gumaata_midhaani_sardamaa: Number(form.gumaataMidhaaniSardamaa || 0),
        nyaata_barataa: Number(form.nyaataBarataa || 0),
        zayitii: Number(form.zayitii || 0),
        sukkaara: Number(form.sukkaara || 0),
        // Daldala B: multiply by the fixed unit values before storing
        daldala_b_group_a: Number(form.daldalaBGroupA || 0) * 4200,
        daldala_b_group_b: Number(form.daldalaBGroupB || 0) * 8700,
        yaada_gudinaa: yaada,
      });
      setShowModal(true);
      onSubmitSuccess && onSubmitSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report.");
    }
  };
  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
      {locked && (
        <div className="mb-5">
          <LockBanner
            sector="buusaa"
            reportType={reportType}
            onUnlocked={onSubmitSuccess}
          />
        </div>
      )}
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
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent"
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
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent placeholder-gray-400 transition-all"
                />
              </div>
            ))}

            {/* ── Daldala B section ── */}
            <div className="sm:col-span-2">
              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <p className="text-sm font-semibold text-[#1e293b]">
                    Daldala B
                  </p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Enter count — value is multiplied automatically before
                    saving
                  </p>
                </div>
                <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Group A */}
                  <div>
                    <label className="block text-[#334155] text-sm font-medium mb-1.5">
                      Group A (×4,200) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="daldalaBGroupA"
                      value={form.daldalaBGroupA ?? ""}
                      onChange={handleField}
                      placeholder="0"
                      min="0"
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 placeholder-gray-400 transition-all"
                    />
                    {Number(form.daldalaBGroupA) > 0 && (
                      <p className="text-xs text-[#64748b] mt-1">
                        ={" "}
                        {(Number(form.daldalaBGroupA) * 4200).toLocaleString()}{" "}
                        stored
                      </p>
                    )}
                  </div>
                  {/* Group B */}
                  <div>
                    <label className="block text-[#334155] text-sm font-medium mb-1.5">
                      Group B (×8,700) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="daldalaBGroupB"
                      value={form.daldalaBGroupB ?? ""}
                      onChange={handleField}
                      placeholder="0"
                      min="0"
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 placeholder-gray-400 transition-all"
                    />
                    {Number(form.daldalaBGroupB) > 0 && (
                      <p className="text-xs text-[#64748b] mt-1">
                        ={" "}
                        {(Number(form.daldalaBGroupB) * 8700).toLocaleString()}{" "}
                        stored
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#334155] text-sm font-medium mb-1.5">
                Yaada Gudinaa
              </label>
              <textarea
                value={yaada}
                onChange={(e) => setYaada(e.target.value)}
                placeholder="Enter Yaada Gudinaa"
                rows={4}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent placeholder-gray-400 transition-all resize-none"
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
              className="border border-gray-300 text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={locked}
              className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
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
  sectorKey,
  locked = false,
  onSubmitSuccess,
  headerColor = "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
}) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [form, setForm] = useState({});
  const [yaada, setYaada] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Pre-fill form with today's existing report when lock is cleared (unlocked by admin)
  const prevLocked = useRef(locked);
  useEffect(() => {
    const wasLocked = prevLocked.current;
    prevLocked.current = locked;
    if (wasLocked && !locked && sectorKey) {
      const today = todayStr();
      fetchMyReports({ sector: sectorKey, date_from: today, date_to: today })
        .then((data) => {
          const rows = Array.isArray(data) ? data : [];
          const row = rows.find(
            (r) => r.report_date === today && r._sector === sectorKey,
          );
          if (!row) return;
          setReportType(row.report_type || REPORT_TYPES[0]);
          setYaada(row.yaada_gudinaa || "");
          // field names in GenericSubmitForm match DB column names directly
          const prefilled = {};
          fields.forEach(({ name }) => {
            if (row[name] !== undefined && row[name] !== null) {
              prefilled[name] = String(row[name]);
            }
          });
          setForm(prefilled);
        })
        .catch(() => {});
    }
  }, [locked, sectorKey]);

  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleClear = () => {
    setForm({});
    setYaada("");
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
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
      onSubmitSuccess && onSubmitSuccess();
    } catch (err) {
      setError(friendlyError(err, "Failed to submit report."));
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
      {locked && sectorKey && (
        <div className="mb-5">
          <LockBanner
            sector={sectorKey}
            reportType={reportType}
            onUnlocked={onSubmitSuccess}
          />
        </div>
      )}
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
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent"
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent placeholder-gray-400 transition-all"
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
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-transparent placeholder-gray-400 transition-all resize-none"
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
              className="border border-gray-300 text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={saving || locked}
              className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Galii Complete all required fields
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
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
                className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] cursor-pointer"
              >
                {REVENUE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">
                Filatame:{" "}
                <span className="font-semibold text-[#0f172a]">
                  {catObj.label}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
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
                className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] cursor-pointer"
              >
                {catObj.sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8] mt-2">
                Filatame:{" "}
                <span className="font-semibold text-[#0f172a]">{source}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#f1f5f9] flex items-center gap-2"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
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
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#0f172a] border border-[#dbeafe] text-xs font-semibold px-3 py-1 rounded-full">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: catObj.color }}
                />
                {catObj.label}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#0f172a] border border-[#dbeafe] text-xs font-semibold px-3 py-1 rounded-full">
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
                  className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]"
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
                  className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddEntry}
                  className="w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:opacity-90"
                  style={{ backgroundColor: "#0f172a" }}
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

            <div className="rounded-xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-[#f1f5f9] flex items-center justify-between">
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Galmeewwan Galame
                </p>
                {entries.length > 0 && (
                  <span className="text-xs font-bold text-[#0f172a] bg-[#eff6ff] border border-[#dbeafe] px-2.5 py-0.5 rounded-full">
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
                  <thead className="bg-[#f8fafc] border-b border-[#f1f5f9]">
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
                        className="border-b border-gray-50 hover:bg-[#eff6ff]/50 transition-colors"
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
                    <tr className="bg-[#f8fafc] border-t border-[#e2e8f0]">
                      <td
                        colSpan={2}
                        className="px-4 py-3 font-bold text-[#0f172a] text-sm"
                      >
                        Walii Galii
                      </td>
                      <td className="px-4 py-3 font-extrabold text-[#0f172a] text-base">
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
              className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm"
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
    color: "#0f172a",
  },
];

function RevenueBarChart({ fields, summary }) {
  const max = Math.max(
    ...fields.map((f) => (summary ? (summary[f.key] ?? 0) : 0)),
    1,
  );
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-[#f8fafc] border-b border-[#f1f5f9]">
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

  const [annualSummary, setAnnualSummary] = useState(null);
  const [annualLoading, setAnnualLoading] = useState(false);

  useEffect(() => {
    setAnnualLoading(true);
    fetchSummary("annual")
      .then((d) => setAnnualSummary(d.summary))
      .catch(() => setAnnualSummary(null))
      .finally(() => setAnnualLoading(false));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    fetchSummary(period)
      .then((d) => setSummary(d.summary))
      .catch((err) =>
        setError(friendlyError(err, "Failed to load revenue data.")),
      )
      .finally(() => setLoading(false));
  }, [period]);

  const activeSummary = summary;
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
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

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : (
        <>
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
                <div className="w-6 h-6 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
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

          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-2.5 flex items-center gap-2 mb-5">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wide">
              {periodLabel} View
            </span>
          </div>

          <RevenueBarChart
            fields={REVENUE_CHART_FIELDS}
            summary={activeSummary}
          />

          {activeSummary?.by_source &&
            Object.keys(activeSummary.by_source).length > 0 && (
              <div className="mt-5 bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <p className="text-sm font-semibold text-[#334155]">
                    {periodLabel} — By Revenue Source
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
                          className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
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

// ─── Report History constants ─────────────────────────────────────────────────
const REPORT_PERIOD_TYPES = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annual",
];

const REPORT_SECTORS = [
  { id: "buusaa", label: "Buusaa Gonofaa", color: "#0f172a" },
  { id: "carraaHojii", label: "Carraa Hojii Uumuu", color: "#1e40af" },
  { id: "qonna", label: "Qonna", color: "#78350f" },
  { id: "galii", label: "Galii Sassaabu", color: "#0f766e" },
  { id: "daldala", label: "Daldala", color: "#854d0e" },
  { id: "atk", label: "ATK", color: "#7e22ce" },
];

const HIDDEN_FIELDS = new Set([
  "id",
  "user_id",
  "username",
  "role",
  "_sector",
  "created_at",
  "updated_at",
]);

function fieldLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayFields(row) {
  return Object.entries(row).filter(
    ([k, v]) =>
      !HIDDEN_FIELDS.has(k) &&
      k !== "report_date" &&
      k !== "report_type" &&
      v !== null &&
      v !== "",
  );
}

function formatDateTime(row) {
  if (row.created_at) {
    const d = new Date(row.created_at);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return row.report_date ?? "";
}

const SECTOR_PRINT_FIELDS = {
  buusaa: [
    {
      key: "hubannoo_uummuu",
      planKey: "hubannoo_uummuu_target",
      label: "Hubannoo Uumuu",
    },
    {
      key: "horannaa_misensaa",
      planKey: "horannaa_misensaa_target",
      label: "Horannaa Misensaa",
    },
    {
      key: "buusi_jirataa",
      planKey: "buusi_jiraataa_target",
      label: "Buusi Jiraataa",
    },
    {
      key: "gumaata_jiraataa",
      planKey: "gumaata_jiraataa_target",
      label: "Gumaata Jiraataa",
    },
    {
      key: "buusi_daldalaa",
      planKey: "buusi_daldalaa_target",
      label: "Buusi fi Gumaata Daldalaa",
    },
    {
      key: "buusi_daldalaa_fi_gumaataa",
      planKey: "buusi_daldalaa_target",
      label: "Buusi Daldalaa fi Gumaataa",
    },
    {
      key: "inisheetevii_buusaa_gonofaa",
      planKey: "inisheetivii_buusaa_gonofaa_target",
      label: "Inisheetivii Buusaa Gonofaa",
    },
    {
      key: "gumaata_midhaani",
      planKey: "gumaata_mootummaa_target",
      label: "Gumaata Midhaani (Kuntal)",
    },
    { key: "nyaata_barataa", label: "Nyaata Barataa" },
    { key: "sukkaara", label: "Sukkaara (KG)" },
    { key: "zayitii", label: "Zayitii (Litre)" },
  ],
  carraaHojii: [
    { key: "leenjii", label: "Leenjii" },
    { key: "carraa_hojii_dhaabbii", label: "Carraa Hojii Dhaabbii" },
    { key: "carraa_hojii_qacarrii", label: "Carraa Hojii Qacarrii" },
    { key: "qusannaa_haawaasaa", label: "Qusannaa Haawaasaa" },
    { key: "qusanna_dirqii", label: "Qusanna Dirqii" },
    { key: "kenna_liqii", label: "Kenna Liqii" },
    { key: "deebii_liqii_bilchaate", label: "Deebii Liqii Bilchaate" },
    { key: "deebii_liqii_bulee", label: "Deebii Liqii Bulee" },
    { key: "industrii_godoo", label: "Industrii Godoo" },
  ],
  qonna: [
    { key: "furdisa_bakka_qophaawe", label: "Furdisa - Bakka Qophaawe" },
    { key: "furdisa_sheedii_ijaaraman", label: "Furdisa - Sheedii Ijaaraman" },
    { key: "furdisa_lakk_horii", label: "Furdisa - Lakk Horii" },
    { key: "annan_bakka_qophaawe", label: "Annan - Bakka Qophaawe" },
    { key: "annan_sheedii_ijaaraman", label: "Annan - Sheedii Ijaaraman" },
    { key: "annan_lakk_saaa", label: "Annan - Lakk Sa'a" },
    { key: "lukkuu_bakka_qophaawe", label: "Lukkuu - Bakka Qophaawe" },
    { key: "lukkuu_sheedii_ijaaraman", label: "Lukkuu - Sheedii Ijaaraman" },
    { key: "lukkuu_lakk_lukkuu", label: "Lukkuu - Lakk Lukkuu" },
    { key: "boyyee_bakka_qophaawe", label: "Booyyee - Bakka Qophaawe" },
    { key: "boyyee_sheedii_ijaaraman", label: "Booyyee - Sheedii Ijaaraman" },
    { key: "boyyee_lakk_booyyee", label: "Booyyee - Lakk Booyyee" },
    { key: "kannisaa_bakka_qophaawe", label: "Kannisaa - Bakka Qophaawe" },
    {
      key: "kannisaa_gaaguraa_ijaaraman",
      label: "Kannisaa - Gaaguraa Ijaaraman",
    },
    { key: "kannisaa_lakk_kannisaa", label: "Kannisaa - Lakk Kannisaa" },
    { key: "qurxummii_bakka_qophaawe", label: "Qurxummii - Bakka Qophaawe" },
    {
      key: "qurxummii_pondii_ijaaraman",
      label: "Qurxummii - Pondii Ijaaraman",
    },
    { key: "qurxummii_lakk_qurxummii", label: "Qurxummii - Lakk Qurxummii" },
  ],
  daldala: [
    { key: "galmee_haraa", label: "Galmee Haraa" },
    { key: "heyyema_haraa", label: "Heyyema Haraa" },
    { key: "harahessaa", label: "Harahessaa" },
    { key: "galii_daldalarra_galuu", label: "Galii Daldalarra Galuu" },
    { key: "toannoo_walii_gala", label: "To'annoo Walii Gala" },
    { key: "tmd", label: "Leenjii TMD" },
    { key: "intarshippii", label: "Intarshippii" },
    { key: "ggg", label: "Giddu Gala Gabaa" },
    { key: "gabayaa_sanbata", label: "Gabaa Sanbata" },
    { key: "whg_kudraa", label: "WHG - Kudraa" },
    { key: "whg_mudraa", label: "WHG - Mudraa" },
  ],
  atk: [
    {
      key: "waliigaltee_pilaanii_kennuu",
      label: "Waliigaltee Pilaanii Kennuu",
    },
    { key: "heeyyama_ijaarsaa_kennamee", label: "Heeyyama Ijaarsaa Kennamee" },
    { key: "toannoo_fi_hordoffii_gamoo", label: "To'annoo fi Hordoffii Gamoo" },
    { key: "galii_atk_galchuu", label: "Galii ATK Galchuu" },
  ],
  // Galii Sassaabu — revenue_entries table columns
  galii: [
    { key: "gosa_galii", label: "Gosa Galii" },
    { key: "madda_galii", label: "Madda Galii" },
    { key: "baasii", label: "Baasii (ETB)" },
  ],
};

// Maps a print-modal period value (lowercase) to the report_type prefix stored in the DB.
// DB stores e.g. "Daily Report (Gabaasa Guyyaa)", "Weekly Report (Gabaasa Torban)", etc.
const PRINT_PERIOD_PREFIX = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
};

// Human-readable Afaan Oromo title for each period key used in the print header.
const PRINT_PERIOD_LABELS = {
  daily: "Gabaasa Guyyaa",
  weekly: "Gabaasa Torban",
  monthly: "Gabaasa Ji'aa",
  quarterly: "Gabaasa Kurmaana",
  annual: "Gabaasa Waggaa",
};

// Local partitionTarget used inside the print modal (avoids closure over outer scope).
function printPartitionTarget(annual, per) {
  const n = Number(annual || 0);
  if (n === 0) return 0;
  const d = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, annual: 1 };
  return Math.round(n / (d[per] || 1));
}

function WoRedaPrintModal({ totalCount, woredaName, onClose }) {
  const [sector, setSector] = useState("all");
  const [period, setPeriod] = useState("all");
  const [combined, setCombined] = useState(true);
  const [showPlan, setShowPlan] = useState(true);
  const [showPct, setShowPct] = useState(true);
  const [loading, setLoading] = useState(false);
  // Preview count is loaded fresh so it always matches what handlePrint will generate.
  const [previewCount, setPreviewCount] = useState(null);

  // Recompute preview count whenever period or sector changes.
  useEffect(() => {
    let cancelled = false;
    setPreviewCount(null);
    fetchMyReports({})
      .then((data) => {
        if (cancelled) return;
        let all = Array.isArray(data) ? data : [];

        // Filter by date range for every named period.
        if (period !== "all") {
          const periodKey =
            period === "daily"
              ? "Daily"
              : period === "weekly"
                ? "Weekly"
                : period === "monthly"
                  ? "Monthly"
                  : period === "quarterly"
                    ? "Quarterly"
                    : "Annual";
          const range = getHistoryPeriodDateRange(periodKey);
          if (range) {
            all = all.filter((r) => {
              const d = r.report_date ?? "";
              return d >= range.from && d <= range.to;
            });
          }
        }

        // Filter by sector
        const count =
          sector === "all"
            ? all.length
            : all.filter((r) => r._sector === sector).length;
        setPreviewCount(count);
      })
      .catch(() => setPreviewCount(0));
    return () => {
      cancelled = true;
    };
  }, [period, sector]);

  function buildSectorTable(sectorId, sectorRows, plan) {
    const sec = REPORT_SECTORS.find((s) => s.id === sectorId);
    const sectorLabel = sec?.label ?? sectorId;
    const fields = SECTOR_PRINT_FIELDS[sectorId] ?? [];

    if (!sectorRows.length) {
      return `<div class="sector-block">
        <h2 class="sector-title">${sectorLabel}</h2>
        <p class="no-data">No reports submitted for this sector.</p>
      </div>`;
    }

    // Galii Sassaabu — plain columns, no Karoora/Raawwii/% split
    if (sectorId === "galii") {
      const fieldHeaders = fields.map((f) => `<th>${f.label}</th>`).join("");
      const thead = `<thead><tr>
        <th class="rno">R.No</th>
        <th class="date-col">Guyyaa</th>
        ${fieldHeaders}
      </tr></thead>`;
      const bodyRows = sectorRows
        .map((row, idx) => {
          const dateFmt = row.report_date ?? row.guyyaa ?? "";
          const cells = fields
            .map(({ key }) => {
              const val = row[key];
              if (val === null || val === undefined || val === "")
                return `<td></td>`;
              return `<td class="${typeof val === "number" ? "num" : ""}">${
                typeof val === "number" ? val.toLocaleString() : val
              }</td>`;
            })
            .join("");
          return `<tr><td class="rno">${idx + 1}</td><td class="date-col">${dateFmt}</td>${cells}</tr>`;
        })
        .join("");
      return `<div class="sector-block">
        <div class="sector-title">${sectorLabel}</div>
        <table>${thead}<tbody>${bodyRows}</tbody></table>
      </div>`;
    }

    // Build sub-column definitions based on toggles
    // Raawwii (actual) is always shown
    const subCols = [];
    if (showPlan) subCols.push("plan");
    subCols.push("actual");
    if (showPct) subCols.push("pct");
    const colspan = subCols.length;

    const fieldHeaders = fields
      .map(
        (f) => `<th colspan="${colspan}" class="field-group">${f.label}</th>`,
      )
      .join("");
    const subHeaders = fields
      .map(() =>
        subCols
          .map((c) =>
            c === "plan"
              ? `<th class="sub-col">Karoora</th>`
              : c === "actual"
                ? `<th class="sub-col">Raawwii</th>`
                : `<th class="sub-col">%</th>`,
          )
          .join(""),
      )
      .join("");

    const thead = `<thead>
      <tr>
        <th rowspan="2" class="rno">R.No</th>
        <th rowspan="2" class="date-col">Guyyaa</th>
        ${fieldHeaders}
      </tr>
      <tr>${subHeaders}</tr>
    </thead>`;

    const bodyRows = sectorRows
      .map((row, idx) => {
        const dateFmt = row.report_date ?? "";
        const cells = fields
          .map(({ key, planKey }) => {
            const planCol = planKey ?? key + "_target";
            const annualTarget = plan ? Number(plan[planCol] ?? 0) : 0;
            const target = printPartitionTarget(annualTarget, period);
            const actual = Number(row[key] ?? 0);
            const pct = target > 0 ? Math.round((actual / target) * 100) : 0;
            return subCols
              .map((c) =>
                c === "plan"
                  ? `<td class="num plan">${target.toLocaleString()}</td>`
                  : c === "actual"
                    ? `<td class="num">${actual.toLocaleString()}</td>`
                    : `<td class="num pct">${target > 0 ? pct + "%" : "—"}</td>`,
              )
              .join("");
          })
          .join("");
        return `<tr><td class="rno">${idx + 1}</td><td class="date-col">${dateFmt}</td>${cells}</tr>`;
      })
      .join("");

    return `<div class="sector-block">
      <div class="sector-title">${sectorLabel}</div>
      <table>${thead}<tbody>${bodyRows}</tbody></table>
    </div>`;
  }

  const handlePrint = async () => {
    setLoading(true);
    try {
      // Fetch ALL reports fresh + every sector plan in parallel.
      // fetchWeredaRevenuePlan is included for the galii sector.
      const [
        freshReportsData,
        buusaaPlanRes,
        qonnaPlanRes,
        carraaRes,
        daldalRes,
        atkRes,
        galiiRes,
      ] = await Promise.all([
        fetchMyReports({}).catch(() => []),
        fetchWeredaPlan().catch(() => null),
        fetchWeredaQonnaPlan().catch(() => null),
        fetchWeredaCarraaHojiiPlan().catch(() => null),
        fetchWeredaDaldalaPlan().catch(() => null),
        fetchWeredaAtkPlan().catch(() => null),
        fetchWeredaRevenuePlan().catch(() => null),
      ]);

      let allRows = Array.isArray(freshReportsData) ? freshReportsData : [];

      // Filter by date range for every named period (same logic as the history table).
      if (period !== "all") {
        const periodKey =
          period === "daily"
            ? "Daily"
            : period === "weekly"
              ? "Weekly"
              : period === "monthly"
                ? "Monthly"
                : period === "quarterly"
                  ? "Quarterly"
                  : "Annual";
        const range = getHistoryPeriodDateRange(periodKey);
        if (range) {
          allRows = allRows.filter((r) => {
            const d = r.report_date ?? "";
            return d >= range.from && d <= range.to;
          });
        }
      }

      const planBySector = {
        buusaa: buusaaPlanRes?.plan ?? null,
        carraaHojii: carraaRes?.plan ?? null,
        qonna: qonnaPlanRes?.plan ?? null,
        daldala: daldalRes?.plan ?? null,
        atk: atkRes?.plan ?? null,
        galii: galiiRes?.plan ?? null,
      };

      const generatedDate = new Date().toLocaleString();
      const periodTitle = PRINT_PERIOD_LABELS[period] ?? "";

      const sectorsToInclude =
        sector === "all"
          ? REPORT_SECTORS
          : [REPORT_SECTORS.find((s) => s.id === sector)].filter(Boolean);

      const sectionsHTML = sectorsToInclude
        .map((sec) => {
          const sectorRows = allRows.filter((r) => r._sector === sec.id);
          const sectionHTML = buildSectorTable(
            sec.id,
            sectorRows,
            planBySector[sec.id] ?? null,
          );
          return combined
            ? sectionHTML
            : `<div class="page-section">${sectionHTML}</div>`;
        })
        .join(combined ? "" : "");

      // Page title: period label + sector label + woreda name
      const periodPart = period === "all" ? "" : periodTitle;
      const sectorPart =
        sector === "all"
          ? ""
          : (REPORT_SECTORS.find((s) => s.id === sector)?.label ?? sector);
      const pageTitle = [periodPart, sectorPart, woredaName]
        .filter(Boolean)
        .join(" | ");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${pageTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; background: #fff;
           display: flex; flex-direction: column; min-height: 100vh; padding: 14px 16px 0; }
    .page-body { flex: 1; }
    .report-header { display: flex; justify-content: space-between; align-items: flex-start;
                     margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 8px; }
    .report-header h1 { font-size: 13pt; font-weight: bold; }
    .report-header .meta-right { text-align: right; font-size: 8pt; color: #555; line-height: 1.6; }
    .sector-block { margin-bottom: 22px; }
    .sector-title { font-weight: bold; font-size: 10pt; padding: 3px 0;
                    margin-bottom: 4px; border-bottom: 2px solid #000; }
    .no-data { padding: 8px; font-style: italic; color: #555; border: 1px solid #bbb; }
    table { width: 100%; border-collapse: collapse; table-layout: auto; }
    th, td { border: 1px solid #bbb; padding: 3px 5px; vertical-align: middle; }
    thead tr:first-child th { background: #dce8f4; font-size: 8pt; font-weight: bold; text-align: center; }
    thead tr:last-child th { background: #f0f0f0; font-size: 7pt; font-weight: bold; text-align: center; }
    th.rno, td.rno { text-align: center; width: 24px; }
    th.date-col, td.date-col { white-space: nowrap; font-size: 8pt; width: 68px; }
    th.field-group { text-align: center; }
    th.sub-col { text-align: center; min-width: 44px; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    td.pct { text-align: right; }
    tbody tr:nth-child(even) { background: #f7f9fb; }
    .page-section { page-break-after: always; }
    .page-section:last-child { page-break-after: avoid; }
    .page-footer { border-top: 1px solid #bbb; padding: 6px 0 10px;
                   font-size: 8pt; color: #555; display: flex;
                   justify-content: space-between; margin-top: 16px; }
    @media print {
      body { padding: 0; }
      @page { size: landscape; margin: 10mm; }
      thead tr:first-child th { background: #dce8f4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      thead tr:last-child th { background: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr:nth-child(even) { background: #f7f9fb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page-body">
    <div class="report-header">
      <h1>${pageTitle}</h1>
      <div class="meta-right">
        <div>Adama Bole Sub-City</div>
      </div>
    </div>
    ${sectionsHTML}
  </div>
  <div class="page-footer">
    <span>Generated: ${generatedDate}</span>
    <span>Adama Bole Sub-City Reporting System</span>
  </div>
  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`;

      const win = window.open("", "_blank", "width=1100,height=800");
      if (!win) {
        alert(
          "Pop-up blocked. Please allow pop-ups for this site and try again.",
        );
        return;
      }
      win.document.write(html);
      win.document.close();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const selectedSectorLabel =
    sector === "all"
      ? "All Sectors"
      : (REPORT_SECTORS.find((s) => s.id === sector)?.label ?? sector);

  // Disable print button only when we know there are truly 0 matching reports.
  const printDisabled = loading || previewCount === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div
          className="px-6 py-4 rounded-t-2xl flex items-center justify-between"
          style={{
            background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
          }}
        >
          <div>
            <p className="text-white font-bold text-base">Download Report</p>
            <p className="text-white/60 text-xs mt-0.5">
              Configure and print as PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Period */}
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
              <option value="all">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
              <option value="all">All Sectors</option>
              {REPORT_SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {sector === "all" && (
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">
                Layout
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCombined(true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${combined ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0f172a]"}`}
                >
                  All Together
                </button>
                <button
                  type="button"
                  onClick={() => setCombined(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${!combined ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#0f172a]"}`}
                >
                  Each Sector Separate
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1">
              Sub-columns per Report
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPct((v) => !v)}
                className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${showPct ? "bg-[#0f172a]" : "bg-[#e2e8f0]"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${showPct ? "left-5" : "left-0.5"}`}
                />
              </button>
              <span className="text-sm text-[#1e293b]">
                Show <strong>% of Annual Plan</strong> column
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPlan((v) => !v)}
                className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${showPlan ? "bg-[#0f172a]" : "bg-[#e2e8f0]"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${showPlan ? "left-5" : "left-0.5"}`}
                />
              </button>
              <span className="text-sm text-[#1e293b]">
                Show <strong>Annual Plan</strong> column
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Sub-columns order: Karoora, Raawwii, %.{" "}
              {showPct && showPlan
                ? "3 sub-columns per field."
                : showPct || showPlan
                  ? "2 sub-columns per field."
                  : "1 sub-column per field (Raawwii only)."}
            </p>
          </div>

          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-[#0f172a]">
              {selectedSectorLabel}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              {previewCount === null
                ? "Counting…"
                : `${previewCount} report${previewCount !== 1 ? "s" : ""} will be included`}
            </p>
          </div>
        </div>

        <div className="px-6 pb-5 pt-2 flex items-center justify-between border-t border-[#f1f5f9]">
          <p className="text-[#94a3b8] text-xs">
            Opens in a new window. Use Ctrl+P to save as PDF.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="border border-[#e2e8f0] text-[#64748b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              disabled={printDisabled}
              className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e3a5f] disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
                />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </svg>
              {loading ? "Loading..." : "Print / Save PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadReportCSV(row, sectorLabel) {
  const fields = getDisplayFields(row);
  const submittedAt = row.created_at
    ? new Date(row.created_at).toLocaleString()
    : (row.report_date ?? "");
  const rows = [
    ["Report Type", row.report_type ?? ""],
    ["Sector", sectorLabel],
    ["Submitted At", submittedAt],
    ...fields.map(([k, v]) => [fieldLabel(k), v]),
  ];
  const escape = (c) => `"${String(c).replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${sectorLabel.replace(/\s+/g, "_")}_${row.report_date ?? "unknown"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ReportDetailModal({ row, onClose }) {
  if (!row) return null;
  const sector = REPORT_SECTORS.find((s) => s.id === row._sector);
  const sectorLabel = sector?.label ?? row._sector ?? "Report";
  const accentColor = sector?.color ?? "#0f172a";
  const displayFields = getDisplayFields(row);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div
          className="px-6 py-4 rounded-t-2xl flex items-center justify-between flex-shrink-0"
          style={{
            background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)`,
          }}
        >
          <div>
            <p className="text-white font-bold text-base">
              {sectorLabel} Report
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {row.report_type ?? ""} · {formatDateTime(row)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#eff6ff] border border-[#dbeafe] px-3 py-1 rounded-full text-xs font-semibold text-[#0f172a]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {sectorLabel}
            </span>
            <span className="text-xs text-[#94a3b8]">
              Submitted {formatDateTime(row)}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">
            Report Data
          </p>
          {displayFields.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No numeric data recorded.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayFields.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between bg-[#f8fafc] rounded-lg px-4 py-2.5 border border-[#f1f5f9]"
                >
                  <span className="text-xs font-medium text-[#475569]">
                    {fieldLabel(k)}
                  </span>
                  <span className="text-sm font-bold text-[#1e293b] ml-2">
                    {typeof v === "number" ? v.toLocaleString() : v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-5 pt-3 flex items-center justify-end border-t border-[#f1f5f9] flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-[#0f172a] hover:bg-[#0f172a] text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── period helper (module-level so loadReports useCallback can safely call it) ──
// Uses local timezone helpers consistent with todayStr() to avoid UTC date-shift.
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getHistoryPeriodDateRange(period) {
  const now = new Date();
  const today = localDateStr(now);
  if (period === "Daily") return { from: today, to: today };
  if (period === "Weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    return { from: localDateStr(d), to: today };
  }
  if (period === "Monthly")
    return {
      from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`,
      to: today,
    };
  if (period === "Quarterly") {
    const qs = Math.floor(now.getMonth() / 3) * 3;
    return {
      from: `${now.getFullYear()}-${String(qs + 1).padStart(2, "0")}-01`,
      to: today,
    };
  }
  if (period === "Annual")
    return { from: `${now.getFullYear()}-01-01`, to: today };
  return null;
}

function ReportHistorySection({ woreda }) {
  const currentYear = new Date().getFullYear();

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterSector, setFilterSector] = useState("all");

  const [isCustom, setIsCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [customDateErr, setCustomDateErr] = useState("");
  const [appliedRange, setAppliedRange] = useState(null);

  const [modalRow, setModalRow] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // ── load ──────────────────────────────────────────────────────────────────
  // All periods use a pure date-range filter against report_date.
  // Daily   = today only
  // Weekly  = last 7 days
  // Monthly = 1st of current month → today
  // Quarterly / Annual = their respective calendar ranges
  // This means every report that falls in the window appears regardless of
  // what report_type label was stored on submission.
  const loadReports = useCallback((period, sector, custom, range) => {
    setLoading(true);
    setFetchError("");

    const filters = {};
    if (sector && sector !== "all") filters.sector = sector;

    if (!custom && period !== "all") {
      const r = getHistoryPeriodDateRange(period);
      if (r) {
        filters.date_from = r.from;
        filters.date_to = r.to;
      }
    } else if (custom && range) {
      filters.date_from = range.from;
      filters.date_to = range.to;
    }

    fetchMyReports(filters)
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        setFetchError(
          "Could not load report history. Check your connection and try again.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  // Fetch unfiltered total once on mount
  useEffect(() => {
    fetchMyReports({})
      .then((data) => setTotalCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  // Re-fetch whenever any filter changes
  useEffect(() => {
    loadReports(filterPeriod, filterSector, isCustom, appliedRange);
  }, [filterPeriod, filterSector, isCustom, appliedRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // All filtering is now server-side — rows is already the filtered result
  const filteredRows = rows;

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) {
      setCustomDateErr("Please select both a start and end date.");
      return;
    }
    if (customFrom > customTo) {
      setCustomDateErr("Start date must be before end date.");
      return;
    }
    setCustomDateErr("");
    setAppliedRange({ from: customFrom, to: customTo });
  };

  const handlePeriodChange = (val) => {
    if (val === "custom") {
      setIsCustom(true);
      setFilterPeriod("all");
      setAppliedRange(null);
      setCustomFrom("");
      setCustomTo("");
      setCustomDateErr("");
    } else {
      setIsCustom(false);
      setAppliedRange(null);
      setFilterPeriod(val);
    }
  };

  const handleRetry = () =>
    loadReports(filterPeriod, filterSector, isCustom, appliedRange);

  const statusColor = (s) =>
    s === "Approved"
      ? "bg-amber-100 text-amber-700"
      : s === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <div>
      {modalRow && (
        <ReportDetailModal row={modalRow} onClose={() => setModalRow(null)} />
      )}
      {showPrintModal && (
        <WoRedaPrintModal
          totalCount={totalCount}
          woredaName={woreda ?? "Woreda"}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Report History</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            All reports you have submitted, across every sector. Filter by
            period, sector, or a custom date range.
          </p>
        </div>
        <button
          onClick={() => setShowPrintModal(true)}
          disabled={totalCount === 0}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e3a5f] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
            />
            <rect x="6" y="14" width="12" height="8" rx="1" />
          </svg>
          Download Report
        </button>
      </div>

      {fetchError && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[#dc2626] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="text-[#991b1b] text-sm">{fetchError}</p>
          <button
            onClick={handleRetry}
            className="ml-auto text-xs font-semibold text-[#dc2626] underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Period
            </label>
            <select
              value={isCustom ? "custom" : filterPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
              <option value="all">All Periods</option>
              {REPORT_PERIOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Sector
            </label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
              <option value="all">All Sectors</option>
              {REPORT_SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-shrink-0 pb-0.5">
            <span className="inline-block bg-[#eff6ff] text-[#0f172a] text-xs font-semibold px-3 py-2.5 rounded-lg border border-[#dbeafe]">
              {loading
                ? "..."
                : `${filteredRows.length} result${filteredRows.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {isCustom && (
          <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">
              Custom Date Range
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    setAppliedRange(null);
                  }}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    setAppliedRange(null);
                  }}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
                />
              </div>
            </div>
            {customDateErr && (
              <p className="text-[#dc2626] text-xs mb-2">{customDateErr}</p>
            )}
            {appliedRange && (
              <p className="text-[#d97706] text-xs mb-2 font-medium">
                Showing reports from {appliedRange.from} to {appliedRange.to}
              </p>
            )}
            <button
              onClick={handleApplyCustom}
              className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#0f172a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <AnalysisIcon />
              Apply Date Range
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-sm font-semibold text-[#334155]">
            {isCustom && appliedRange
              ? `Reports from ${appliedRange.from} to ${appliedRange.to}`
              : filterSector !== "all"
                ? `${REPORT_SECTORS.find((s) => s.id === filterSector)?.label ?? filterSector} Reports`
                : filterPeriod !== "all"
                  ? `${filterPeriod} Reports`
                  : "All Submitted Reports"}
          </p>
          {!loading && !fetchError && (
            <span className="text-xs text-[#94a3b8]">{totalCount} total</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
            <span className="text-sm text-[#64748b]">
              Loading report history...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Date Submitted", "Sector", "Report Type", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8]">
                          <HistoryIcon />
                        </div>
                        <p className="text-[#94a3b8] text-sm">
                          No reports match the selected filters.
                        </p>
                        {rows.length === 0 && !fetchError && (
                          <p className="text-[#94a3b8] text-xs">
                            Submit your first report from the Works section.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => {
                    const sec = REPORT_SECTORS.find(
                      (s) => s.id === row._sector,
                    );
                    return (
                      <tr
                        key={row.id ?? `${row._sector}-${idx}`}
                        className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="px-5 py-3 text-[#475569] text-sm">
                          {formatDateTime(row)}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: sec?.color ?? "#64748b",
                              }}
                            />
                            <span className="text-sm font-medium text-[#1e293b]">
                              {sec?.label ?? row._sector}
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-[#475569]">
                          {row.report_type ?? ""}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setModalRow(row)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-[#0f172a] hover:text-[#1e3a5f] bg-[#eff6ff] hover:bg-[#dbeafe] px-3 py-1.5 rounded-lg transition-all"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
                      : id === "daldala"
                        ? "Trade and commerce sector reports"
                        : "Urban land and construction reports"}
            </p>
            <button
              onClick={() => onSelect(id)}
              className="flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              <SubmitIcon /> Submit Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const USERNAME_TO_WOREDA_NAME = {
  "Aanaa Gooroo": "Aanaa Gooroo",
  "Aanaa Dhadacha Araaraa": "Aanaa Dhadacha Araaraa",
  "Aanaa Dhakaa Adii": "Aanaa Dhakaa Adii",
  "Aanaa Andoodee": "Aanaa Andoodee",
};

// ─── WoReda Profile Page ──────────────────────────────────────────────────────
function WoRedaProfilePage({ u, onPhotoUpdate }) {
  const user = u || JSON.parse(localStorage.getItem("user") || "{}");
  const [photo, setPhoto] = useState(user.profile_photo || null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showPwSection, setShowPwSection] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Username update state
  const [showUnameSection, setShowUnameSection] = useState(false);
  const [newUname, setNewUname] = useState(user.username || "");
  const [unameLoading, setUnameLoading] = useState(false);
  const [unameError, setUnameError] = useState("");
  const [unameSuccess, setUnameSuccess] = useState("");

  const authHdr = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      return;
    }
    if (file.size > 2_000_000) {
      setPhotoError("Image must be under 2 MB.");
      return;
    }
    setPhotoError("");
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        const apiInst = (await import("../api/api")).default;
        await apiInst.post("/auth/profile/photo", { photo: base64 }, authHdr());
        setPhoto(base64);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.profile_photo = base64;
        localStorage.setItem("user", JSON.stringify(stored));
        setPhotoSuccess("Profile photo updated.");
        onPhotoUpdate && onPhotoUpdate(base64);
        setTimeout(() => setPhotoSuccess(""), 3000);
      } catch (err) {
        setPhotoError(err.response?.data?.message || "Failed to upload photo.");
      } finally {
        setPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!oldPw) {
      setPwError("Enter your current password.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      const apiInst = (await import("../api/api")).default;
      await apiInst.post(
        "/auth/change-password",
        { old_password: oldPw, new_password: newPw },
        authHdr(),
      );
      setPwSuccess("Password changed successfully.");
      setOldPw("");
      setNewPw("");
      setShowPwSection(false);
      setTimeout(() => setPwSuccess(""), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    setUnameError("");
    setUnameSuccess("");
    if (!newUname.trim()) {
      setUnameError("Username cannot be empty.");
      return;
    }
    if (newUname.trim().length < 3) {
      setUnameError("Username must be at least 3 characters.");
      return;
    }
    setUnameLoading(true);
    try {
      const apiInst = (await import("../api/api")).default;
      const res = await apiInst.patch(
        "/auth/profile/username",
        { username: newUname.trim() },
        authHdr(),
      );
      // Update localStorage so the sidebar and header reflect the new name
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.username = res.data.username;
      localStorage.setItem("user", JSON.stringify(stored));
      setUnameSuccess(
        "Username updated. Refresh the page to see changes everywhere.",
      );
      setShowUnameSection(false);
      setTimeout(() => setUnameSuccess(""), 5000);
    } catch (err) {
      setUnameError(
        err.response?.data?.message || "Failed to update username.",
      );
    } finally {
      setUnameLoading(false);
    }
  };

  const ROLE_COLORS_WD = {
    wereda: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
    "sub-city": "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
    admin: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  };

  const EyeIconWD = ({ show }) =>
    show ? (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Profile</h1>
      <p className="text-[#64748b] text-sm mb-6">
        Manage your account information and security.
      </p>

      {/* Photo + info card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 mb-4">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative flex-shrink-0">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#dce8f4]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#dce8f4]">
                {(user.username || "W")[0].toUpperCase()}
              </div>
            )}
            <label
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a3a5c] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[#1e4976] transition-colors"
              title="Change photo"
            >
              <CameraIconWD />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
                disabled={photoLoading}
              />
            </label>
          </div>
          <div>
            <p className="font-bold text-[#1e293b] text-lg">
              {user.username || "Woreda"}
            </p>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                ROLE_COLORS_WD[user.role] ??
                "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]"
              }`}
            >
              {user.role || "wereda"}
            </span>
          </div>
        </div>
        {photoLoading && (
          <p className="text-xs text-[#64748b] mb-2">Uploading…</p>
        )}
        {photoError && (
          <p className="text-xs text-red-600 mb-2">{photoError}</p>
        )}
        {photoSuccess && (
          <p className="text-xs text-[#92400e] mb-2">{photoSuccess}</p>
        )}
        <div className="space-y-3">
          {[
            { label: "Username", value: user.username || "—" },
            { label: "Role", value: user.role || "wereda" },
            ...(u?.woreda ? [{ label: "Aanaa", value: u.woreda }] : []),
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

      {/* Username section */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-[#1e293b]">Username</p>
            <p className="text-xs text-[#94a3b8]">Update your display name</p>
          </div>
          <button
            onClick={() => {
              setShowUnameSection((p) => !p);
              setUnameError("");
              setUnameSuccess("");
              setNewUname(user.username || "");
            }}
            className="text-xs font-semibold text-[#1a3a5c] border border-[#dce8f4] bg-[#eef4fb] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all"
          >
            {showUnameSection ? "Cancel" : "Edit"}
          </button>
        </div>
        {unameSuccess && (
          <div className="mb-3 flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
            <CheckIconWD />
            <p className="text-[#92400e] text-sm">{unameSuccess}</p>
          </div>
        )}
        {showUnameSection ? (
          <form onSubmit={handleChangeUsername} className="space-y-3">
            {unameError && (
              <p className="text-xs text-[#dc2626]">{unameError}</p>
            )}
            <div>
              <label className="text-xs text-[#64748b] font-semibold uppercase tracking-wide mb-1 block">
                New Username
              </label>
              <input
                type="text"
                value={newUname}
                onChange={(e) => setNewUname(e.target.value)}
                placeholder="Enter new username"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={unameLoading}
              className="w-full bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              {unameLoading ? "Saving..." : "Save Username"}
            </button>
          </form>
        ) : (
          <p className="text-[#1e293b] text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f4f6f9]">
            {user.username || (
              <span className="text-[#dc2626] font-medium">
                Not set — click Edit to add your username
              </span>
            )}
          </p>
        )}
      </div>

      {/* Password section */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-[#1e293b]">Password</p>
            <p className="text-xs text-[#94a3b8]">Change your login password</p>
          </div>
          <button
            onClick={() => {
              setShowPwSection((p) => !p);
              setPwError("");
              setPwSuccess("");
              setOldPw("");
              setNewPw("");
            }}
            className="text-xs font-semibold text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all"
          >
            {showPwSection ? "Cancel" : "Change Password"}
          </button>
        </div>
        {pwSuccess && (
          <div className="mb-3 flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
            <CheckIconWD />
            <p className="text-[#92400e] text-sm">{pwSuccess}</p>
          </div>
        )}
        {showPwSection && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-[#334155] mb-1.5">
                Current Password
              </label>
              <input
                type={showOld ? "text" : "password"}
                value={oldPw}
                onChange={(e) => {
                  setOldPw(e.target.value);
                  setPwError("");
                }}
                placeholder="Your current password"
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
              <button
                type="button"
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 bottom-3 text-[#94a3b8] hover:text-[#64748b]"
              >
                <EyeIconWD show={showOld} />
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-[#334155] mb-1.5">
                New Password
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => {
                  setNewPw(e.target.value);
                  setPwError("");
                }}
                placeholder="Min. 6 characters"
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 bottom-3 text-[#94a3b8] hover:text-[#64748b]"
              >
                <EyeIconWD show={showNew} />
              </button>
            </div>
            {pwError && <p className="text-xs text-red-600">{pwError}</p>}
            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              {pwLoading ? "Saving…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AnnouncementsViewPage({ onRead }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements()
      .then((d) => {
        const list = d.announcements || [];
        setAnnouncements(list);
        if (list.length > 0) {
          const maxId = Math.max(...list.map((a) => a.id));
          markAnnouncementsRead(maxId)
            .then(() => onRead && onRead())
            .catch(() => {});
        }
      })
      .catch(() =>
        setError("No connection. Check your internet and try again."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Announcements</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Updates from the sub-city office.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-12 text-center">
          <svg
            className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <p className="text-[#94a3b8] text-sm">No announcements yet.</p>
          <p className="text-[#cbd5e1] text-xs mt-1">
            Check back later for updates from the sub-city office.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-[#1e293b] text-sm leading-snug">
                    {ann.title}
                  </p>
                  <span className="text-[10px] text-[#94a3b8] whitespace-nowrap flex-shrink-0 mt-0.5">
                    {new Date(ann.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-[#475569] whitespace-pre-wrap leading-relaxed">
                  {ann.body}
                </p>
                <p className="text-[11px] text-[#94a3b8] mt-3">
                  Posted by {ann.created_by}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Camera / Photo Icon ─────────────────────────────────────────────────────
function CameraIcon({ className = "w-5 h-5 flex-shrink-0" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

// ─── Woreda Photo Submit Page ─────────────────────────────────────────────────
function WoredaPhotoSubmitPage({ u }) {
  const [preview, setPreview] = useState(null); // base64 data URL
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSaveError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image must be smaller than 5 MB.");
      return;
    }
    setSaveError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      setSaveError("Please select a photo.");
      return;
    }
    if (!description.trim()) {
      setSaveError("Please enter a description.");
      return;
    }
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      await submitWoredaPhoto({
        photo: preview,
        description: description.trim(),
      });
      setSaveSuccess(true);
      setPreview(null);
      setDescription("");
      // Reset the file input
      const fi = document.getElementById("woreda-photo-file-input");
      if (fi) fi.value = "";
    } catch (err) {
      setSaveError(friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Submit Photo</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Upload a photo from <span className="font-semibold">{u.woreda}</span>{" "}
          with a description. It will be visible to the sub-city.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden max-w-2xl">
        <div
          className="px-6 py-4 border-b border-[#f1f5f9]"
          style={{
            background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
          }}
        >
          <p className="text-white font-semibold text-sm flex items-center gap-2">
            <CameraIcon className="w-4 h-4" /> Photo Submission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* File picker */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">
              Select Photo
            </label>
            <input
              id="woreda-photo-file-input"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-[#374151] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#eff6ff] file:text-[#1d4ed8] hover:file:bg-[#dbeafe] cursor-pointer"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-72 object-cover rounded-xl border border-[#e2e8f0]"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  const fi = document.getElementById("woreda-photo-file-input");
                  if (fi) fi.value = "";
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xs transition-all"
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">
              Description <span className="text-[#dc2626]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Describe what this photo shows…"
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 resize-none"
            />
            <p className="text-xs text-[#94a3b8] mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Error / Success */}
          {saveError && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 text-[#78350f] text-sm font-medium">
              ✓ Photo submitted successfully. The sub-city can now view it.
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !preview}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
            }}
          >
            {saving ? "Submitting…" : "Submit Photo"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Woreda Photo History Page ────────────────────────────────────────────────
function WoredaPhotoHistoryPage({ u }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewPhoto, setViewPhoto] = useState(null); // photo object being viewed
  const [deletingId, setDeletingId] = useState(null);
  const [deleteErr, setDeleteErr] = useState("");

  const load = (from, to) => {
    setLoading(true);
    setError("");
    fetchMyPhotos({ date_from: from || undefined, date_to: to || undefined })
      .then((d) => setPhotos(d.photos || []))
      .catch((err) => setError(friendlyError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("", "");
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    load(dateFrom, dateTo);
  };
  const handleClear = () => {
    setDateFrom("");
    setDateTo("");
    load("", "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    setDeletingId(id);
    setDeleteErr("");
    try {
      await deleteWoredaPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      if (viewPhoto?.id === id) setViewPhoto(null);
    } catch (err) {
      setDeleteErr(friendlyError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Photo History</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          All photos you have submitted from{" "}
          <span className="font-semibold">{u.woreda}</span>.
        </p>
      </div>

      {/* ── Filters ── */}
      <form
        onSubmit={handleFilter}
        className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 mb-5 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "#0f172a" }}
        >
          Apply
        </button>
        {(dateFrom || dateTo) && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc]"
          >
            Clear
          </button>
        )}
      </form>

      {deleteErr && (
        <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {deleteErr}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
          {error}
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-12 text-center">
          <CameraIcon className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" />
          <p className="text-[#94a3b8] text-sm">No photos submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {photos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden flex items-center gap-4 px-4 py-3"
            >
              {/* Thumbnail */}
              <img
                src={p.photo_data}
                alt="thumb"
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-[#e2e8f0] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setViewPhoto(p)}
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e293b] truncate">
                  {p.description}
                </p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Submitted by{" "}
                  <span className="font-medium">{p.submitted_by}</span> ·{" "}
                  {p.woreda_name}
                </p>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {new Date(p.submitted_at).toLocaleString()}
                </p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setViewPhoto(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] transition-all"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#dc2626] border border-[#fecaca] hover:bg-[#fef2f2] transition-all disabled:opacity-50"
                >
                  {deletingId === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Full-screen view modal ── */}
      {viewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setViewPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-[#f1f5f9] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1e293b] text-sm">
                  {viewPhoto.woreda_name}
                </p>
                <p className="text-xs text-[#64748b]">
                  {viewPhoto.submitted_by} ·{" "}
                  {new Date(viewPhoto.submitted_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewPhoto(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] text-lg"
              >
                ✕
              </button>
            </div>
            <img
              src={viewPhoto.photo_data}
              alt="full"
              className="w-full max-h-[60vh] object-contain bg-[#f8fafc]"
            />
            <div className="px-5 py-4 bg-[#f8fafc]">
              <p className="text-sm text-[#1e293b] font-medium mb-1">
                Description
              </p>
              <p className="text-sm text-[#475569] whitespace-pre-wrap">
                {viewPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

  // ── Lock status ──
  const todayDate = new Date().toISOString().split("T")[0];
  const [locked, setLocked] = useState({});
  const [dashStats, setDashStats] = useState(null);

  // ── Refresh locks based on actual submitted reports and edit requests ──
  const refreshLocks = useCallback(() => {
    const date = todayStr();

    // Fetch reports and edit requests in parallel
    Promise.all([fetchMyReports(), fetchMyEditRequests()])
      .then(([reportsData, editRequestsData]) => {
        const reports = Array.isArray(reportsData) ? reportsData : [];
        const editRequests =
          editRequestsData?.requests ??
          (Array.isArray(editRequestsData) ? editRequestsData : []);

        // _sector tags from getMyReports use different names than the lock keys
        // used in edit_requests and checkSubmitLock. Normalize them here.
        const SECTOR_TAG_TO_LOCK_KEY = {
          buusaa: "buusaa",
          carraaHojii: "carraa", // getMyReports tags as "carraaHojii", lock system uses "carraa"
          qonna: "qonna",
          daldala: "daldala",
          atk: "atk",
        };

        // Compute locked sectors:
        // A sector is locked if there is a report for today AND no approved edit request for that sector/date.
        const todayReports = reports.filter((r) => r.report_date === date);
        const sectorsWithReport = todayReports
          .map((r) => SECTOR_TAG_TO_LOCK_KEY[r._sector])
          .filter(Boolean);

        // Find approved edit requests for today's sector/date
        const approvedRequests = editRequests.filter(
          (req) =>
            req.status === "approved" &&
            req.report_date === date &&
            sectorsWithReport.includes(req.sector),
        );
        const approvedSectors = new Set(
          approvedRequests.map((req) => req.sector),
        );

        const newLocked = {};
        const allSectors = ["buusaa", "carraa", "qonna", "daldala", "atk"];
        allSectors.forEach((s) => {
          // Lock if there's a report today and NO approved edit request
          newLocked[s] =
            sectorsWithReport.includes(s) && !approvedSectors.has(s);
        });
        setLocked(newLocked);

        // Update dashStats
        const sorted = [...reports].sort((a, b) =>
          (b.created_at ?? b.report_date ?? "").localeCompare(
            a.created_at ?? a.report_date ?? "",
          ),
        );
        const lastRow = sorted[0];
        const lastDate = lastRow
          ? lastRow.created_at
            ? new Date(lastRow.created_at).toLocaleString(undefined, {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : lastRow.report_date
          : null;
        setDashStats({ total: reports.length, lastDate });
      })
      .catch(() => {
        // On error, leave locked as empty (allow submission as fallback)
        setLocked({});
      });
  }, []);

  // ── Initial load ──
  useEffect(() => {
    refreshLocks();
  }, [refreshLocks]);

  // ── Unread announcements badge ──
  const [unreadCount, setUnreadCount] = useState(0);
  // ── Profile photo (top-right button, syncs when user uploads) ──
  const [profilePhoto, setProfilePhoto] = useState(
    loggedUser?.profile_photo || null,
  );

  useEffect(() => {
    fetchUnreadCount()
      .then((d) => setUnreadCount(d.count ?? 0))
      .catch(() => {});
    const interval = setInterval(() => {
      fetchUnreadCount()
        .then((d) => setUnreadCount(d.count ?? 0))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
      if (sub === "plan") return wl;
      if (sub === "analysis") return wl;
      return wl;
    }
    return (
      {
        dashboard: "Dashboard",
        history: "Report History",
        photos: "Submit Photo",
        photo_history: "Photo History",
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
      className="flex h-screen max-h-screen bg-[#f8fafc] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ════ SIDEBAR ════ */}
      <aside
        className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{
          background: "linear-gradient(180deg,#0f172a 0%,#020617 100%)",
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
          {navBtn("photos", "Submit Photo", CameraIcon)}
          {navBtn("photo_history", "Photo History", HistoryIcon)}
          {navBtn("announcements", "Announcements", AnnouncementsIcon)}
          {navBtn("profile", "Profile", ProfileIcon)}
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
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#dc2626] rounded-full flex items-center justify-center text-white text-[10px] font-bold px-0.5 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {/* Profile photo button */}
            <button
              onClick={() => {
                setActiveNav("profile");
                setActiveWork(null);
              }}
              title="Profile"
              className="flex-shrink-0 focus:outline-none"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#dce8f4] hover:border-[#0f172a] transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold hover:bg-[#1e293b] transition-all">
                  {(u.name || "W")[0].toUpperCase()}
                </div>
              )}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {activeNav === "dashboard" && (
            <div>
              <p className="text-[#1e293b] text-lg font-bold mb-6">
                Welcome back! {u.name}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl border bg-[#eff6ff] border-[#dbeafe] text-[#0f172a] p-5">
                  <p className="text-3xl font-bold leading-tight">
                    {dashStats ? dashStats.total : "…"}
                  </p>
                  <p className="text-sm mt-1 font-semibold">Total Submitted</p>
                  <p className="text-xs mt-0.5 text-[#0f172a]/60">
                    all sectors, all time
                  </p>
                </div>

                <button
                  onClick={() => setActiveNav("announcements")}
                  className="rounded-xl border text-left p-5 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none"
                  style={{
                    backgroundColor: unreadCount > 0 ? "#fef2f2" : "#f8fafc",
                    borderColor: unreadCount > 0 ? "#fecaca" : "#e2e8f0",
                    color: unreadCount > 0 ? "#991b1b" : "#334155",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-3xl font-bold leading-tight">
                      {unreadCount}
                    </p>
                    {unreadCount > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-xs mt-0.5 opacity-60">
                    {unreadCount > 0
                      ? "unread announcements"
                      : "no new announcements"}
                  </p>
                </button>

                <div className="rounded-xl border bg-[#fffbeb] border-[#fde68a] text-[#78350f] p-5">
                  <p className="text-base font-bold leading-tight break-words">
                    {dashStats?.lastDate ?? (dashStats ? "None yet" : "…")}
                  </p>
                  <p className="text-sm mt-1 font-semibold">Last Submitted</p>
                  <p className="text-xs mt-0.5 text-[#78350f]/60">
                    most recent report
                  </p>
                </div>
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
            <ReportHistorySection woreda={u.woreda} />
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
                  return (
                    <GenericAnnualPlanSection
                      u={u}
                      cats={CARRAA_WOREDA_CATS}
                      fetchPlanFn={fetchWeredaCarraaHojiiPlan}
                      title="Carraa Hojii Uumuu"
                      accentColor="#1e40af"
                      accentLight="#eff6ff"
                      accentBorder="#bfdbfe"
                    />
                  );
                if (wid === "revenue")
                  return (
                    <GenericAnnualPlanSection
                      u={u}
                      cats={REVENUE_CATS}
                      fetchPlanFn={fetchWeredaRevenuePlan}
                      title="Galii Sassaabu"
                      accentColor="#475569"
                      accentLight="#f8fafc"
                      accentBorder="#e2e8f0"
                    />
                  );
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
                if (wid === "revenue")
                  return (
                    <GenericAnalysisSection
                      sector="galii"
                      cats={REVENUE_CATS}
                      fetchPlanFn={fetchWeredaRevenuePlan}
                      title="Galii Sassaabu"
                      accentColor="#475569"
                      accentLight="#f8fafc"
                      accentBorder="#e2e8f0"
                    />
                  );
                if (wid === "qonna") return <QonnaAnalysisSection />;
                if (wid === "carraaHojii")
                  return (
                    <GenericAnalysisSection
                      sector="carraa"
                      cats={CARRAA_WOREDA_CATS}
                      fetchPlanFn={fetchWeredaCarraaHojiiPlan}
                      title="Carraa Hojii Uumuu"
                      accentColor="#1e40af"
                      accentLight="#eff6ff"
                      accentBorder="#bfdbfe"
                    />
                  );
                if (wid === "daldala")
                  return (
                    <GenericAnalysisSection
                      sector="daldala"
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
                      sector="atk"
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
              if (wid === "buusaa")
                return (
                  <BuusaaSubmitForm
                    u={u}
                    locked={!!locked.buusaa}
                    onSubmitSuccess={refreshLocks}
                  />
                );
              if (wid === "carraaHojii")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={CARRAA_HOJII_FIELDS}
                    submitFn={submitCarraaHojiiReport}
                    title="Carraa Hojii Uumuu"
                    sectorKey="carraa"
                    locked={!!locked.carraa}
                    onSubmitSuccess={refreshLocks}
                    headerColor="linear-gradient(90deg,#1e40af 0%,#2563eb 100%)"
                  />
                );
              if (wid === "qonna")
                return (
                  <QonnaSubmitForm
                    u={u}
                    locked={!!locked.qonna}
                    onSubmitSuccess={refreshLocks}
                  />
                );
              if (wid === "revenue") return <RevenueSubmitForm u={u} />;
              if (wid === "daldala")
                return (
                  <GenericSubmitForm
                    u={u}
                    fields={DALDALA_FIELDS}
                    submitFn={submitDaldalReport}
                    title="Daldala"
                    sectorKey="daldala"
                    locked={!!locked.daldala}
                    onSubmitSuccess={refreshLocks}
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
                    sectorKey="atk"
                    locked={!!locked.atk}
                    onSubmitSuccess={refreshLocks}
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
              <AnnouncementsViewPage onRead={() => setUnreadCount(0)} />
            </div>
          )}

          {activeNav === "photos" && <WoredaPhotoSubmitPage u={u} />}

          {activeNav === "photo_history" && <WoredaPhotoHistoryPage u={u} />}

          {activeNav === "profile" && (
            <WoRedaProfilePage u={u} onPhotoUpdate={setProfilePhoto} />
          )}
        </main>
      </div>
    </div>
  );
}

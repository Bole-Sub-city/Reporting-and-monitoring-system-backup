import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import RingChart from "../components/ui/RingChart";
import {
  saveSubcityPlan,
  saveSubcityOwnPlan,
  fetchSubcityOwnPlan,
  saveSubcityQonnaPlan,
  fetchSubcityQonnaPlan,
  saveSubcityGenericPlan,
  fetchSubcityGenericPlan,
  fetchWoRedaReports,
  fetchWoRedaAnalysis,
  fetchSubcityGalii,
  createAnnouncement,
  fetchAnnouncements,
  deleteAnnouncement,
} from "../api/planApi";
import {
  fetchAllWoredaReports,
  submitSubcityRevenueReport,
} from "../api/reportApi";

// ─── Network-aware error message helper ─────────────────────────────────────
function friendlyError(
  err,
  fallback = "Something went wrong. Please try again.",
) {
  if (!err) return fallback;
  if (!err.response) return "No connection. Check your internet and try again.";
  return err.response?.data?.message || fallback;
}

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

/**
 * Distribute `categoryTotal` across all 4 weredas using the user-entered
 * percentages (`pcts`). Uses the largest-remainder method so the 4 values
 * always sum exactly to `categoryTotal`.
 *
 * Special pairing rule (only when using the DEFAULT 25.5/24.5 split):
 *   w2 and w3 cannot both round up — when w2 rounds up, w3 must round down.
 */
function pctShare(pcts, woredaId, categoryTotal) {
  const n = Math.round(Number(categoryTotal || 0));
  if (n === 0) return 0;

  const ids = ["w1", "w2", "w3", "w4"];

  // Use the actual pcts values (user may have changed them)
  const totalPct = ids.reduce((s, id) => s + Number(pcts[id] || 0), 0);
  if (totalPct === 0) return 0;

  const exact = Object.fromEntries(
    ids.map((id) => [id, (Number(pcts[id] || 0) / totalPct) * n]),
  );
  const floored = Object.fromEntries(
    ids.map((id) => [id, Math.floor(exact[id])]),
  );
  let remainder = n - ids.reduce((s, id) => s + floored[id], 0);

  const fracs = ids
    .map((id) => ({ id, frac: exact[id] - floored[id] }))
    .sort((a, b) => b.frac - a.frac || (a.id < b.id ? -1 : 1));

  const result = { ...floored };
  let given = 0;

  // Only enforce the w2/w3 pairing when they are the default 25.5/24.5 split
  const isDefaultSplit = Number(pcts.w2) === 25.5 && Number(pcts.w3) === 24.5;

  for (const { id } of fracs) {
    if (given >= remainder) break;
    if (isDefaultSplit) {
      if (id === "w3" && result.w2 > floored.w2) continue;
      if (id === "w2" && result.w3 > floored.w3) continue;
    }
    result[id] += 1;
    given++;
  }

  return result[woredaId] ?? 0;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WOREDAS = [
  { id: "w1", name: "Aanaa Gooroo" },
  { id: "w2", name: "Aanaa Dhadacha Araaraa" },
  { id: "w3", name: "Aanaa Dhakaa Adii" },
  { id: "w4", name: "Aanaa Andoodee" },
];

// ─── Oromo calendar helpers (used in Report History date picker) ──────────────
const OROMO_MONTHS_SC = [
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
const OROMO_DAYS_SC = Array.from({ length: 30 }, (_, i) => i + 1);

function oromoToGregorianSC(monthName, day, year) {
  const month = OROMO_MONTHS_SC.find((m) => m.name === monthName);
  if (!month) return null;
  const [mm, dd] = month.gregStart.split("-").map(Number);
  const gregYear = mm <= 6 ? year + 1 : year;
  const base = new Date(gregYear, mm - 1, dd);
  base.setDate(base.getDate() + (day - 1));
  return base.toISOString().split("T")[0];
}

const PLAN_FIELDS = [
  { key: "hubannoo_uummuu", label: "Hubannoo Uumuu", color: "#0f766e" },
  { key: "horannaa_misensaa", label: "Horannaa Misensaa", color: "#1e40af" },
  { key: "buusi_jiraataa", label: "Buusi Jiraataa", color: "#475569" },
  { key: "gumaata_jiraataa", label: "Gumaata Jiraataa", color: "#64748b" },
  {
    key: "buusi_daldalaa",
    label: "Buusi Fi Gumaataa  Daldalaa ",
    color: "#64748b",
  },
  {
    key: "inisheetivii_buusaa_gonofaa",
    label: "inisheetivii Buusaa Gonofaa",
    color: "#64748b",
  },
  {
    key: "gumaata_mootummaa",
    label: "Gumaata Midhaani (Kuntal)",
    color: "#64748b",
  },
  { key: "nyaata_barataa", label: "Nyaata Barataa", color: "#64748b" },
  { key: "sukkaara", label: "Sukkaara (KG)", color: "#ea580c" },
  { key: "zayitii", label: "Zayitii (Litre)", color: "#65a30d" },
];

const EMPTY_PLAN = {
  hubannoo_uummuu: "",
  horannaa_misensaa: "",
  buusi_jiraataa: "",
  gumaata_jiraataa: "",
  buusi_daldalaa: "",
  inisheetivii_buusaa_gonofaa: "",
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
  { id: "daldala", label: "Daldala" },
  { id: "atk", label: "ATK" },
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
const MegaphoneIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M3 11l18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);
const RevenueNavIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ProfileNavIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const ArchiveNavIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const EyeIconSC = ({ show }) => show ? (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const CameraIconSC = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const UnlockNavIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

// ─── Subcity Profile Page ─────────────────────────────────────────────────────
function SubcityProfilePage({ user }) {
  const u = user || JSON.parse(localStorage.getItem("user") || "{}");
  const [photo, setPhoto] = useState(u.profile_photo || null);
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

  const authHdr = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoError("Please select an image file."); return; }
    if (file.size > 2_000_000) { setPhotoError("Image must be under 2 MB."); return; }
    setPhotoError(""); setPhotoLoading(true);
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
        setTimeout(() => setPhotoSuccess(""), 3000);
      } catch (err) {
        setPhotoError(err.response?.data?.message || "Failed to upload photo.");
      } finally { setPhotoLoading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    if (!oldPw) { setPwError("Enter your current password."); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    setPwLoading(true);
    try {
      const apiInst = (await import("../api/api")).default;
      await apiInst.post("/auth/change-password", { old_password: oldPw, new_password: newPw }, authHdr());
      setPwSuccess("Password changed successfully.");
      setOldPw(""); setNewPw(""); setShowPwSection(false);
      setTimeout(() => setPwSuccess(""), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    } finally { setPwLoading(false); }
  };

  const ROLE_COLORS_SC = {
    wereda: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
    "sub-city": "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
    admin: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Profile</h1>
      <p className="text-[#64748b] text-sm mb-6">Manage your account information and security.</p>

      {/* Photo + info card */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 mb-4">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative flex-shrink-0">
            {photo ? (
              <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-[#dce8f4]" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#dce8f4]">
                {(u.username || "SC")[0].toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a3a5c] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[#1e4976] transition-colors" title="Change photo">
              <CameraIconSC />
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} disabled={photoLoading} />
            </label>
          </div>
          <div>
            <p className="font-bold text-[#1e293b] text-lg">{u.username || "Sub-city"}</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS_SC[u.role] ?? "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]"}`}>{u.role || "sub-city"}</span>
          </div>
        </div>
        {photoLoading && <p className="text-xs text-[#64748b] mb-2">Uploading…</p>}
        {photoError && <p className="text-xs text-red-600 mb-2">{photoError}</p>}
        {photoSuccess && <p className="text-xs text-[#166534] mb-2">{photoSuccess}</p>}
        <div className="space-y-3">
          {[{ label: "Username", value: u.username || "—" }, { label: "Role", value: u.role || "sub-city" }].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-[#64748b] font-semibold uppercase tracking-wide mb-1">{label}</p>
              <p className="text-[#1e293b] text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-[#f4f6f9]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-[#1e293b]">Password</p>
            <p className="text-xs text-[#94a3b8]">Change your login password</p>
          </div>
          <button onClick={() => { setShowPwSection(p => !p); setPwError(""); setPwSuccess(""); setOldPw(""); setNewPw(""); }}
            className="text-xs font-semibold text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all">
            {showPwSection ? "Cancel" : "Change Password"}
          </button>
        </div>
        {pwSuccess && (
          <div className="mb-3 flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
            <CheckIcon /><p className="text-[#166534] text-sm">{pwSuccess}</p>
          </div>
        )}
        {showPwSection && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-[#334155] mb-1.5">Current Password</label>
              <input type={showOld ? "text" : "password"} value={oldPw} onChange={e => { setOldPw(e.target.value); setPwError(""); }}
                placeholder="Your current password"
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20" />
              <button type="button" onClick={() => setShowOld(v => !v)} className="absolute right-3 bottom-3 text-[#94a3b8] hover:text-[#64748b]"><EyeIconSC show={showOld} /></button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-[#334155] mb-1.5">New Password</label>
              <input type={showNew ? "text" : "password"} value={newPw} onChange={e => { setNewPw(e.target.value); setPwError(""); }}
                placeholder="Min. 6 characters"
                className="w-full rounded-lg border border-[#e2e8f0] bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20" />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 bottom-3 text-[#94a3b8] hover:text-[#64748b]"><EyeIconSC show={showNew} /></button>
            </div>
            {pwError && <p className="text-xs text-red-600">{pwError}</p>}
            <button type="submit" disabled={pwLoading}
              className="w-full bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
              {pwLoading ? "Saving…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Plan Unlock Request Banner ───────────────────────────────────────────────
function PlanUnlockBanner({ sector }) {
  // status: null | "pending" | "approved" | "denied" | "expired"
  const [status, setStatus] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const year = new Date().getFullYear();
  const authHdr = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const apiInst = (await import("../api/api")).default;
      const res = await apiInst.get("/auth/plan-unlock-requests/mine", authHdr());
      const requests = res.data.requests || [];
      const mine = requests.find(r => r.sector === sector && r.plan_year === year);
      if (mine) {
        // Client-side expiry check as well
        const isClientExpired =
          mine.status === "pending" &&
          mine.expires_at &&
          new Date(mine.expires_at) < new Date();
        setStatus(isClientExpired ? "expired" : mine.status);
        setExpiresAt(mine.expires_at || null);
      } else {
        setStatus(null);
        setExpiresAt(null);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [sector, year]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Compute days remaining for a pending request
  const daysRemaining = () => {
    if (!expiresAt) return null;
    const ms = new Date(expiresAt) - new Date();
    if (ms <= 0) return 0;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setRequesting(true); setError("");
    try {
      const apiInst = (await import("../api/api")).default;
      const res = await apiInst.post("/auth/plan-unlock-requests", { sector, plan_year: year, reason }, authHdr());
      setStatus("pending");
      setExpiresAt(res.data?.expires_at || null);
      setShowForm(false);
      setReason("");
      setSuccess("Unlock request submitted. Waiting for admin approval.");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally { setRequesting(false); }
  };

  if (loading) return null;

  // ── Approved ──
  if (status === "approved") {
    return (
      <div className="mb-5 flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
        <CheckIcon />
        <p className="text-[#166534] text-sm font-medium">Plan unlock approved. You can now re-save the plan.</p>
      </div>
    );
  }

  // ── Pending ──
  if (status === "pending") {
    const days = daysRemaining();
    return (
      <div className="mb-5 bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[#92400e] text-sm font-medium">Unlock request pending admin approval.</p>
            <p className="text-[#78350f] text-xs mt-0.5">You will be able to re-save the plan once the admin approves.</p>
          </div>
          {days !== null && (
            <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${days <= 1 ? "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]" : "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"}`}>
              {days === 0 ? "Expiring soon" : `${days}d left`}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── Expired or denied — allow re-requesting ──
  const canReRequest = status === "expired" || status === "denied";

  return (
    <div className="mb-5">
      {success && (
        <div className="mb-3 flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
          <CheckIcon /><p className="text-[#166534] text-sm">{success}</p>
        </div>
      )}

      {/* Expired notice */}
      {status === "expired" && (
        <div className="mb-3 bg-[#f4f6f9] border border-[#cbd5e1] rounded-xl px-4 py-3">
          <p className="text-[#475569] text-sm font-medium">Previous unlock request expired.</p>
          <p className="text-[#94a3b8] text-xs mt-0.5">You can submit a new request below.</p>
        </div>
      )}

      <div className="bg-[#f4f6f9] border border-[#e2e8f0] rounded-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#334155]">
              {canReRequest ? "Request a new plan unlock" : "Want to update this annual plan?"}
            </p>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {canReRequest
                ? "Your previous request expired or was denied. Submit a new one."
                : "After a plan is saved, you need admin approval to re-save it. Requests expire after 5 days."}
            </p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ml-3">
              <UnlockNavIcon /> Request Unlock
            </button>
          )}
        </div>
        {showForm && (
          <form onSubmit={handleRequest} className="mt-3 space-y-2">
            <textarea value={reason} onChange={e => { setReason(e.target.value); setError(""); }}
              placeholder="Reason for requesting plan unlock (optional)"
              rows={2}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-white text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 resize-none" />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setReason(""); setError(""); }}
                className="px-3 py-1.5 text-xs font-medium text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-white transition-all">Cancel</button>
              <button type="submit" disabled={requesting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1a3a5c] hover:bg-[#1e4976] rounded-lg transition-all disabled:opacity-60">
                {requesting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Archive Annual Plans Section ─────────────────────────────────────────────
function ArchivePlansSection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);

  const authHdr = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const handleArchive = async () => {
    setConfirm(false); setLoading(true); setResult(null); setError("");
    try {
      const apiInst = (await import("../api/api")).default;
      const res = await apiInst.post("/auth/archive-annual-plans", {}, authHdr());
      setResult(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Archive failed.";
      const errs = err.response?.data?.errors;
      setError(errs ? `${msg}\n${errs.join("\n")}` : msg);
    } finally { setLoading(false); }
  };

  const now = new Date();
  const isAfterJul8 = now.getMonth() > 5 || (now.getMonth() === 6 && now.getDate() >= 8);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Archive Annual Plans</h1>
      <p className="text-[#64748b] text-sm mb-6">After July 8, archive the current year's annual plans and reset all targets to zero for the new year.</p>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
            <ArchiveNavIcon />
          </div>
          <div>
            <p className="font-semibold text-[#1e293b] mb-1">Annual Plan Archive for {now.getFullYear()}</p>
            <p className="text-sm text-[#64748b]">This will save all current annual plan data to the archive, then reset all plan values to zero so new plans can be entered. The old data is preserved as "Annual Plan {now.getFullYear()}".</p>
          </div>
        </div>

        {!isAfterJul8 && (
          <div className="mb-4 bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3 text-sm text-[#92400e]">
            Note: Today is before July 8. This action is intended for after July 8 when the new fiscal year begins.
          </div>
        )}

        {result && (
          <div className="mb-4 flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 text-[#166534] text-sm">
            <CheckIcon />{result}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {confirm ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#dc2626]">This action is irreversible. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)} className="flex-1 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-sm font-medium hover:bg-[#f4f6f9] transition-all">Cancel</button>
              <button onClick={handleArchive} disabled={loading} className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
                {loading ? "Archiving…" : "Confirm Archive & Reset"}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} disabled={loading}
            className="w-full bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
            <ArchiveNavIcon /> Archive Annual Plans for {now.getFullYear()}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-city Announcements Page ──────────────────────────────────────────────
function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Compose form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete state: id being deleted, or null
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const load = () => {
    setLoading(true);
    fetchAnnouncements()
      .then((d) => setAnnouncements(d.announcements || []))
      .catch(() =>
        setError("No connection. Check your internet and try again."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess(false);
    if (!title.trim() || !body.trim()) {
      setSaveError("Both title and body are required.");
      return;
    }
    setSaving(true);
    try {
      await createAnnouncement({ title: title.trim(), body: body.trim() });
      setTitle("");
      setBody("");
      setSaveSuccess(true);
      load();
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || "Failed to post announcement.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setDeleteError("");
    try {
      await deleteAnnouncement(id);
      setConfirmId(null);
      load();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || "Failed to delete announcement.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Delete confirm modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fef2f2] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#dc2626]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#1e293b] text-sm">
                  Delete Announcement
                </p>
                <p className="text-[#64748b] text-xs mt-0.5">
                  This will remove it from all woreda dashboards.
                </p>
              </div>
            </div>
            {deleteError && (
              <p className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setConfirmId(null);
                  setDeleteError("");
                }}
                className="border border-[#e2e8f0] text-[#64748b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                {deletingId === confirmId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Announcements</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Post updates that all woreda offices will see.
        </p>
      </div>

      {/* Compose card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-8">
        <div
          className="px-5 py-4 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
          }}
        >
          <p className="text-white font-semibold text-sm">New Announcement</p>
          <p className="text-white/60 text-xs mt-0.5">
            Will be visible to all woreda offices immediately.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5 uppercase tracking-wide">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title…"
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] mb-1.5 uppercase tracking-wide">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Announcement body…"
              rows={4}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 placeholder-gray-400 resize-none"
            />
          </div>

          {saveError && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-2.5 text-[#991b1b] text-sm">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-2.5 text-[#166534] text-sm">
              Announcement posted successfully.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e3a5f] disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
              <MegaphoneIcon />
              {saving ? "Posting…" : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div>
        <h2 className="text-base font-semibold text-[#334155] mb-3">
          Announcement History
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
            {error}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-10 text-center">
            <p className="text-[#94a3b8] text-sm">
              No announcements posted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-[#1e293b] text-sm">
                    {ann.title}
                  </p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-[#94a3b8] whitespace-nowrap">
                      {new Date(ann.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        setConfirmId(ann.id);
                        setDeleteError("");
                      }}
                      title="Delete announcement"
                      className="text-[#94a3b8] hover:text-[#dc2626] hover:bg-[#fef2f2] p-1.5 rounded-lg transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#475569] mt-2 whitespace-pre-wrap leading-relaxed">
                  {ann.body}
                </p>
                <p className="text-[11px] text-[#94a3b8] mt-2">
                  Posted by {ann.created_by}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────
function OverviewPage({
  dbPlan,
  dbQonnaPlan,
  dbGaliiPlan,
  dbCarraPlan,
  dbDaldalaPlan,
  dbAtkPlan,
  u,
}) {
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

  // Qonna overview — 3 distributed fields per category
  const QONNA_OV_CATS = [
    {
      key: "furdisa",
      label: "Furdisa",
      color: "#065f46",
      fields: [
        { col: "furdisa_qophi_lafa", label: "Qophi Lafa" },
        { col: "furdisa_lakk_sheedii", label: "Lakk Sheedii" },
        { col: "furdisa_lakk_horii_waliigalaa", label: "Lakk Horii" },
      ],
    },
    {
      key: "annan",
      label: "Annan",
      color: "#0f766e",
      fields: [
        { col: "annan_qophi_lafa", label: "Qophi Lafa" },
        { col: "annan_lakk_sheedii", label: "Lakk Sheedii" },
        { col: "annan_lakk_saa_waliigalaa", label: "Lakk Sa'a" },
      ],
    },
    {
      key: "lukkuu",
      label: "Lukkuu",
      color: "#1e40af",
      fields: [
        { col: "lukkuu_qophi_lafa", label: "Qophi Lafa" },
        { col: "lukkuu_lakk_sheedii", label: "Lakk Sheedii" },
        { col: "lukkuu_lakk_lukkuu_waliigalaa", label: "Lakk Lukkuu" },
      ],
    },
    {
      key: "booyee",
      label: "Booyyee",
      color: "#7c3aed",
      fields: [
        { col: "booyee_qophi_lafa", label: "Qophi Lafa" },
        { col: "booyee_lakk_sheedii", label: "Lakk Sheedii" },
        { col: "booyee_lakk_booyyee_waliigalaa", label: "Lakk Booyyee" },
      ],
    },
    {
      key: "kannisaa",
      label: "Kannisaa",
      color: "#b45309",
      fields: [
        { col: "kannisaa_qophi_lafa", label: "Qophi Lafa" },
        { col: "kannisaa_lakk_gaaguraa", label: "Lakk Gaaguraa" },
        { col: "kannisaa_lakk_kannisaa_waliigalaa", label: "Lakk Kannisaa" },
      ],
    },
    {
      key: "qurxummii",
      label: "Qurxummii",
      color: "#0369a1",
      fields: [
        { col: "qurxummii_qophi_lafa", label: "Qophi Lafa" },
        { col: "qurxummii_lakk_pondii", label: "Lakk Pondii" },
        { col: "qurxummii_lakk_qurxummii_waliigalaa", label: "Lakk Qurxummii" },
      ],
    },
  ];
  const hasQonnaPlan =
    dbQonnaPlan &&
    QONNA_OV_CATS.some((cat) =>
      cat.fields.some((f) => Number(dbQonnaPlan[f.col] || 0) > 0),
    );

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
                background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
              }}
            >
              <BuildingIcon />
            </div>
            <p className="text-sm font-bold text-[#1e293b]">{w.name}</p>
            <span className="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f8fafc] text-[#64748b]">
              Active
            </span>
          </div>
        ))}
      </div>

      {/* ── Buusaa Gonofaa plan ── */}
      {hasPlan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Buusaa Gonofaa — Annual Plan Per Woreda Allocation
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
                      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-8 flex flex-col items-center text-center shadow-sm mb-6">
          <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mb-3 text-[#0f172a]">
            <TargetIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-1">
            No Buusaa Gonofaa Plan Yet
          </p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Go to Annual Plan → Buusaa Gonofaa to enter subcity targets.
          </p>
        </div>
      )}

      {/* ── Qonna plan ── */}
      {hasQonnaPlan ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#065f46 0%,#047857 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Qonna — Annual Plan Per Woreda Allocation
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Fetched from database · Year {dbQonnaPlan.year}
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
                    Field
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
                {QONNA_OV_CATS.map(({ key, label, color, fields }) =>
                  fields.map(({ col, label: fLabel }, fi) => {
                    const total = Number(dbQonnaPlan[col] || 0);
                    return (
                      <tr
                        key={col}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                      >
                        {fi === 0 && (
                          <td
                            className="px-5 py-3 font-bold text-[#1e293b]"
                            rowSpan={3}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              {label}
                            </span>
                          </td>
                        )}
                        <td className="px-5 py-3 text-[#64748b] text-xs">
                          {fLabel}
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
                  }),
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3 text-[#065f46]">
            <TargetIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-1">No Qonna Plan Yet</p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Go to Annual Plan → Qonna to enter subcity targets.
          </p>
        </div>
      )}

      {/* ── Generic sector plans (Galii, Carraa, Daldala, ATK) ── */}
      {[
        {
          plan: dbGaliiPlan,
          fields: GALII_FIELDS,
          label: "Galii Sassaabu",
          gradient: "linear-gradient(90deg,#0f766e 0%,#0d9488 100%)",
        },
        {
          plan: dbCarraPlan,
          fields: CARRAA_FIELDS,
          label: "Carraa Hojii Uumuu",
          gradient: "linear-gradient(90deg,#1e40af 0%,#2563eb 100%)",
        },
        {
          plan: dbDaldalaPlan,
          fields: DALDALA_FIELDS_SC,
          label: "Daldala",
          gradient: "linear-gradient(90deg,#854d0e 0%,#a16207 100%)",
        },
        {
          plan: dbAtkPlan,
          fields: ATK_FIELDS_SC,
          label: "ATK",
          gradient: "linear-gradient(90deg,#7e22ce 0%,#9333ea 100%)",
        },
      ].map(({ plan, fields, label, gradient }) => {
        const hasPlanData =
          plan && fields.some((f) => Number(plan[f.key] || 0) > 0);
        return (
          <div key={label} className="mt-6">
            {hasPlanData ? (
              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-[#e2e8f0]"
                  style={{ background: gradient }}
                >
                  <p className="text-sm font-semibold text-white">
                    {label} — Annual Plan Per Woreda Allocation
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Fetched from database · Year {plan.year}
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
                      {fields.map(({ key, label: fLabel, color }) => {
                        const total = Number(plan[key] || 0);
                        return (
                          <tr
                            key={key}
                            className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                          >
                            <td className="px-5 py-3 font-medium text-[#1e293b]">
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: color }}
                                />
                                {fLabel}
                              </span>
                            </td>
                            <td className="px-5 py-3 font-semibold text-[#1e293b]">
                              {total.toLocaleString()}
                            </td>
                            {WOREDAS.map((w) => (
                              <td
                                key={w.id}
                                className="px-5 py-3 text-[#64748b]"
                              >
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
              <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-6 flex flex-col items-center text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center mb-2 text-[#64748b]">
                  <TargetIcon />
                </div>
                <p className="text-[#1e293b] font-semibold text-sm mb-1">
                  No {label} Plan Yet
                </p>
                <p className="text-[#94a3b8] text-xs">
                  Go to Annual Plan → {label} to enter subcity targets.
                </p>
              </div>
            )}
          </div>
        );
      })}
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
        style={{ background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)" }}
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
                  className="w-full border border-[#e2e8f0] rounded-lg pl-3 pr-8 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]"
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
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2.5">
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
      WOREDAS.map((w) => [w.id, Math.round(parsed[w.id] * 10)]),
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
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter subcity totals and woreda allocation percentages. The system
          distributes the targets proportionally.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Plan unlock banner */}
        <PlanUnlockBanner sector="buusaa" />
        {/* Woreda percentage inputs */}
        <WoRedaPctInputs pcts={pcts} onChange={handlePct} />

        {/* Targets */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Allocation preview */}
        {hasValues && pctValid.ok && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
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
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
            style={{ backgroundColor: "#0f172a" }}
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
    "w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-white focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]";
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
  const [forms, setForms] = useState({ ...EMPTY_QONNA_FORM });

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

  // Column name helpers — keep naming consistent with DB columns
  // Subcity-only (not distributed): hektaara_*, lakk_*_per_*
  // Distributed to weredas: qophi_lafa_*, lakk_sheedii_*, lakk_*_waliigalaa
  const CFG_KEYS = {
    furdisa: {
      qophi: "furdisa_qophi_lafa",
      sheedii: "furdisa_lakk_sheedii",
      lakk: "furdisa_lakk_horii_waliigalaa",
      hektaara: "furdisa_hektaara_sheedii",
      lakkPer: "furdisa_lakk_horii_sheedii",
    },
    annan: {
      qophi: "annan_qophi_lafa",
      sheedii: "annan_lakk_sheedii",
      lakk: "annan_lakk_saa_waliigalaa",
      hektaara: "annan_hektaara_sheedii",
      lakkPer: "annan_lakk_saa_sheedii",
    },
    lukkuu: {
      qophi: "lukkuu_qophi_lafa",
      sheedii: "lukkuu_lakk_sheedii",
      lakk: "lukkuu_lakk_lukkuu_waliigalaa",
      hektaara: "lukkuu_hektaara_sheedii",
      lakkPer: "lukkuu_lakk_lukkuu_sheedii",
    },
    booyee: {
      qophi: "booyee_qophi_lafa",
      sheedii: "booyee_lakk_sheedii",
      lakk: "booyee_lakk_booyyee_waliigalaa",
      hektaara: "booyee_hektaara_sheedii",
      lakkPer: "booyee_lakk_booyyee_sheedii",
    },
    kannisaa: {
      qophi: "kannisaa_qophi_lafa",
      sheedii: "kannisaa_lakk_gaaguraa",
      lakk: "kannisaa_lakk_kannisaa_waliigalaa",
      hektaara: "kannisaa_hektaara_gaaguraa",
      lakkPer: "kannisaa_lakk_kannisaa_gaaguraa",
    },
    qurxummii: {
      qophi: "qurxummii_qophi_lafa",
      sheedii: "qurxummii_lakk_pondii",
      lakk: "qurxummii_lakk_qurxummii_waliigalaa",
      hektaara: "qurxummii_hektaara_pondii",
      lakkPer: "qurxummii_lakk_qurxummii_pondii",
    },
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!pctValid.ok) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);

    // Build a flat payload with all columns named exactly as they will be in DB
    const planData = { year: new Date().getFullYear() };

    QONNA_CATEGORIES.forEach((c) => {
      const f = forms[c.key];
      const cfg = CFG_KEYS[c.key];
      const houses = Number(f.houses) || 0;
      const haPer = Number(f.haPerHouse) || 0;
      const unitsPer = Number(f.unitsPerHouse) || 0;
      const totalLand = Math.round(houses * haPer * 100) / 100;
      const totalUnits = houses * unitsPer;

      // 3 distributed fields (go to wereda tables)
      planData[cfg.qophi] = totalLand;
      planData[cfg.sheedii] = houses;
      planData[cfg.lakk] = totalUnits;
      // 2 subcity-only fields (stored only in subcity table)
      planData[cfg.hektaara] = haPer;
      planData[cfg.lakkPer] = unitsPer;
    });

    const weights = Object.fromEntries(
      WOREDAS.map((w) => [w.id, Math.round(parsed[w.id] * 10)]),
    );

    try {
      await saveSubcityQonnaPlan(planData, weights);
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
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter The Required Information Below
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Plan unlock banner */}
        <PlanUnlockBanner sector="qonna" />
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
            <p className="text-sm font-semibold text-white">Furdisa</p>
          </div>
          <div className="px-5 py-5">
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
              background: "linear-gradient(90deg,#b45309 0%,#2563eb 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">Kannisaa</p>
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
            <p className="text-sm font-semibold text-white">Qurxummii</p>
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
            <div className="px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <p className="text-sm font-semibold text-[#1e293b]">
                Woreda Allocation Preview
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">
                Waliigalli horii/mana x mana woreda hundaaf qoodama
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
                      Field
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
                    const cfg = CFG_KEYS[cat.key];
                    const f = forms[cat.key];
                    const houses = Number(f.houses) || 0;
                    const haPer = Number(f.haPerHouse) || 0;
                    const unitsPer = Number(f.unitsPerHouse) || 0;
                    const totalLand = Math.round(houses * haPer * 100) / 100;
                    const totalUnits = houses * unitsPer;

                    const rows = [
                      {
                        label: cfg.qophi
                          .replace(`${cat.key}_`, "")
                          .replace(/_/g, " "),
                        total: totalLand,
                      },
                      {
                        label: cfg.sheedii
                          .replace(`${cat.key}_`, "")
                          .replace(/_/g, " "),
                        total: houses,
                      },
                      {
                        label: cfg.lakk
                          .replace(`${cat.key}_`, "")
                          .replace(/_/g, " "),
                        total: totalUnits,
                      },
                    ];

                    // Use the QONNA_OV_CATS labels for better readability
                    const ovCat =
                      [
                        {
                          key: "furdisa",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Sheedii" },
                            { label: "Lakk Horii" },
                          ],
                        },
                        {
                          key: "annan",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Sheedii" },
                            { label: "Lakk Sa'a" },
                          ],
                        },
                        {
                          key: "lukkuu",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Sheedii" },
                            { label: "Lakk Lukkuu" },
                          ],
                        },
                        {
                          key: "booyee",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Sheedii" },
                            { label: "Lakk Booyyee" },
                          ],
                        },
                        {
                          key: "kannisaa",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Gaaguraa" },
                            { label: "Lakk Kannisaa" },
                          ],
                        },
                        {
                          key: "qurxummii",
                          fields: [
                            { label: "Qophi Lafa" },
                            { label: "Lakk Pondii" },
                            { label: "Lakk Qurxummii" },
                          ],
                        },
                      ].find((c) => c.key === cat.key)?.fields ??
                      rows.map((r) => ({ label: r.label }));

                    if (houses === 0) return null;

                    return rows.map(({ total }, fi) => (
                      <tr
                        key={`${cat.key}-${fi}`}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                      >
                        {fi === 0 && (
                          <td
                            className="px-5 py-3 font-bold text-[#1e293b]"
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
                        )}
                        <td className="px-5 py-3 text-[#64748b] text-xs">
                          {ovCat[fi]?.label}
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
                    ));
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

// ─── Generic sector field definitions ────────────────────────────────────────
const GALII_FIELDS = [
  { key: "galii_idilee", label: "Galii Idilee", color: "#0f766e" },
  {
    key: "galii_mana_qophessaa",
    label: "Galii Mana Qophessaa",
    color: "#1e40af",
  },
];

const CARRAA_FIELDS = [
  { key: "leenjii", label: "Leenjii", color: "#1e40af" },
  {
    key: "carraa_hojii_dhaabbii",
    label: "Carraa Hojii Dhaabbii",
    color: "#0f766e",
  },
  {
    key: "carraa_hojii_qacarrii",
    label: "Carraa Hojii Qacarrii",
    color: "#7c3aed",
  },
  { key: "qusannaa_haawaasaa", label: "Qusannaa Haawaasaa", color: "#475569" },
  { key: "qusanna_dirqii", label: "Qusanna Dirqii", color: "#64748b" },
  { key: "kenna_liqii", label: "Kenna Liqii", color: "#b45309" },
  {
    key: "deebii_liqii_bilchaate",
    label: "Deebii Liqii Bilchaate",
    color: "#065f46",
  },
  { key: "deebii_liqii_bulee", label: "Deebii Liqii Bulee", color: "#dc2626" },
  { key: "industrii_godoo", label: "Industrii Godoo", color: "#0369a1" },
];

const DALDALA_FIELDS_SC = [
  { key: "galmee_haraa", label: "Galmee Haraa", color: "#0f766e" },
  { key: "heyyema_haraa", label: "Heyyema Haraa", color: "#1e40af" },
  { key: "harahessaa", label: "Harahessaa", color: "#7c3aed" },
  {
    key: "galii_daldalarra_galuu",
    label: "Galii Daldalarra Galuu",
    color: "#b45309",
  },
  { key: "toannoo_walii_gala", label: "To'annoo Walii Gala", color: "#065f46" },
  { key: "tmd", label: "Leenjii TMD", color: "#0369a1" },
  { key: "intarshippii", label: "Intarshippii", color: "#dc2626" },
  { key: "ggg", label: "Giddu Gala Gabaa", color: "#475569" },
  { key: "gabayaa_sanbata", label: "Gabaa Sanbata", color: "#854d0e" },
  {
    key: "whg_kudraa",
    label: "Walitti Hidhinsa Gabaa - Kudraa",
    color: "#166534",
  },
  {
    key: "whg_mudraa",
    label: "Walitti Hidhinsa Gabaa - Mudraa",
    color: "#0f172a",
  },
];

const ATK_FIELDS_SC = [
  {
    key: "waliigaltee_pilaanii_kennuu",
    label: "Waliigaltee Pilaanii Kennuu",
    color: "#7e22ce",
  },
  {
    key: "heeyyama_ijaarsaa_kennamee",
    label: "Heeyyama Ijaarsaa Kennamee",
    color: "#0369a1",
  },
  {
    key: "toannoo_fi_hordoffii_gamoo",
    label: "To'annoo Fi Hordoffii Gamoo",
    color: "#065f46",
  },
  { key: "galii_atk_galchuu", label: "Galii ATK Galchuu", color: "#b45309" },
];

// Sector config map used by GenericSubcityPlanPage and GenericSubcityAnalysisPage
const SECTOR_CFG = {
  buusaa: {
    fields: PLAN_FIELDS.map(({ key, label, color }) => ({ key, label, color })),
    label: "Buusaa Gonofaa",
    color: "#0f172a",
    gradient: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
    fetchFn: fetchSubcityOwnPlan,
  },
  qonna: {
    fields: [
      // Furdisa
      {
        key: "furdisa_qophi_lafa",
        label: "Furdisa - Lafa Qophaawe",
        color: "#065f46",
      },
      {
        key: "furdisa_lakk_sheedii",
        label: "Furdisa - Sheedii",
        color: "#065f46",
      },
      {
        key: "furdisa_lakk_horii_waliigalaa",
        label: "Furdisa - Lakk Horii",
        color: "#065f46",
      },
      // Annan
      {
        key: "annan_qophi_lafa",
        label: "Annan - Lafa Qophaawe",
        color: "#0f766e",
      },
      { key: "annan_lakk_sheedii", label: "Annan - Sheedii", color: "#0f766e" },
      {
        key: "annan_lakk_saa_waliigalaa",
        label: "Annan - Lakk Sa'a",
        color: "#0f766e",
      },
      // Lukkuu
      {
        key: "lukkuu_qophi_lafa",
        label: "Lukkuu - Lafa Qophaawe",
        color: "#1e40af",
      },
      {
        key: "lukkuu_lakk_sheedii",
        label: "Lukkuu - Sheedii",
        color: "#1e40af",
      },
      {
        key: "lukkuu_lakk_lukkuu_waliigalaa",
        label: "Lukkuu - Lakk Lukkuu",
        color: "#1e40af",
      },
      // Booyyee
      {
        key: "booyee_qophi_lafa",
        label: "Booyyee - Lafa Qophaawe",
        color: "#7c3aed",
      },
      {
        key: "booyee_lakk_sheedii",
        label: "Booyyee - Sheedii",
        color: "#7c3aed",
      },
      {
        key: "booyee_lakk_booyyee_waliigalaa",
        label: "Booyyee - Lakk Booyyee",
        color: "#7c3aed",
      },
      // Kannisaa
      {
        key: "kannisaa_qophi_lafa",
        label: "Kannisaa - Lafa Qophaawe",
        color: "#b45309",
      },
      {
        key: "kannisaa_lakk_gaaguraa",
        label: "Kannisaa - Gaaguraa",
        color: "#b45309",
      },
      {
        key: "kannisaa_lakk_kannisaa_waliigalaa",
        label: "Kannisaa - Lakk Kannisaa",
        color: "#b45309",
      },
      // Qurxummii
      {
        key: "qurxummii_qophi_lafa",
        label: "Qurxummii - Lafa Qophaawe",
        color: "#0369a1",
      },
      {
        key: "qurxummii_lakk_pondii",
        label: "Qurxummii - Pondii",
        color: "#0369a1",
      },
      {
        key: "qurxummii_lakk_qurxummii_waliigalaa",
        label: "Qurxummii - Lakk",
        color: "#0369a1",
      },
    ],
    label: "Qonna",
    color: "#065f46",
    gradient: "linear-gradient(90deg,#065f46 0%,#059669 100%)",
    fetchFn: fetchSubcityQonnaPlan,
  },
  galii: {
    fields: GALII_FIELDS,
    label: "Galii Sassaabu",
    color: "#475569",
    gradient: "linear-gradient(90deg,#475569 0%,#64748b 100%)",
  },
  carraa: {
    fields: CARRAA_FIELDS,
    label: "Carraa Hojii Uumuu",
    color: "#1e40af",
    gradient: "linear-gradient(90deg,#1e40af 0%,#2563eb 100%)",
  },
  daldala: {
    fields: DALDALA_FIELDS_SC,
    label: "Daldala",
    color: "#854d0e",
    gradient: "linear-gradient(90deg,#854d0e 0%,#a16207 100%)",
  },
  atk: {
    fields: ATK_FIELDS_SC,
    label: "ATK",
    color: "#7e22ce",
    gradient: "linear-gradient(90deg,#7e22ce 0%,#9333ea 100%)",
  },
};

// ─── Generic Subcity Annual Plan Page ────────────────────────────────────────
// Used for Galii, Carraa, Daldala, ATK — same pattern as BuusaaPlanPage.
function GenericSubcityPlanPage({ sector }) {
  const cfg = SECTOR_CFG[sector];
  const emptyForm = Object.fromEntries(cfg.fields.map((f) => [f.key, ""]));
  const [form, setForm] = useState(emptyForm);
  const [pcts, setPcts] = useState({ ...DEFAULT_WOREDA_PCTS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handlePct = (id, val) => setPcts((p) => ({ ...p, [id]: val }));
  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const parsed = parsePcts(pcts);
  const pctValid = validatePcts(parsed);
  const hasValues = cfg.fields.some((f) => Number(form[f.key] || 0) > 0);
  const canSubmit = hasValues && pctValid.ok;
  const share = (woredaId, total) =>
    pctValid.ok ? pctShare(parsed, woredaId, total) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pctValid.ok) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);
    const wForm = Object.fromEntries(
      WOREDAS.map((w) => {
        const effectivePct = w.id === "w2" ? 25 : parsed[w.id];
        return [w.id, Math.round(effectivePct * 10)];
      }),
    );
    try {
      await saveSubcityGenericPlan(sector, form, wForm);
      setSaved(true);
      setForm(emptyForm);
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
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter subcity totals and woreda allocation percentages.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PlanUnlockBanner sector={sector} />
        <WoRedaPctInputs pcts={pcts} onChange={handlePct} />
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{ background: cfg.gradient }}
          >
            <p className="text-sm font-semibold text-white">
              Enter Subcity Annual Totals
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Total targets for the whole subcity
            </p>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cfg.fields.map(({ key, label, color }) => (
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a]"
                />
              </div>
            ))}
          </div>
        </div>

        {hasValues && pctValid.ok && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
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
                  {cfg.fields.map(({ key, label, color }) => {
                    const total = Number(form[key] || 0);
                    if (total === 0) return null;
                    return (
                      <tr
                        key={key}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
            style={{ backgroundColor: cfg.color }}
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

// ─── Helper: partition annual target to period ────────────────────────────────
function partitionTarget(annual, period) {
  if (!annual) return 0;
  const d = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, annual: 1 };
  return Math.round(annual / (d[period] || 1));
}

// ─── Helper: compute bounded completion % ────────────────────────────────────
function computeCompletionPct(actuals, targets, fields) {
  const totalActual = fields.reduce(
    (s, f) => s + Number(actuals[f.key] || 0),
    0,
  );
  const totalTarget = fields.reduce(
    (s, f) => s + Number(targets[f.key] || 0),
    0,
  );
  if (totalTarget === 0) return 0;
  // Uncapped — can exceed 100% when actuals surpass the target
  return Math.round((totalActual / totalTarget) * 1000) / 10;
}

// ─── Period selector options for work analysis ────────────────────────────────
const ANALYSIS_PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

// ─── WoredaAnalysisTable ──────────────────────────────────────────────────────
// Shows Category / Target Allocated (period-adjusted) / Submitted for one
// woreda + sector combination, with a full period selector.
function WoredaAnalysisTable({ sector, woredaId, cfg }) {
  const [period, setPeriod] = useState("monthly");
  const [actuals, setActuals] = useState(null);
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchWoRedaAnalysis(sector, woredaId, period)
      .then((d) => {
        setActuals(d.actuals || {});
        setTargets(d.targets || {});
      })
      .catch((err) => {
        setError(friendlyError(err, "Failed to load analysis data."));
      })
      .finally(() => setLoading(false));
  }, [sector, woredaId, period]);

  const woredaName = WOREDAS.find((w) => w.id === woredaId)?.name ?? woredaId;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mt-6">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3"
        style={{ background: cfg.gradient }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            {woredaName} — {cfg.label}
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Target allocated vs submitted reports
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer"
            style={{ color: "white" }}
          >
            {ANALYSIS_PERIODS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-4 mb-2 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
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
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div
            className="w-7 h-7 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: cfg.color }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Target Allocated
                  <span className="block font-normal normal-case text-[#94a3b8]">
                    {period === "annual"
                      ? "Annual"
                      : period === "monthly"
                        ? "Monthly (÷12)"
                        : period === "quarterly"
                          ? "Quarterly (÷4)"
                          : period === "weekly"
                            ? "Weekly (÷52)"
                            : "Daily (÷365)"}
                  </span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Submitted
                  <span className="block font-normal normal-case text-[#94a3b8]">
                    {period === "annual"
                      ? "This year"
                      : period === "monthly"
                        ? "This month"
                        : period === "quarterly"
                          ? "This quarter"
                          : period === "weekly"
                            ? "This week"
                            : "Today"}
                  </span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  % Done
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.fields.map(({ key, label, color }) => {
                const annualTarget = targets ? Number(targets[key] || 0) : 0;
                const periodTarget = partitionTarget(annualTarget, period);
                const submitted = actuals ? Number(actuals[key] || 0) : 0;
                const pct =
                  periodTarget > 0
                    ? Math.round((submitted / periodTarget) * 100)
                    : 0;
                return (
                  <tr
                    key={key}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
                      {periodTarget.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#1e293b]">
                      {submitted.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] bg-[#f1f5f9] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor:
                                pct >= 100
                                  ? "#16a34a"
                                  : pct >= 60
                                    ? "#ca8a04"
                                    : cfg.color,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            pct >= 100
                              ? "text-[#16a34a]"
                              : pct >= 60
                                ? "text-[#ca8a04]"
                                : "text-[#dc2626]"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── WorkAnalysisRingSection ─────────────────────────────────────────────────
function WorkAnalysisRingSection({ sector, woredaId, cfg }) {
  const [period, setPeriod] = useState("monthly");
  const [actuals, setActuals] = useState(null);
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchWoRedaAnalysis(sector, woredaId, period)
      .then((d) => {
        setActuals(d.actuals || {});
        setTargets(d.targets || {});
      })
      .catch((err) => {
        setError(friendlyError(err, "Failed to load ring chart data."));
        setActuals({});
        setTargets({});
      })
      .finally(() => setLoading(false));
  }, [sector, woredaId, period]);

  const woredaName = WOREDAS.find((w) => w.id === woredaId)?.name ?? woredaId;

  return (
    <div className="mt-6 bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3"
        style={{ background: cfg.gradient }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            {woredaName} — {cfg.label} Work Analysis
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Actual vs period-adjusted target
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-white font-medium bg-transparent focus:outline-none cursor-pointer"
            style={{ color: "white" }}
          >
            {ANALYSIS_PERIODS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-5 py-5">
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
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
        )}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div
              className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
              style={{ borderTopColor: cfg.color }}
            />
          </div>
        ) : (
          <div
            className={`grid gap-4 ${cfg.fields.length > 9 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}
          >
            {cfg.fields.map(({ key, label, color, description }) => {
              const annualTarget = targets ? Number(targets[key] || 0) : 0;
              const periodTarget = partitionTarget(annualTarget, period);
              const actual = actuals ? Number(actuals[key] || 0) : 0;
              return (
                <RingChart
                  key={key}
                  actual={actual}
                  target={periodTarget}
                  color={color}
                  label={label}
                  description={description || label}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SubcityGaliiSubmitForm ───────────────────────────────────────────────────
// Subcity revenue (Galii Sassaabu) submission form.
// Entries are batched locally then submitted via POST /reports/revenue.
function SubcitySuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl px-10 py-10 flex flex-col items-center gap-4 min-w-[320px]">
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

const SUBCITY_REVENUE_CATEGORIES = [
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
      "Idilee Madda Galii 1",
      "Idilee Madda Galii 2",
      "Idilee Madda Galii 3",
      "Idilee Madda Galii 4",
    ],
  },
];

function SubcityGaliiSubmitForm({ u }) {
  const [category, setCategory] = useState(SUBCITY_REVENUE_CATEGORIES[0].id);
  const [source, setSource] = useState(
    SUBCITY_REVENUE_CATEGORIES[0].sources[0],
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [entries, setEntries] = useState([]);
  const [entryError, setEntryError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const catObj = SUBCITY_REVENUE_CATEGORIES.find((c) => c.id === category);

  const handleCategoryChange = (val) => {
    setCategory(val);
    const cat = SUBCITY_REVENUE_CATEGORIES.find((c) => c.id === val);
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
    setDate(new Date().toISOString().split("T")[0]);
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
      await submitSubcityRevenueReport({
        entries,
        total,
        report_date: new Date().toISOString().split("T")[0],
      });
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
      {showModal && <SubcitySuccessModal onClose={() => setShowModal(false)} />}

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Submit Report</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Galii Sassaabu — complete all required fields
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Category + Source selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1: Category */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: "linear-gradient(90deg,#0f766e 0%,#0d9488 100%)",
              }}
            >
              <p className="text-sm font-semibold text-white">
                1. Select Category
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 gap-2">
                {SUBCITY_REVENUE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      category === cat.id
                        ? `${cat.borderColor} ${cat.bgColor}`
                        : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        category === cat.id ? cat.textColor : "text-[#475569]"
                      }`}
                    >
                      {cat.label}
                    </span>
                    {category === cat.id && (
                      <svg
                        className="w-4 h-4 ml-auto flex-shrink-0"
                        style={{ color: cat.color }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Source */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: "linear-gradient(90deg,#1e40af 0%,#2563eb 100%)",
              }}
            >
              <p className="text-sm font-semibold text-white">
                2. Select Source
              </p>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 gap-2">
                {catObj.sources.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSource(src)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left text-sm transition-all ${
                      source === src
                        ? "border-[#1e40af] bg-[#eff6ff] text-[#1e40af] font-semibold"
                        : "border-[#e2e8f0] text-[#475569] hover:border-[#cbd5e1]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        source === src ? "bg-[#1e40af]" : "bg-[#cbd5e1]"
                      }`}
                    />
                    {src}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Amount + Date + Add Entry */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#475569 0%,#64748b 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              3. Enter Amount and Date
            </p>
          </div>
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
                Amount (ETB)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-transparent placeholder-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleAddEntry}
              className="flex items-center justify-center gap-2 bg-[#0f766e] hover:bg-[#0d9488] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
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

        {/* Error */}
        {entryError && (
          <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {entryError}
          </div>
        )}

        {/* Entries table */}
        {entries.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1e293b]">
                Entries ({entries.length})
              </p>
              <p className="text-sm font-bold text-[#0f766e]">
                Total:{" "}
                <span className="text-[#1e293b]">
                  {total.toLocaleString()} ETB
                </span>
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
                      Source
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Amount (ETB)
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#1e293b]">
                        {e.category}
                      </td>
                      <td className="px-5 py-3 text-[#64748b]">{e.source}</td>
                      <td className="px-5 py-3 text-[#64748b]">{e.date}</td>
                      <td className="px-5 py-3 text-right font-semibold text-[#1e293b]">
                        {e.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveEntry(e.id)}
                          className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                          title="Remove"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit bar */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <p className="text-[#94a3b8] text-xs">
            Add all entries then click Submit Report.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEntries([]);
                setEntryError("");
              }}
              className="border border-gray-300 text-[#64748b] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#f8fafc] transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={submitting || entries.length === 0}
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
            >
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
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ComparisonView ───────────────────────────────────────────────────────────
// Shows a table of actual submitted reports across all 4 woredas + a Total column.
// Used for all sectors except galii (which uses GaliiComparisonView instead).
function ComparisonView({ sector, cfg }) {
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchWoRedaReports(sector, period)
      .then((d) => setData(d))
      .catch((err) => {
        setError(friendlyError(err, "Failed to load comparison data."));
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [sector, period]);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3"
        style={{ background: cfg.gradient }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            {cfg.label} — Woreda Submitted Reports Comparison
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Actual submitted values per field across all 4 woredas
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-white font-medium bg-transparent focus:outline-none cursor-pointer"
            style={{ color: "white" }}
          >
            {ANALYSIS_PERIODS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-4 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
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
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div
            className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: cfg.color }}
          />
        </div>
      ) : data ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Field
                </th>
                {WOREDAS.map((w) => (
                  <th
                    key={w.id}
                    className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                  >
                    {w.name}
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#eff6ff]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.fields.map(({ key, label, color }) => {
                const rowTotal = WOREDAS.reduce((sum, w) => {
                  const wd = data.woredas?.find((d) => d.woredaId === w.id);
                  return sum + Number(wd?.actuals?.[key] ?? 0);
                }, 0);
                return (
                  <tr
                    key={key}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
                    {WOREDAS.map((w) => {
                      const wd = data.woredas?.find((d) => d.woredaId === w.id);
                      return (
                        <td
                          key={w.id}
                          className="px-5 py-3 font-semibold text-[#1e293b]"
                        >
                          {Number(wd?.actuals?.[key] ?? 0).toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 font-bold text-[#0f172a] bg-[#eff6ff]">
                      {rowTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

// ─── GaliiComparisonView ──────────────────────────────────────────────────────
// Galii Sassaabu-specific comparison table.
// Columns: Field | W1 | W2 | W3 | W4 | Subcity | Total (Woredas + Subcity)
function GaliiComparisonView({ cfg }) {
  const [period, setPeriod] = useState("monthly");
  const [woredaData, setWoredaData] = useState(null);
  const [subcityActuals, setSubcityActuals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetchWoRedaReports("galii", period),
      fetchSubcityGalii(period),
    ])
      .then(([woredaRes, subcityRes]) => {
        setWoredaData(woredaRes);
        setSubcityActuals(subcityRes.actuals || {});
      })
      .catch((err) => {
        setError(friendlyError(err, "Failed to load Galii comparison data."));
        setWoredaData(null);
        setSubcityActuals(null);
      })
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3"
        style={{ background: cfg.gradient }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            Galii Sassaabu — Comparison (Woredas + Subcity)
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Submitted revenue per field across all 4 woredas and the sub-city
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-white font-medium bg-transparent focus:outline-none cursor-pointer"
            style={{ color: "white" }}
          >
            {ANALYSIS_PERIODS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-4 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
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
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div
            className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: cfg.color }}
          />
        </div>
      ) : woredaData ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Field
                </th>
                {WOREDAS.map((w) => (
                  <th
                    key={w.id}
                    className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                  >
                    {w.name}
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#0f766e] uppercase tracking-wide bg-[#f0fdf9]">
                  Subcity
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#eff6ff]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cfg.fields.map(({ key, label, color }) => {
                const woredaSum = WOREDAS.reduce((sum, w) => {
                  const wd = woredaData.woredas?.find(
                    (d) => d.woredaId === w.id,
                  );
                  return sum + Number(wd?.actuals?.[key] ?? 0);
                }, 0);
                const subcityVal = Number(subcityActuals?.[key] ?? 0);
                const rowTotal = woredaSum + subcityVal;
                return (
                  <tr
                    key={key}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
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
                    {WOREDAS.map((w) => {
                      const wd = woredaData.woredas?.find(
                        (d) => d.woredaId === w.id,
                      );
                      return (
                        <td
                          key={w.id}
                          className="px-5 py-3 font-semibold text-[#1e293b]"
                        >
                          {Number(wd?.actuals?.[key] ?? 0).toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 font-bold text-[#0f766e] bg-[#f0fdf9]">
                      {subcityVal.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-bold text-[#0f172a] bg-[#eff6ff]">
                      {rowTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

// ─── RankView ─────────────────────────────────────────────────────────────────
// Shows 4 woredas ranked by completion %. Each row is clickable for detail.
function RankView({ sector, cfg }) {
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedWoreda, setExpandedWoreda] = useState(null);
  // per-woreda detail data: { [woredaId]: { actuals, targets, loading, error } }
  const [detailData, setDetailData] = useState({});
  const [detailPeriod, setDetailPeriod] = useState("monthly");

  // Fetch all 4 woredas' actuals
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchWoRedaReports(sector, period)
      .then((d) => setData(d))
      .catch((err) => {
        setError(friendlyError(err, "Failed to load rank data."));
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [sector, period]);

  // Pre-fetch targets for ALL 4 woredas whenever sector or detailPeriod changes
  // so completion % is visible immediately without needing to expand a row
  useEffect(() => {
    WOREDAS.forEach((w) => {
      setDetailData((prev) => ({
        ...prev,
        [w.id]: { ...(prev[w.id] || {}), loading: true, error: "" },
      }));
      fetchWoRedaAnalysis(sector, w.id, detailPeriod)
        .then((d) => {
          setDetailData((prev) => ({
            ...prev,
            [w.id]: {
              actuals: d.actuals || {},
              targets: d.targets || {},
              loading: false,
              error: "",
            },
          }));
        })
        .catch((err) => {
          setDetailData((prev) => ({
            ...prev,
            [w.id]: {
              actuals: {},
              targets: {},
              loading: false,
              error: err?.response?.data?.message || "Failed to load detail.",
            },
          }));
        });
    });
  }, [sector, detailPeriod]);

  // Build ranked list with real completion % once detail data loads
  const rankedWithPct = (() => {
    if (!data) return [];
    return WOREDAS.map((w) => {
      const woredaData = data.woredas?.find((wd) => wd.woredaId === w.id);
      const actuals = woredaData?.actuals || {};
      const detail = detailData[w.id];
      const targets = detail?.targets || {};
      const completionPct = computeCompletionPct(actuals, targets, cfg.fields);
      return { ...w, actuals, targets, completionPct };
    })
      .sort(
        (a, b) => b.completionPct - a.completionPct || a.id.localeCompare(b.id),
      )
      .map((w, i) => ({ ...w, rank: i + 1 }));
  })();

  const rankColors = ["#3b82f6", "#94a3b8", "#b45309", "#64748b"];
  const rankLabels = ["🥇", "🥈", "🥉", "4th"];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-3"
        style={{ background: cfg.gradient }}
      >
        <div>
          <p className="text-sm font-semibold text-white">
            {cfg.label} — Woreda Completion Ranking
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            Ranked by actual work vs. assigned targets
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-white font-medium bg-transparent focus:outline-none cursor-pointer"
            style={{ color: "white" }}
          >
            {ANALYSIS_PERIODS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-4 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
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
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div
            className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
            style={{ borderTopColor: cfg.color }}
          />
        </div>
      ) : (
        <div className="divide-y divide-[#f1f5f9]">
          {rankedWithPct.map((w) => {
            const isExpanded = expandedWoreda === w.id;
            const detail = detailData[w.id];
            const rankIdx = w.rank - 1;

            return (
              <div key={w.id}>
                {/* Rank row — clickable */}
                <button
                  onClick={() => setExpandedWoreda(isExpanded ? null : w.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors text-left"
                >
                  {/* Rank badge */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold"
                    style={{
                      backgroundColor: `${rankColors[rankIdx]}22`,
                      color: rankColors[rankIdx],
                    }}
                  >
                    {rankLabels[rankIdx]}
                  </div>

                  {/* Woreda name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1e293b] text-sm">{w.name}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      Click to {isExpanded ? "collapse" : "view"} plan vs.
                      submitted detail
                    </p>
                  </div>

                  {/* Completion % bar */}
                  <div className="w-40 flex-shrink-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748b]">Completion</span>
                      <span className="font-bold" style={{ color: cfg.color }}>
                        {w.completionPct}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(w.completionPct, 100)}%`,
                          backgroundColor: cfg.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-[#94a3b8] flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 bg-[#f8fafc] border-t border-[#f1f5f9]">
                    {/* Detail period selector */}
                    <div className="flex items-center justify-between py-3">
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                        Plan vs. Submitted — {w.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8]">Period:</span>
                        <select
                          value={detailPeriod}
                          onChange={(e) => setDetailPeriod(e.target.value)}
                          className="text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 bg-white text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                        >
                          {ANALYSIS_PERIODS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {detail?.error && (
                      <div className="mb-3 flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-2.5">
                        <span className="text-[#dc2626] text-xs">
                          {detail.error}
                        </span>
                      </div>
                    )}

                    {detail?.loading ? (
                      <div className="flex items-center justify-center h-20">
                        <div
                          className="w-6 h-6 border-4 border-[#dbeafe] rounded-full animate-spin"
                          style={{ borderTopColor: cfg.color }}
                        />
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#f1f5f9]">
                              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                                Field
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                                Targeted (Annual)
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                                Period Target
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                                Submitted
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                                % Done
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {cfg.fields.map(({ key, label, color }) => {
                              const annualTarget = Number(
                                detail?.targets?.[key] || 0,
                              );
                              const periodTgt = partitionTarget(
                                annualTarget,
                                detailPeriod,
                              );
                              const actual = Number(w.actuals?.[key] || 0);
                              const pct =
                                periodTgt > 0
                                  ? Math.round((actual / periodTgt) * 100)
                                  : 0;
                              return (
                                <tr
                                  key={key}
                                  className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                                >
                                  <td className="px-4 py-3 font-medium text-[#1e293b]">
                                    <span className="flex items-center gap-2">
                                      <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                      />
                                      {label}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-[#64748b]">
                                    {annualTarget.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 text-[#64748b]">
                                    {periodTgt.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-[#1e293b]">
                                    {actual.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${pct >= 100 ? "bg-green-100 text-green-700" : pct >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
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
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Generic Subcity Work Analysis Page ──────────────────────────────────────
// Fetches the saved subcity plan for the sector and shows a woreda-tab view
// with ring charts + summary table + remaining column — same pattern as Buusaa.
function GenericSubcityAnalysisPage({ sector }) {
  const cfg = SECTOR_CFG[sector];
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWoreda, setActiveWoreda] = useState(WOREDAS[0].id);
  const [activeView, setActiveView] = useState("woreda"); // "woreda" | "comparison" | "rank"

  useEffect(() => {
    const fetch = cfg.fetchFn ?? (() => fetchSubcityGenericPlan(sector));
    fetch()
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, [sector]);

  const woredaLabel = WOREDAS.find((w) => w.id === activeWoreda)?.name ?? "";

  // For display: subcity totals overview cards use getPlanTotal.
  const getPlanTotal = (fieldKey) => (plan ? Number(plan[fieldKey] || 0) : 0);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-8 h-8 border-4 border-[#dbeafe] rounded-full animate-spin"
          style={{ borderTopColor: cfg.color }}
        />
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Work Analysis</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Subcity annual plan distributed across the 4 woredas.
        </p>
      </div>

      {!plan && (
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
            No {cfg.label} annual plan saved yet. Enter targets in Annual Plan
            first.
          </p>
        </div>
      )}

      {/* Woreda tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {WOREDAS.map((w) => (
          <button
            key={w.id}
            onClick={() => {
              setActiveWoreda(w.id);
              setActiveView("woreda");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeView === "woreda" && activeWoreda === w.id
                ? "text-white shadow"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#0f172a] hover:text-[#0f172a]"
            }`}
            style={
              activeView === "woreda" && activeWoreda === w.id
                ? { background: cfg.gradient }
                : {}
            }
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* Comparison & Rank buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveView("comparison")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeView === "comparison"
              ? "text-white shadow border-transparent"
              : "bg-white border-[#e2e8f0] text-[#0f172a] hover:border-[#0f172a] hover:bg-[#eff6ff]"
          }`}
          style={
            activeView === "comparison" ? { background: cfg.gradient } : {}
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="8" height="18" rx="1" />
            <rect x="13" y="3" width="8" height="18" rx="1" />
          </svg>
          Comparison
        </button>
        <button
          onClick={() => setActiveView("rank")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeView === "rank"
              ? "text-white shadow border-transparent"
              : "bg-white border-[#e2e8f0] text-[#0f172a] hover:border-[#0f172a] hover:bg-[#eff6ff]"
          }`}
          style={activeView === "rank" ? { background: cfg.gradient } : {}}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Rank
        </button>
      </div>

      {/* ── View-conditional content ── */}
      {activeView === "comparison" ? (
        sector === "galii" ? (
          <GaliiComparisonView cfg={cfg} />
        ) : (
          <ComparisonView sector={sector} cfg={cfg} />
        )
      ) : activeView === "rank" ? (
        <RankView sector={sector} cfg={cfg} />
      ) : (
        <>
          {/* Subcity totals overview */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{ background: cfg.gradient }}
            >
              <p className="text-sm font-semibold text-white">
                Subcity Total Annual Plan
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                All 4 woredas combined
              </p>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cfg.fields.map(({ key, label, color }) => {
                const total = getPlanTotal(key);
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-3 text-center"
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide truncate">
                        {label}
                      </p>
                    </div>
                    <p className="text-xl font-extrabold text-[#1e293b]">
                      {total.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-woreda: Category / Target Allocated / Submitted table */}
          <WoredaAnalysisTable
            sector={sector}
            woredaId={activeWoreda}
            cfg={cfg}
          />

          {/* Ring charts — actual vs target for selected woreda */}
          <WorkAnalysisRingSection
            sector={sector}
            woredaId={activeWoreda}
            cfg={cfg}
          />
        </>
      )}
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
        <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mb-4 text-[#0f172a]">
          <TargetIcon />
        </div>
        <p className="text-[#1e293b] font-semibold mb-2">Coming Soon</p>
        <p className="text-[#94a3b8] text-sm max-w-xs">
          Annual plan management for <strong>{title}</strong> will be available
          here
        </p>
        <span className="mt-4 inline-block bg-[#eff6ff] text-[#0f172a] border border-[#dbeafe] text-xs font-semibold px-4 py-2 rounded-full">
          Under Development
        </span>
      </div>
    </div>
  );
}

// ─── Work Analysis Page ───────────────────────────────────────────────────────
// Routes all 6 sectors through GenericSubcityAnalysisPage.
function WorkAnalysisPage({ sector }) {
  return <GenericSubcityAnalysisPage sector={sector} />;
}
// ─── All Sectors (6) for Report History ──────────────────────────────────────
const REPORT_SECTORS_ALL = [
  { id: "buusaa", label: "Buusaa Gonofaa", color: "#0f172a" },
  { id: "carraaHojii", label: "Carraa Hojii Uumuu", color: "#1e40af" },
  { id: "qonna", label: "Qonna", color: "#065f46" },
  { id: "daldala", label: "Daldala", color: "#854d0e" },
  { id: "atk", label: "ATK", color: "#7e22ce" },
];

const REPORT_PERIOD_TYPES_SC = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annual",
];

// Fields to hide from the detail modal (system/internal columns)
const SC_HIDDEN_FIELDS = new Set([
  "id",
  "user_id",
  "username",
  "role",
  "_sector",
  "created_at",
  "updated_at",
]);

function scFieldLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function scGetDisplayFields(row) {
  return Object.entries(row).filter(
    ([k, v]) =>
      !SC_HIDDEN_FIELDS.has(k) &&
      k !== "report_date" &&
      k !== "report_type" &&
      v !== null &&
      v !== "",
  );
}

// Format a date string with time if created_at is available
function scFormatDateTime(row) {
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

function scDownloadCSV(row, sectorLabel) {
  const fields = scGetDisplayFields(row);
  const submittedAt = row.created_at
    ? new Date(row.created_at).toLocaleString()
    : (row.report_date ?? "");
  const rows = [
    ["Report Type", row.report_type ?? ""],
    ["Sector", sectorLabel],
    ["Submitted By", row.username ?? ""],
    ["Submitted At", submittedAt],
    ...fields.map(([k, v]) => [scFieldLabel(k), v]),
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

// ─── Report Detail Modal (subcity) ────────────────────────────────────────────
function SCReportDetailModal({ row, onClose }) {
  if (!row) return null;
  const sec = REPORT_SECTORS_ALL.find((s) => s.id === row._sector);
  const sectorLabel = sec?.label ?? row._sector ?? "Report";
  const accentColor = sec?.color ?? "#0f172a";
  const displayFields = scGetDisplayFields(row);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
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
              {row.username ?? ""} · {row.report_type ?? ""} ·{" "}
              {scFormatDateTime(row)}
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {sectorLabel}
            </span>
            {row.username && (
              <span className="text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 rounded-full">
                {row.username}
              </span>
            )}
            <span className="text-xs text-[#94a3b8]">
              Submitted {scFormatDateTime(row)}
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
                    {scFieldLabel(k)}
                  </span>
                  <span className="text-sm font-bold text-[#1e293b] ml-2">
                    {typeof v === "number" ? v.toLocaleString() : v}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
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

// ─── Shared sector field definitions for print tables ────────────────────────
const SECTOR_PRINT_FIELDS = {
  buusaa: [
    { key: "hubannoo_uummuu", label: "Hubannoo Uumuu" },
    { key: "horannaa_misensaa", label: "Horannaa Misensaa" },
    { key: "buusi_jiraataa", label: "Buusi Jiraataa" },
    { key: "gumaata_jiraataa", label: "Gumaata Jiraataa" },
    { key: "buusi_daldalaa", label: "Buusi fi Gumaata Daldalaa" },
    {
      key: "inisheetivii_buusaa_gonofaa",
      label: "Inisheetivii Buusaa Gonofaa",
    },
    { key: "gumaata_mootummaa", label: "Gumaata Midhaani (Kuntal)" },
    { key: "nyaata_barataa", label: "Nyaata Barataa" },
    { key: "sukkaara", label: "Sukkaara (KG)" },
    { key: "zayitii", label: "Zayitii (Litre)" },
  ],
  carraa: [
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
    { key: "furdisa_qophi_lafa", label: "Furdisa - Qophi Lafa" },
    { key: "furdisa_lakk_sheedii", label: "Furdisa - Lakk Sheedii" },
    { key: "furdisa_lakk_horii_waliigalaa", label: "Furdisa - Lakk Horii" },
    { key: "annan_qophi_lafa", label: "Annan - Qophi Lafa" },
    { key: "annan_lakk_sheedii", label: "Annan - Lakk Sheedii" },
    { key: "annan_lakk_saa_waliigalaa", label: "Annan - Lakk Sa'a" },
    { key: "lukkuu_qophi_lafa", label: "Lukkuu - Qophi Lafa" },
    { key: "lukkuu_lakk_sheedii", label: "Lukkuu - Lakk Sheedii" },
    { key: "lukkuu_lakk_lukkuu_waliigalaa", label: "Lukkuu - Lakk Lukkuu" },
    { key: "booyee_qophi_lafa", label: "Booyyee - Qophi Lafa" },
    { key: "booyee_lakk_sheedii", label: "Booyyee - Lakk Sheedii" },
    { key: "booyee_lakk_booyyee_waliigalaa", label: "Booyyee - Lakk Booyyee" },
    { key: "kannisaa_qophi_lafa", label: "Kannisaa - Qophi Lafa" },
    { key: "kannisaa_lakk_gaaguraa", label: "Kannisaa - Lakk Gaaguraa" },
    {
      key: "kannisaa_lakk_kannisaa_waliigalaa",
      label: "Kannisaa - Lakk Kannisaa",
    },
    { key: "qurxummii_qophi_lafa", label: "Qurxummii - Qophi Lafa" },
    { key: "qurxummii_lakk_pondii", label: "Qurxummii - Lakk Pondii" },
    {
      key: "qurxummii_lakk_qurxummii_waliigalaa",
      label: "Qurxummii - Lakk Qurxummii",
    },
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
  galii: [
    { key: "galii_idilee", label: "Galii Idilee" },
    { key: "galii_mana_qophessaa", label: "Galii Mana Qophessaa" },
  ],
};

// ─── Build print HTML for the subcity structured table ───────────────────────
// Returns a full HTML string ready to be written into a new window.
function buildSubcityPrintHTML({
  sector,
  period,
  showPct,
  showPlan,
  woredaData, // { woredas: [{woredaId, name, actuals}] }
  planData, // { w1: {targets}, w2: ..., w3: ..., w4: ... }
  generatedDate,
  selectedWoreda,      // "all" | "w1" | "w2" | "w3" | "w4"
  subcityGaliiActuals, // actuals object for subcity galii, or null
}) {
  const sectorLabel =
    REPORT_SECTORS_ALL.find((s) => s.id === sector)?.label ?? sector;
  const fields = SECTOR_PRINT_FIELDS[sector] ?? [];

  const ALL_WOREDAS_PRINT = [
    { id: "w1", name: "Aanaa Gooroo" },
    { id: "w2", name: "Aanaa Dhadacha Araaraa" },
    { id: "w3", name: "Aanaa Dhakaa Adii" },
    { id: "w4", name: "Aanaa Andoodee" },
  ];

  // Filter to selected woreda if one is chosen
  const WOREDAS_PRINT =
    selectedWoreda === "all"
      ? ALL_WOREDAS_PRINT
      : ALL_WOREDAS_PRINT.filter((w) => w.id === selectedWoreda);

  // For Galii only: show subcity column when "all woredas" is selected
  const showSubcityCol = sector === "galii" && selectedWoreda === "all";

  // Sub-columns order: Karora (plan), Raawwi (actual), % — always Karora first
  // Build sub-col definitions: we always show Raawwi; Karora/% are optional
  const subCols = [];
  if (showPlan) subCols.push({ key: "plan",   label: "Karora" });
  subCols.push(            { key: "actual", label: "Raawwi" });
  if (showPct)  subCols.push({ key: "pct",    label: "%" });
  const numSubCols = subCols.length;

  // Show total column only when all woredas are selected
  const showTotal = selectedWoreda === "all";

  // ── Header row 1: R.No | Gosa Hoji | [Woreda spans] | [Subcity?] | [Waliigala?]
  let thead = `<thead>
    <tr class="top-header">
      <th rowspan="2" class="rno">R.No</th>
      <th rowspan="2" class="gosa">Gosa Hoji</th>`;
  for (const w of WOREDAS_PRINT) {
    thead += `<th colspan="${numSubCols}" class="woreda-header">${w.name}</th>`;
  }
  if (showSubcityCol) {
    thead += `<th colspan="${numSubCols}" class="woreda-header subcity-header">Subcity</th>`;
  }
  if (showTotal) {
    thead += `<th colspan="${numSubCols}" class="woreda-header total-header">Waliigala</th>`;
  }
  thead += `</tr><tr class="sub-header">`;
  const totalGroupCount = WOREDAS_PRINT.length + (showSubcityCol ? 1 : 0) + (showTotal ? 1 : 0);
  for (let i = 0; i < totalGroupCount; i++) {
    for (const sc of subCols) {
      thead += `<th class="sub-col">${sc.label}</th>`;
    }
  }
  thead += `</tr></thead>`;

  // ── Body rows
  let tbody = "<tbody>";
  fields.forEach(({ key, label }, idx) => {
    tbody += `<tr>`;
    tbody += `<td class="rno">${idx + 1}</td>`;
    tbody += `<td class="gosa">${label}</td>`;

    let totalActual = 0;
    let totalPlan   = 0;

    for (const w of WOREDAS_PRINT) {
      const wEntry   = woredaData?.woredas?.find((d) => d.woredaId === w.id);
      const wActuals = wEntry?.actuals ?? {};
      const wTargets = planData?.[w.id] ?? {};
      const actual   = Number(wActuals[key] ?? 0);
      const target   = Number(wTargets[key] ?? 0);
      const pct      = target > 0 ? Math.round((actual / target) * 100) : 0;

      totalActual += actual;
      totalPlan   += target;

      for (const sc of subCols) {
        if (sc.key === "plan")   tbody += `<td class="num plan">${target.toLocaleString()}</td>`;
        if (sc.key === "actual") tbody += `<td class="num">${actual.toLocaleString()}</td>`;
        if (sc.key === "pct")    tbody += `<td class="num pct">${target > 0 ? pct + "%" : "—"}</td>`;
      }
    }

    // Subcity column (Galii + all-woredas only)
    if (showSubcityCol) {
      const scActual = Number(subcityGaliiActuals?.[key] ?? 0);
      totalActual += scActual;
      for (const sc of subCols) {
        if (sc.key === "plan")   tbody += `<td class="num plan">—</td>`;
        if (sc.key === "actual") tbody += `<td class="num subcity-val">${scActual.toLocaleString()}</td>`;
        if (sc.key === "pct")    tbody += `<td class="num pct">—</td>`;
      }
    }

    // Total column (all-woredas only)
    if (showTotal) {
      const totalPct = totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0;
      for (const sc of subCols) {
        if (sc.key === "plan")   tbody += `<td class="num plan total-val">${totalPlan.toLocaleString()}</td>`;
        if (sc.key === "actual") tbody += `<td class="num total-val">${totalActual.toLocaleString()}</td>`;
        if (sc.key === "pct")    tbody += `<td class="num pct total-val">${totalPlan > 0 ? totalPct + "%" : "—"}</td>`;
      }
    }

    tbody += `</tr>`;
  });
  tbody += "</tbody>";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${sectorLabel} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; background: #fff; padding: 16px; }

    .report-title { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #000; padding-bottom: 8px; }
    .report-title h1 { font-size: 14pt; font-weight: bold; }
    .meta { display: flex; justify-content: space-between; font-size: 8pt; color: #555; margin-bottom: 12px; }

    table { width: 100%; border-collapse: collapse; table-layout: auto; }
    th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: middle; }
    thead tr.top-header th { background: #fff; color: #000; text-align: center; font-size: 9pt; font-weight: bold; border: 1px solid #000; }
    thead tr.sub-header th { background: #f0f0f0; color: #000; text-align: center; font-size: 8pt; font-weight: bold; border: 1px solid #000; }
    th.rno, td.rno { text-align: center; width: 32px; font-size: 8pt; }
    th.gosa { text-align: left; min-width: 140px; }
    td.gosa { text-align: left; font-weight: 500; }
    td.num  { text-align: right; font-variant-numeric: tabular-nums; }
    td.pct  { text-align: right; }
    td.plan { text-align: right; color: #555; }
    td.total-val { font-weight: bold; background: #f0f4ff; }
    td.subcity-val { background: #f0fdf4; }
    th.total-header { background: #e8eeff !important; }
    th.subcity-header { background: #e8fff4 !important; }
    tbody tr:nth-child(even) { background: #f9f9f9; }

    @media print {
      body { padding: 0; }
      @page { size: landscape; margin: 12mm; }
      tbody tr:nth-child(even) { background: #f9f9f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      thead tr.sub-header th { background: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      td.total-val { background: #f0f4ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      td.subcity-val { background: #f0fdf4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      th.total-header { background: #e8eeff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      th.subcity-header { background: #e8fff4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="report-title">
    <h1>${sectorLabel} Report${selectedWoreda !== "all" ? " — " + (ALL_WOREDAS_PRINT.find(w => w.id === selectedWoreda)?.name ?? "") : ""}</h1>
  </div>
  <div class="meta">
    <span>Generated: ${generatedDate}</span>
    <span>Adama Sub-city Reporting System</span>
  </div>
  <table>
    ${thead}
    ${tbody}
  </table>
  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`;
}

// ─── SubcityPrintModal ────────────────────────────────────────────────────────
// Configuration dialog that collects options then opens a new print window.
function SubcityPrintModal({ rows, onClose }) {
  const [sector, setSector] = useState("buusaa");
  const [period, setPeriod] = useState("monthly");
  const [selectedWoreda, setSelectedWoreda] = useState("all"); // NEW
  const [showPct, setShowPct] = useState(true);
  const [showPlan, setShowPlan] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PERIODS_PRINT = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
  ];

  const handlePrint = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch actuals for all 4 woredas for the selected sector + period
      const woredaData = await fetchWoRedaReports(sector, period);

      // Fetch plan targets for all 4 woredas in parallel
      const planData = {};
      if (showPct || showPlan) {
        const wIds = ["w1", "w2", "w3", "w4"];
        const results = await Promise.all(
          wIds.map((wId) =>
            fetchWoRedaAnalysis(sector, wId, period).catch(() => null),
          ),
        );
        wIds.forEach((wId, i) => {
          planData[wId] = results[i]?.targets ?? {};
        });
      }

      // For Galii Sassaabu, also fetch subcity actuals
      let subcityGaliiActuals = null;
      if (sector === "galii") {
        try {
          const galiiRes = await fetchSubcityGalii(period);
          subcityGaliiActuals = galiiRes?.actuals ?? null;
        } catch {
          subcityGaliiActuals = null;
        }
      }

      const sectorLabel =
        REPORT_SECTORS_ALL.find((s) => s.id === sector)?.label ?? sector;
      const generatedDate = new Date().toLocaleString();

      const html = buildSubcityPrintHTML({
        sector,
        period,
        showPct,
        showPlan,
        woredaData,
        planData,
        generatedDate,
        selectedWoreda,
        subcityGaliiActuals,
      });

      const win = window.open("", "_blank", "width=1100,height=800");
      if (!win) {
        setError("Pop-up blocked. Please allow pop-ups for this site.");
        return;
      }
      win.document.write(html);
      win.document.close();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load data for print.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
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

        {/* Options */}
        <div className="px-6 py-5 space-y-4">
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
              {REPORT_SECTORS_ALL.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Woreda — NEW */}
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Woreda
            </label>
            <select
              value={selectedWoreda}
              onChange={(e) => setSelectedWoreda(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
              <option value="all">All Woredas</option>
              {WOREDAS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

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
              {PERIODS_PRINT.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1">
              Sub-columns per Woreda
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
              Sub-columns order: Karora, Raawwi, %.{" "}
              {showPct && showPlan
                ? "3 sub-columns per woreda."
                : showPct || showPlan
                  ? "2 sub-columns per woreda."
                  : "1 sub-column per woreda."}
            </p>
          </div>

          {error && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-2 flex items-center justify-between border-t border-[#f1f5f9]">
          <p className="text-[#94a3b8] text-xs">
            Opens in a new window. Use Ctrl+P or Cmd+P to save as PDF.
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
              disabled={loading}
              className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#0f172a] disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
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

// ─── Woreda Reports / Report History Page (Subcity) ───────────────────────────
function ReportsPage() {
  // ── state ──────────────────────────────────────────────────────────────────
  const [allRows, setAllRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [fWoreda, setFWoreda] = useState("all");
  const [fSector, setFSector] = useState("all");
  const [fPeriod, setFPeriod] = useState("all");
  const [isCustom, setIsCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [customDateErr, setCustomDateErr] = useState("");
  const [appliedRange, setAppliedRange] = useState(null);
  const [modalRow, setModalRow] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // ── period helpers ─────────────────────────────────────────────────────────
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const getPeriodRange = (p) => {
    if (p === "Daily")    return { from: todayStr, to: todayStr };
    if (p === "Weekly")   { const d = new Date(now); d.setDate(d.getDate()-6); return { from: d.toISOString().split("T")[0], to: todayStr }; }
    if (p === "Monthly")  return { from: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`, to: todayStr };
    if (p === "Quarterly"){ const qs = Math.floor(now.getMonth()/3)*3; return { from: `${now.getFullYear()}-${String(qs+1).padStart(2,"0")}-01`, to: todayStr }; }
    if (p === "Annual")   return { from: `${now.getFullYear()}-01-01`, to: todayStr };
    return null;
  };

  // ── load — server-side filtering ───────────────────────────────────────────
  const loadReports = useCallback((woreda, sector, period, custom, range) => {
    setLoading(true);
    setFetchError("");

    const filters = {};
    if (woreda !== "all")  filters.username = woreda;
    if (sector !== "all")  filters.sector   = sector;

    if (!custom && period !== "all") {
      const r = getPeriodRange(period);
      if (r) { filters.date_from = r.from; filters.date_to = r.to; }
    } else if (custom && range) {
      filters.date_from = range.from;
      filters.date_to   = range.to;
    }

    fetchAllWoredaReports(filters)
      .then((data) => {
        const rows = Array.isArray(data) ? data : [];
        setAllRows(rows);
        // Keep a separate unfiltered total only on the initial "all" fetch
        if (woreda === "all" && sector === "all" && period === "all" && !custom) {
          setTotalCount(rows.length);
        }
      })
      .catch(() => setFetchError("No connection. Check your internet and try again."))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch unfiltered total once on mount, then filtered results whenever filters change
  useEffect(() => {
    fetchAllWoredaReports({})
      .then((data) => setTotalCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadReports(fWoreda, fSector, fPeriod, isCustom, appliedRange);
  }, [fWoreda, fSector, fPeriod, isCustom, appliedRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // shown === allRows because filtering is now done server-side
  const shown = allRows;

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleApplyCustom = () => {
    if (!customFrom || !customTo) { setCustomDateErr("Select both dates."); return; }
    if (customFrom > customTo)    { setCustomDateErr("Start must be before end."); return; }
    setCustomDateErr("");
    setAppliedRange({ from: customFrom, to: customTo });
  };

  const handlePeriodChange = (val) => {
    if (val === "custom") {
      setIsCustom(true); setFPeriod("all"); setAppliedRange(null);
      setCustomFrom(""); setCustomTo(""); setCustomDateErr("");
    } else {
      setIsCustom(false); setAppliedRange(null); setFPeriod(val);
    }
  };

<<<<<<< Updated upstream
  const activeSectorColor =
    filterSector === "all"
      ? "#0f172a"
      : (REPORT_SECTORS_ALL.find((s) => s.id === filterSector)?.color ??
        "#0f172a");
=======
  const handleRetry = () => loadReports(fWoreda, fSector, fPeriod, isCustom, appliedRange);
>>>>>>> Stashed changes

  const accentColor = fSector === "all"
    ? "#1a3a5c"
    : (REPORT_SECTORS_ALL.find((s) => s.id === fSector)?.color ?? "#1a3a5c");

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {modalRow && <SCReportDetailModal row={modalRow} onClose={() => setModalRow(null)} />}
      {showPrintModal && <SubcityPrintModal rows={shown} onClose={() => setShowPrintModal(false)} />}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">Woreda Reports</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Filter by woreda, sector, period, or a custom date range.
          </p>
        </div>
<<<<<<< Updated upstream
        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#0f172a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
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
=======
        <button onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#122840] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1"/>
>>>>>>> Stashed changes
          </svg>
          Download Report
        </button>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#dc2626] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <p className="text-[#991b1b] text-sm">{fetchError}</p>
          <button onClick={handleRetry} className="ml-auto text-xs font-semibold text-[#dc2626] underline">Retry</button>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">

          {/* Woreda */}
          <div className="flex-1 min-w-[160px]">
<<<<<<< Updated upstream
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Woreda
            </label>
            <select
              value={filterWoreda}
              onChange={(e) => setFilterWoreda(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
=======
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">Woreda</label>
            <select value={fWoreda} onChange={(e) => setFWoreda(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20">
>>>>>>> Stashed changes
              <option value="all">All Woredas</option>
              {WOREDAS.map((w) => <option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
          </div>

          {/* Sector */}
          <div className="flex-1 min-w-[160px]">
<<<<<<< Updated upstream
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Sector
            </label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
=======
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">Sector</label>
            <select value={fSector} onChange={(e) => setFSector(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20">
>>>>>>> Stashed changes
              <option value="all">All Sectors</option>
              {REPORT_SECTORS_ALL.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {/* Period */}
          <div className="flex-1 min-w-[140px]">
<<<<<<< Updated upstream
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Period
            </label>
            <select
              value={isCustom ? "custom" : filterPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
            >
=======
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">Period</label>
            <select value={isCustom ? "custom" : fPeriod} onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20">
>>>>>>> Stashed changes
              <option value="all">All Periods</option>
              {REPORT_PERIOD_TYPES_SC.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Count */}
          <div className="flex-shrink-0 pb-0.5">
<<<<<<< Updated upstream
            <span className="inline-block bg-[#eff6ff] text-[#0f172a] text-xs font-semibold px-3 py-2.5 rounded-lg border border-[#dbeafe]">
              {loading
                ? "..."
                : `${filteredRows.length} result${filteredRows.length !== 1 ? "s" : ""}`}
=======
            <span className="inline-block bg-[#eef4fb] text-[#1a3a5c] text-xs font-semibold px-3 py-2.5 rounded-lg border border-[#dce8f4]">
              {loading ? "..." : `${shown.length} result${shown.length !== 1 ? "s" : ""}`}
>>>>>>> Stashed changes
            </span>
          </div>
        </div>

        {/* Custom date range */}
        {isCustom && (
          <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Custom Date Range</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
<<<<<<< Updated upstream
                <label className="block text-xs font-medium text-[#64748b] mb-1">
                  Fiscal Year
                </label>
                <input
                  type="number"
                  value={customFiscal}
                  onChange={(e) => setCustomFiscal(Number(e.target.value))}
                  min="2000"
                  max="2100"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
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
                    className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f8fafc] focus:outline-none"
                  >
                    {OROMO_MONTHS_SC.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={startDay}
                    onChange={(e) => setStartDay(Number(e.target.value))}
                    className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f8fafc] focus:outline-none"
                  >
                    {OROMO_DAYS_SC.map((d) => (
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
                    className="flex-1 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f8fafc] focus:outline-none"
                  >
                    {OROMO_MONTHS_SC.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endDay}
                    onChange={(e) => setEndDay(Number(e.target.value))}
                    className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-2 text-sm bg-[#f8fafc] focus:outline-none"
                  >
                    {OROMO_DAYS_SC.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
=======
                <label className="block text-xs font-medium text-[#64748b] mb-1">Start Date</label>
                <input type="date" value={customFrom}
                  onChange={(e) => { setCustomFrom(e.target.value); setAppliedRange(null); }}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1">End Date</label>
                <input type="date" value={customTo}
                  onChange={(e) => { setCustomTo(e.target.value); setAppliedRange(null); }}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-[#f4f6f9] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"/>
>>>>>>> Stashed changes
              </div>
            </div>
            {customDateErr && <p className="text-[#dc2626] text-xs mb-2">{customDateErr}</p>}
            {appliedRange && (
              <p className="text-[#16a34a] text-xs mb-2 font-medium">
                Showing: {appliedRange.from} → {appliedRange.to}
              </p>
            )}
<<<<<<< Updated upstream
            <button
              onClick={handleApplyCustom}
              className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#0f172a] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            >
=======
            <button onClick={handleApplyCustom}
              className="flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#122840] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">
>>>>>>> Stashed changes
              <AnalysisIcon />
              Apply Date Range
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between"
          style={{ background: `linear-gradient(90deg,${accentColor} 0%,${accentColor}cc 100%)` }}>
          <div>
            <p className="text-sm font-semibold text-white">
              {isCustom && appliedRange
                ? `Reports ${appliedRange.from} → ${appliedRange.to}`
                : fSector !== "all"
                  ? `${REPORT_SECTORS_ALL.find((s) => s.id === fSector)?.label ?? fSector} Reports`
                  : fWoreda !== "all"
                    ? `${fWoreda} Reports`
                    : "All Woreda Reports"}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {loading ? "Loading..." : `${shown.length} report${shown.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {!loading && !fetchError && (
            <span className="text-white/60 text-xs">{totalCount} total</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
<<<<<<< Updated upstream
            <div className="w-6 h-6 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
=======
            <div className="w-6 h-6 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin"/>
>>>>>>> Stashed changes
            <span className="text-sm text-[#64748b]">Loading reports...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  {["Date","Submitted By","Sector","Report Type","Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
<<<<<<< Updated upstream
                        <div className="w-10 h-10 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8]">
                          <ListIcon />
                        </div>
                        <p className="text-[#94a3b8] text-sm">
                          No reports match the selected filters.
                        </p>
                        {rows.length === 0 && !fetchError && (
                          <p className="text-[#94a3b8] text-xs">
                            Reports submitted by woreda users will appear here.
                          </p>
=======
                        <div className="w-10 h-10 rounded-full bg-[#f4f6f9] flex items-center justify-center text-[#94a3b8]"><ListIcon/></div>
                        <p className="text-[#94a3b8] text-sm">No reports match the selected filters.</p>
                        {totalCount === 0 && !fetchError && (
                          <p className="text-[#94a3b8] text-xs">Reports submitted by woreda users will appear here.</p>
>>>>>>> Stashed changes
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  shown.map((row, idx) => {
                    const sec = REPORT_SECTORS_ALL.find((s) => s.id === row._sector);
                    return (
                      <tr key={row.id ?? `${row._sector}-${idx}`}
                        className="border-b border-gray-50 hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[#475569] text-sm">{scFormatDateTime(row)}</td>
                        <td className="px-5 py-3 text-sm font-medium text-[#1e293b]">{row.username ?? ""}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sec?.color ?? "#64748b" }}/>
                            <span className="text-sm font-medium text-[#1e293b]">{sec?.label ?? row._sector}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-[#475569]">{row.report_type ?? ""}</td>
                        <td className="px-5 py-3">
<<<<<<< Updated upstream
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
=======
                          <button onClick={() => setModalRow(row)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#1a3a5c] hover:text-[#1e4976] bg-[#eef4fb] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            View
                          </button>
>>>>>>> Stashed changes
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
  const [dbQonnaPlan, setDbQonnaPlan] = useState(null);
  const [dbGaliiPlan, setDbGaliiPlan] = useState(null);
  const [dbCarraPlan, setDbCarraPlan] = useState(null);
  const [dbDaldalaPlan, setDbDaldalaPlan] = useState(null);
  const [dbAtkPlan, setDbAtkPlan] = useState(null);

  useEffect(() => {
    fetchSubcityOwnPlan()
      .then((d) => setDbPlan(d.plan))
      .catch(() => setDbPlan(null))
      .finally(() => setPlanLoading(false));
    fetchSubcityQonnaPlan()
      .then((d) => setDbQonnaPlan(d.plan))
      .catch(() => setDbQonnaPlan(null));
    fetchSubcityGenericPlan("galii")
      .then((d) => setDbGaliiPlan(d.plan))
      .catch(() => setDbGaliiPlan(null));
    fetchSubcityGenericPlan("carraa")
      .then((d) => setDbCarraPlan(d.plan))
      .catch(() => setDbCarraPlan(null));
    fetchSubcityGenericPlan("daldala")
      .then((d) => setDbDaldalaPlan(d.plan))
      .catch(() => setDbDaldalaPlan(null));
    fetchSubcityGenericPlan("atk")
      .then((d) => setDbAtkPlan(d.plan))
      .catch(() => setDbAtkPlan(null));
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
            <div className="w-8 h-8 border-4 border-[#dbeafe] border-t-[#0f172a] rounded-full animate-spin" />
          </div>
        );
      return (
        <OverviewPage
          dbPlan={dbPlan}
          dbQonnaPlan={dbQonnaPlan}
          dbGaliiPlan={dbGaliiPlan}
          dbCarraPlan={dbCarraPlan}
          dbDaldalaPlan={dbDaldalaPlan}
          dbAtkPlan={dbAtkPlan}
          u={u}
        />
      );
    }
    if (activeNav === "reports") return <ReportsPage />;
    if (activeNav === "galii_submit") return <SubcityGaliiSubmitForm u={u} />;
    if (activeNav === "announcements") return <AnnouncementsPage />;
    if (activeNav === "archive") return <ArchivePlansSection />;
    if (activeNav === "profile") return <SubcityProfilePage user={JSON.parse(localStorage.getItem("user") || "null")} />;
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
                  className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-6 text-left hover:border-[#0f172a]/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-[#1e293b]">{s.label}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    {s.id === "buusaa" ||
                    s.id === "qonna" ||
                    s.id === "galii" ||
                    s.id === "carraa" ||
                    s.id === "daldala" ||
                    s.id === "atk"
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
      if (
        activePlanSector === "galii" ||
        activePlanSector === "carraa" ||
        activePlanSector === "daldala" ||
        activePlanSector === "atk"
      )
        return <GenericSubcityPlanPage sector={activePlanSector} />;
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
              Select a sector to view analysis.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveAnalysisSector(s.id);
                    setAnalysisOpen(true);
                  }}
                  className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-6 text-left hover:border-[#0f172a]/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-[#1e293b]">{s.label}</p>
                  <p className="text-xs text-[#94a3b8] mt-1">Active</p>
                </button>
              ))}
            </div>
          </div>
        );
      return <WorkAnalysisPage sector={activeAnalysisSector} />;
    }
    return null;
  };

  return (
    <div
      className="flex h-screen max-h-screen bg-[#f8fafc] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`${sideW} flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden`}
        style={{
          background: "linear-gradient(180deg,#0f172a 0%,#020617 100%)",
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

          {/* ── Galii Sassaabu (subcity revenue submit) — between Plan and Analysis ── */}
          <button
            onClick={() => {
              setActiveNav("galii_submit");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "galii_submit"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <RevenueNavIcon />
            {!collapsed && <span className="truncate">Galii Sassaabu</span>}
          </button>

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

          {/* Announcements */}
          <button
            onClick={() => {
              setActiveNav("announcements");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "announcements"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MegaphoneIcon />
            {!collapsed && <span className="truncate">Announcements</span>}
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setActiveNav("profile");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "profile"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ProfileNavIcon />
            {!collapsed && <span className="truncate">Profile</span>}
          </button>

          {/* Archive Annual Plans */}
          <button
            onClick={() => {
              setActiveNav("archive");
              setActivePlanSector(null);
              setActiveAnalysisSector(null);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === "archive"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ArchiveNavIcon />
            {!collapsed && <span className="truncate">Archive Plans</span>}
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

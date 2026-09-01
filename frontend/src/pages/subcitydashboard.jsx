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
  saveSubcityGaliiPlan,
  fetchSubcityGaliiPlan,
  saveSubcityGaliiSassabuPlan,
  fetchSubcityGaliiSassabuPlan,
  fetchWoRedaReports,
  fetchWoRedaAnalysis,
  fetchSubcityGalii,
  createAnnouncement,
  fetchAnnouncements,
  deleteAnnouncement,
  fetchAllPhotos,
  fetchLatestPhotosPerWoreda,
  fetchArchivedPlans,
  fetchSubcityLivePlans,
} from "../api/planApi";
import {
  fetchAllWoredaReports,
  submitSubcityRevenueReport,
  fetchAllWoredaReportsByFiscalYear,
  currentFiscalYear,
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

// ─── Buusaa plan fields distributed by percentage across woredas ─────────────
const PLAN_FIELDS = [
  { key: "hubannoo_uummuu", label: "Hubannoo Uumuu", color: "#0f766e" },
  { key: "horannaa_misensaa", label: "Horannaa Misensaa", color: "#1e40af" },
  { key: "buusi_jiraataa", label: "Buusi Jiraataa", color: "#475569" },
  { key: "gumaata_jiraataa", label: "Gumaata Jiraataa", color: "#64748b" },
  {
    key: "inisheetivii_buusaa_gonofaa",
    label: "Inisheetivii Buusaa Gonofaa",
    color: "#b45309",
  },
  {
    key: "gumaata_midhaani_tarsiimoo",
    label: "Gumaata Midhaani Tarsiimoo",
    color: "#0f766e",
  },
  {
    key: "gumaata_midhaani_sardamaa",
    label: "Gumaata Midhaani Sardamaa",
    color: "#7c3aed",
  },
];

// Fixed per-woreda fields — each woreda gets its own number (no percentage split)
const FIXED_WEREDA_FIELDS = [
  { key: "nyaata_barataa", label: "Nyaata Barataa", color: "#0369a1" },
  { key: "sukkaara", label: "Sukkaara (KG)", color: "#ea580c" },
  { key: "zayitii", label: "Zayitii (Litre)", color: "#65a30d" },
  {
    key: "daldala_b_group_a",
    label: "Daldala B – Group A (×4,200)",
    color: "#0369a1",
  },
  {
    key: "daldala_b_group_b",
    label: "Daldala B – Group B (×8,700)",
    color: "#b45309",
  },
];

const EMPTY_PLAN = {
  // distributed
  hubannoo_uummuu: "",
  horannaa_misensaa: "",
  buusi_jiraataa: "",
  gumaata_jiraataa: "",
  inisheetivii_buusaa_gonofaa: "",
  gumaata_midhaani_tarsiimoo: "",
  gumaata_midhaani_sardamaa: "",
  // subcity-only
  daldala_a: "",
};

// Empty fixed-per-woreda form: { fieldKey: { w1:"", w2:"", w3:"", w4:"" } }
const EMPTY_FIXED = Object.fromEntries(
  FIXED_WEREDA_FIELDS.map(({ key }) => [
    key,
    { w1: "", w2: "", w3: "", w4: "" },
  ]),
);

// Sectors used in Annual Plan and Work Analysis dropdowns
const SECTORS = [
  { id: "buusaa", label: "Buusaa Gonofaa" },
  { id: "qonna", label: "Qonna" },
  { id: "galii", label: "Galii Sassaabu" },
  { id: "carraa", label: "Carraa Hojii Uumuu" },
  { id: "daldala", label: "Daldala" },
  { id: "atk", label: "ATK" },
  { id: "galii_sassabu", label: "Galii Sassabu" },
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
    color: "#78350f",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
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
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ArchiveNavIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const EyeIconSC = ({ show }) =>
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
const CameraIconSC = () => (
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
const UnlockNavIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

// ─── Subcity Profile Page ─────────────────────────────────────────────────────
function SubcityProfilePage({ user, onPhotoUpdate }) {
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

  const ROLE_COLORS_SC = {
    wereda: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
    "sub-city": "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
    admin: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  };

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
                {(u.username || "SC")[0].toUpperCase()}
              </div>
            )}
            <label
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a3a5c] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[#1e4976] transition-colors"
              title="Change photo"
            >
              <CameraIconSC />
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
              {u.username || "Sub-city"}
            </p>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS_SC[u.role] ?? "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]"}`}
            >
              {u.role || "sub-city"}
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
            { label: "Username", value: u.username || "—" },
            { label: "Role", value: u.role || "sub-city" },
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
            <CheckIcon />
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
                <EyeIconSC show={showOld} />
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
                <EyeIconSC show={showNew} />
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

// ─── Plan Unlock Request Banner ───────────────────────────────────────────────
// Posts to /auth/plan-unlock-requests (the dedicated plan_unlock_requests table).
// Keyed on sector + plan_year so it never touches the edit_requests table.
function PlanUnlockBanner({ sector }) {
  const [status, setStatus] = useState(null); // null | "pending" | "approved" | "denied" | "expired"
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const planYear = (() => {
    const now = new Date();
    return now.getMonth() + 1 > 7 ||
      (now.getMonth() + 1 === 7 && now.getDate() >= 8)
      ? now.getFullYear()
      : now.getFullYear() - 1;
  })();

  const authHdr = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const apiInst = (await import("../api/api")).default;
      const res = await apiInst.get(
        "/auth/plan-unlock-requests/mine",
        authHdr(),
      );
      const reqs = res.data.requests || [];

      // Check for expired requests first (auto-expire by comparing dates)
      const now = new Date();
      const mine = reqs.find(
        (r) => r.sector === sector && r.plan_year === planYear,
      );

      if (mine) {
        // Treat as expired if past expiry
        if (
          mine.expires_at &&
          new Date(mine.expires_at) < now &&
          mine.status === "pending"
        ) {
          setStatus("expired");
        } else {
          setStatus(mine.status);
        }
        setExpiresAt(mine.expires_at || null);
      } else {
        setStatus(null);
        setExpiresAt(null);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [sector, planYear]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRequest = async () => {
    if (!reason.trim()) {
      setError("Please enter a reason for the request.");
      return;
    }
    setRequesting(true);
    setError("");
    try {
      const apiInst = (await import("../api/api")).default;
      await apiInst.post(
        "/auth/plan-unlock-requests",
        { sector, plan_year: planYear, reason: reason.trim() },
        authHdr(),
      );
      setStatus("pending");
      setShowForm(false);
      setReason("");
      setSuccess("Request sent. The admin will review and grant access.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit request.";
      if (msg.toLowerCase().includes("approved")) {
        fetchStatus();
      } else {
        setError(msg);
      }
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return null;

  // ── Approved ──
  if (status === "approved") {
    return (
      <div className="mb-5 flex items-center gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
        <CheckIcon />
        <p className="text-[#92400e] text-sm font-medium">
          Plan alter approved. You can now re-save this plan.
        </p>
      </div>
    );
  }

  // ── Pending ──
  if (status === "pending") {
    return (
      <div className="mb-5 bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3 flex items-center gap-3">
        <svg
          className="w-4 h-4 text-[#b45309] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <div>
          <p className="text-[#92400e] text-sm font-medium">
            Plan alter request pending admin approval.
          </p>
          <p className="text-[#78350f] text-xs mt-0.5">
            You can re-save the plan once the admin approves.
            {expiresAt &&
              ` Expires ${new Date(expiresAt).toLocaleDateString()}.`}
          </p>
        </div>
      </div>
    );
  }

  // ── Denied or expired — show request form ──
  return (
    <div className="mb-5">
      {(status === "denied" || status === "expired") && (
        <div className="mb-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
          <p className="text-[#991b1b] text-sm font-medium">
            {status === "denied"
              ? "Previous request was denied."
              : "Previous request expired."}
          </p>
          <p className="text-[#94a3b8] text-xs mt-0.5">
            You can submit a new request below.
          </p>
        </div>
      )}

      {success && (
        <div className="mb-3 flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
          <CheckIcon />
          <p className="text-xs font-medium text-[#92400e]">{success}</p>
        </div>
      )}

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
              {status === "denied" || status === "expired"
                ? "Request a new plan alter"
                : "Want to update this annual plan?"}
            </p>
            <p className="text-xs text-[#92400e] mt-0.5">
              Admin approval is required to re-save a locked annual plan.
            </p>
          </div>
        </div>

        {error && <p className="text-xs text-[#dc2626]">{error}</p>}

        {!showForm && !success ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="self-start flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <UnlockNavIcon />
            Request Edit Access
          </button>
        ) : showForm ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for requesting plan alter access…"
              rows={2}
              maxLength={300}
              className="w-full border border-[#fde68a] rounded-lg px-3 py-2 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 resize-none bg-white"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequest}
                disabled={requesting}
                className="flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              >
                <UnlockNavIcon />
                {requesting ? "Sending..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                  setReason("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Daldala A — Subcity-only submit form and analysis ───────────────────────
const DALDALA_A_PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

function DaldalASubmitForm() {
  const [reportType, setReportType] = useState("Daily Report (Gabaasa Guyyaa)");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [count, setCount] = useState(""); // user enters count
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const storedBirr = Number(count || 0) * 17400;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!count || Number(count) <= 0) {
      setError("Enter a valid count greater than 0.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const apiInst = (await import("../api/api")).default;
      await apiInst.post(
        "/subcity/daldala-a",
        {
          report_date: reportDate,
          report_type: reportType,
          lakk_daldala_a: Number(count),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setSuccess(true);
      setCount("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Daldala A</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Submit Daldala A report. Count is stored as count × 17,400 Birr.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        {/* Report type */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
          <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
          >
            {[
              "Daily Report (Gabaasa Guyyaa)",
              "Weekly Report (Gabaasa Torban)",
              "Monthly Report (Gabaasa Ji'aa)",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4">
          <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">
            Report Date
          </label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
          />
        </div>

        {/* Count input */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-5">
          <div
            className="px-5 py-3 -mx-5 -mt-5 mb-5 rounded-t-xl border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Daldala A (×17,400)
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Enter count — stored as count × 17,400 Birr
            </p>
          </div>

          <label className="block text-sm font-medium text-[#334155] mb-1.5">
            Lakk Daldala A <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => {
              setCount(e.target.value);
              setError("");
            }}
            placeholder="0"
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
          />
          {Number(count) > 0 && (
            <p className="text-xs text-[#64748b] mt-1.5">
              ={" "}
              <span className="font-semibold text-[#0f172a]">
                {storedBirr.toLocaleString()} Birr
              </span>{" "}
              will be stored
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 text-[#166534] text-sm">
            <CheckIcon /> Report submitted successfully.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !count}
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e3a5f] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon /> Submit Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function DaldalAAnalysisPage() {
  const [period, setPeriod] = useState("monthly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHdr = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    import("../api/api").then(({ default: apiInst }) =>
      apiInst
        .get(`/subcity/daldala-a?period=${period}`, authHdr)
        .then((res) => setData(res.data))
        .catch((err) =>
          setError(friendlyError(err, "Failed to load Daldala A data.")),
        )
        .finally(() => setLoading(false)),
    );
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const periodLabel =
    DALDALA_A_PERIODS.find((p) => p.value === period)?.label ?? "";
  const ACCENT = "#0f172a";

  const partitionDaldalA = (annual, p) => {
    if (!annual) return 0;
    const d = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, annual: 1 };
    return Math.round(annual / (d[p] ?? 1));
  };

  // Divisor: both stored values and plan target are count × 17400 → show base count
  const DA_DIV = 17400;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
            Daldala A — Work Analysis
          </h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Subcity Daldala A performance vs annual plan.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 shadow-sm">
          <AnalysisIcon />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-[#334155] font-medium bg-transparent focus:outline-none cursor-pointer"
          >
            {DALDALA_A_PERIODS.map((p) => (
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
          {/* Banner */}
          <div className="mb-5 bg-[#eff6ff] border border-[#dbeafe] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wide">
              {periodLabel} View
            </span>
            <span className="text-[#0f172a] text-xs">
              — Targets partitioned from annual plan
            </span>
          </div>

          {/* Ring charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {[
              { key: "lakk_daldala_a", label: "Lakk Daldala A", color: ACCENT },
            ].map(({ key, label, color }) => {
              const annual = Math.round((data?.target || 0) / DA_DIV);
              const pt = partitionDaldalA(annual, period);
              const ac = Math.round((data?.actuals?.[key] ?? 0) / DA_DIV);
              return (
                <RingChart
                  key={key}
                  actual={ac}
                  target={pt}
                  color={color}
                  label={label}
                  description=""
                />
              );
            })}
          </div>

          {/* Summary table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
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
                      "Metric",
                      "Annual Target",
                      "Period Target",
                      "Actual",
                      "% Complete",
                      "Remaining",
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
                  {[
                    {
                      key: "lakk_daldala_a",
                      label: "Lakk Daldala A",
                      color: ACCENT,
                    },
                  ].map(({ key, label, color }) => {
                    const annual = Math.round((data?.target || 0) / DA_DIV);
                    const pt = partitionDaldalA(annual, period);
                    const ac = Math.round((data?.actuals?.[key] ?? 0) / DA_DIV);
                    const acYtd = Math.round(
                      (data?.actualsYtd?.[key] ?? 0) / DA_DIV,
                    );
                    const pct = pt > 0 ? Math.round((ac / pt) * 100) : 0;
                    const elapsed = data?.daysElapsed ?? 1;
                    const cumul = Math.round((elapsed / 365) * annual);
                    const remaining = Math.max(cumul - acYtd, 0);
                    return (
                      <tr
                        key={key}
                        className="border-b border-gray-50 hover:bg-[#f8fafc]"
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
                          {annual.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-[#64748b]">
                          {pt.toLocaleString()}
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
                            <span className="text-xs font-semibold text-[#dc2626]">
                              {remaining.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#d97706]">
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

// ─── History helpers ──────────────────────────────────────────────────────────

/** fiscal year that starts on July 8 of `y` */
function histFiscalYear() {
  const n = new Date();
  return n.getMonth() + 1 > 7 || (n.getMonth() + 1 === 7 && n.getDate() >= 8)
    ? n.getFullYear()
    : n.getFullYear() - 1;
}

/** "YYYY-MM-DD" range for fiscal year starting July 8 of `y` */
function histFiscalRange(y) {
  return { from: `${y}-07-08`, to: `${y + 1}-07-07` };
}

/** Download all records for a fiscal year as one CSV */
function downloadRecordsCSV(rows, fiscalYear) {
  if (!rows.length) return;
  const hidden = new Set([
    "id",
    "user_id",
    "created_at",
    "updated_at",
    "_sector",
  ]);
  const keys = [];
  const seen = new Set();
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => {
      if (!hidden.has(k) && !seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }),
  );
  const esc = (c) => `"${String(c ?? "").replace(/"/g, '""')}"`;
  const header = [
    "Sector",
    "Woreda",
    ...keys.map((k) =>
      k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    ),
  ];
  const body = rows.map((r) => {
    const sec = REPORT_SECTORS_ALL.find((s) => s.id === r._sector);
    return [
      esc(sec?.label ?? r._sector ?? ""),
      esc(r.username ?? ""),
      ...keys.map((k) => esc(r[k])),
    ].join(",");
  });
  const csv = [header.map(esc).join(","), ...body].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  a.download = `records_${fiscalYear}-${fiscalYear + 1}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Human-readable label for a subcity plan source_table name */
function planTableLabel(t) {
  const map = {
    subcity_buusaa_gonofaa_plan: "Subcity – Buusaa Gonofaa",
    subcity_qonna_plan: "Subcity – Qonna",
    subcity_carraa_plan: "Subcity – Carraa Hojii",
    subcity_daldala_plan: "Subcity – Daldala",
    subcity_atk_plan: "Subcity – ATK",
    subcity_galii_plan: "Subcity – Galii",
    annual_plan_wereda_1: "Aanaa Gooroo – Buusaa",
    annual_plan_wereda_2: "Aanaa Dhadacha Araaraa – Buusaa",
    annual_plan_wereda_3: "Aanaa Dhakaa Adii – Buusaa",
    annual_plan_wereda_4: "Aanaa Andoodee – Buusaa",
    annual_qonna_plan_wereda_1: "Aanaa Gooroo – Qonna",
    annual_qonna_plan_wereda_2: "Aanaa Dhadacha Araaraa – Qonna",
    annual_qonna_plan_wereda_3: "Aanaa Dhakaa Adii – Qonna",
    annual_qonna_plan_wereda_4: "Aanaa Andoodee – Qonna",
    annual_carraa_plan_wereda_1: "Aanaa Gooroo – Carraa",
    annual_carraa_plan_wereda_2: "Aanaa Dhadacha Araaraa – Carraa",
    annual_carraa_plan_wereda_3: "Aanaa Dhakaa Adii – Carraa",
    annual_carraa_plan_wereda_4: "Aanaa Andoodee – Carraa",
    annual_daldala_plan_wereda_1: "Aanaa Gooroo – Daldala",
    annual_daldala_plan_wereda_2: "Aanaa Dhadacha Araaraa – Daldala",
    annual_daldala_plan_wereda_3: "Aanaa Dhakaa Adii – Daldala",
    annual_daldala_plan_wereda_4: "Aanaa Andoodee – Daldala",
    annual_atk_plan_wereda_1: "Aanaa Gooroo – ATK",
    annual_atk_plan_wereda_2: "Aanaa Dhadacha Araaraa – ATK",
    annual_atk_plan_wereda_3: "Aanaa Dhakaa Adii – ATK",
    annual_atk_plan_wereda_4: "Aanaa Andoodee – ATK",
    annual_galii_plan_wereda_1: "Aanaa Gooroo – Galii",
    annual_galii_plan_wereda_2: "Aanaa Dhadacha Araaraa – Galii",
    annual_galii_plan_wereda_3: "Aanaa Dhakaa Adii – Galii",
    annual_galii_plan_wereda_4: "Aanaa Andoodee – Galii",
    subcity_galii_sassabu_plan: "Subcity – Galii Sassabu",
    annual_galii_sassabu_plan_wereda_1: "Aanaa Gooroo – Galii Sassabu",
    annual_galii_sassabu_plan_wereda_2:
      "Aanaa Dhadacha Araaraa – Galii Sassabu",
    annual_galii_sassabu_plan_wereda_3: "Aanaa Dhakaa Adii – Galii Sassabu",
    annual_galii_sassabu_plan_wereda_4: "Aanaa Andoodee – Galii Sassabu",
  };
  return (
    map[t] ?? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Download a single plan row as CSV */
function downloadPlanCSV(archiveRow) {
  const data = archiveRow.data ?? {};
  const label = planTableLabel(archiveRow.source_table);
  const hidden = new Set(["id", "year", "created_at", "updated_at"]);
  const esc = (c) => `"${String(c ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["Plan", label],
    ["Fiscal Year", `${archiveRow.plan_year}–${archiveRow.plan_year + 1}`],
    [],
    ["Field", "Value"],
    ...Object.entries(data)
      .filter(([k]) => !hidden.has(k))
      .map(([k, v]) => [
        k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        v ?? "",
      ]),
  ];
  const csv = rows
    .map((r) => (r.length ? r.map(esc).join(",") : ""))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  a.download = `plan_${archiveRow.source_table}_${archiveRow.plan_year}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── History Section ──────────────────────────────────────────────────────────
function HistorySection() {
  const thisFY = histFiscalYear();

  // ── year filter ────────────────────────────────────────────────────────────
  const [selectedYear, setSelectedYear] = useState(thisFY);
  const [yearOptions, setYearOptions] = useState([thisFY]);

  // ── plans (archived + live) ────────────────────────────────────────────────
  const [planRows, setPlanRows] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  // ── woreda records ─────────────────────────────────────────────────────────
  const [records, setRecords] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [recError, setRecError] = useState("");
  const [modalRow, setModalRow] = useState(null);
  const [fWoreda, setFWoreda] = useState("all");
  const [fSector, setFSector] = useState("all");

  // ── archive & reset ────────────────────────────────────────────────────────
  const [showArchive, setShowArchive] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [archiveMsg, setArchiveMsg] = useState("");
  const [archiveErr, setArchiveErr] = useState("");

  const authHdr = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── load year options from archive ────────────────────────────────────────
  useEffect(() => {
    fetchArchivedPlans()
      .then((d) => {
        const ays = d.availableYears ?? [];
        const all = [...new Set([thisFY, ...ays])].sort((a, b) => b - a);
        setYearOptions(all);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── load plans when year changes ──────────────────────────────────────────
  useEffect(() => {
    setPlansLoading(true);
    setPlansError("");
    Promise.all([
      fetchArchivedPlans(selectedYear).catch(() => ({ archives: [] })),
      fetchSubcityLivePlans(selectedYear).catch(() => ({ plans: [] })),
    ])
      .then(([archData, liveData]) => {
        const archived = archData.archives ?? [];
        const live = liveData.plans ?? [];
        const archivedTables = new Set(archived.map((a) => a.source_table));
        const liveFill = live.filter(
          (l) => !archivedTables.has(l.source_table),
        );
        setPlanRows([...archived, ...liveFill]);
      })
      .catch((err) =>
        setPlansError(friendlyError(err, "Failed to load plans.")),
      )
      .finally(() => setPlansLoading(false));
  }, [selectedYear]);

  // ── load records when year/filters change ─────────────────────────────────
  useEffect(() => {
    setRecLoading(true);
    setRecError("");
    const { from, to } = histFiscalRange(selectedYear);
    const filters = { date_from: from, date_to: to };
    if (fWoreda !== "all") filters.username = fWoreda;
    if (fSector !== "all") filters.sector = fSector;
    fetchAllWoredaReports(filters)
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .catch((err) =>
        setRecError(friendlyError(err, "Failed to load records.")),
      )
      .finally(() => setRecLoading(false));
  }, [selectedYear, fWoreda, fSector]);

  // ── archive action ────────────────────────────────────────────────────────
  const handleArchive = async () => {
    setArchiveConfirm(false);
    setArchiving(true);
    setArchiveMsg("");
    setArchiveErr("");
    try {
      const api = (await import("../api/api")).default;
      const res = await api.post("/auth/archive-annual-plans", {}, authHdr());
      setArchiveMsg(res.data.message);
      // Refresh year options
      fetchArchivedPlans()
        .then((d) => {
          const ays = d.availableYears ?? [];
          setYearOptions([...new Set([thisFY, ...ays])].sort((a, b) => b - a));
        })
        .catch(() => {});
    } catch (err) {
      const msg = err.response?.data?.message || "Archive failed.";
      const errs = err.response?.data?.errors;
      setArchiveErr(errs ? `${msg}\n${errs.join("\n")}` : msg);
    } finally {
      setArchiving(false);
    }
  };

  const now = new Date();
  const isAfterJul8 =
    now.getMonth() > 5 || (now.getMonth() === 6 && now.getDate() >= 8);
  const SC_ACCENT = "#1a3a5c";

  return (
    <div>
      {modalRow && (
        <SCReportDetailModal row={modalRow} onClose={() => setModalRow(null)} />
      )}

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">History</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Past fiscal years — annual plans and woreda records. Year resets
            July 8.
          </p>
        </div>
        <button
          onClick={() => setShowArchive((p) => !p)}
          className="flex items-center gap-2 border border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#1a3a5c] hover:text-[#1a3a5c] px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <ArchiveNavIcon />
          {showArchive ? "Hide" : "Archive & Reset Plans"}
        </button>
      </div>

      {/* ── Archive & Reset panel ── */}
      {showArchive && (
        <div className="mb-6 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
          <p className="font-semibold text-[#1e293b] mb-1">
            Archive Annual Plans for {now.getFullYear()}
          </p>
          <p className="text-sm text-[#64748b] mb-4">
            Saves all current plan data to the archive, then resets values to
            zero for the new fiscal year.
          </p>
          {!isAfterJul8 && (
            <div className="mb-3 bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3 text-sm text-[#92400e]">
              Today is before July 8. This action is intended for after the
              fiscal year starts.
            </div>
          )}
          {archiveMsg && (
            <div className="mb-3 flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 text-[#92400e] text-sm">
              <CheckIcon />
              {archiveMsg}
            </div>
          )}
          {archiveErr && (
            <div className="mb-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm whitespace-pre-wrap">
              {archiveErr}
            </div>
          )}
          {archiveConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={() => setArchiveConfirm(false)}
                className="flex-1 border border-[#e2e8f0] text-[#64748b] py-2 rounded-xl text-sm font-medium hover:bg-[#f4f6f9] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={archiving}
                className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white py-2 rounded-xl text-sm font-semibold transition-all"
              >
                {archiving ? "Archiving..." : "Confirm Archive & Reset"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setArchiveConfirm(true)}
              disabled={archiving}
              className="w-full bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <ArchiveNavIcon /> Archive Plan {now.getFullYear()}
            </button>
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm px-5 py-4 mb-5">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Fiscal year */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Fiscal Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setFWoreda("all");
                setFSector("all");
              }}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y} – {y + 1}
                  {y === thisFY ? "  (current)" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Woreda */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Woreda
            </label>
            <select
              value={fWoreda}
              onChange={(e) => setFWoreda(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            >
              <option value="all">All Woredas</option>
              {WOREDAS.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          {/* Sector */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              Sector
            </label>
            <select
              value={fSector}
              onChange={(e) => setFSector(e.target.value)}
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20"
            >
              <option value="all">All Sectors</option>
              {REPORT_SECTORS_ALL.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {/* Count badge */}
          <div className="flex-shrink-0 pb-0.5">
            <span className="inline-block bg-[#eef4fb] text-[#1a3a5c] text-xs font-semibold px-3 py-2.5 rounded-lg border border-[#dce8f4]">
              {recLoading
                ? "…"
                : `${records.length} record${records.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      </div>

      {/* ══ ANNUAL PLANS ══ */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between px-5 py-3 rounded-t-xl border border-[#e2e8f0]"
          style={{
            background: `linear-gradient(90deg,${SC_ACCENT} 0%,${SC_ACCENT}cc 100%)`,
          }}
        >
          <div>
            <p className="text-sm font-semibold text-white">
              Annual Plans — {selectedYear}–{selectedYear + 1}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {plansLoading
                ? "Loading…"
                : `${planRows.length} plan table${planRows.length !== 1 ? "s" : ""}${planRows.some((r) => r.is_live) ? " · some live" : ""}`}
            </p>
          </div>
          {!plansLoading && planRows.length > 0 && (
            <button
              onClick={() => planRows.forEach(downloadPlanCSV)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download All Plans
            </button>
          )}
        </div>
        <div className="border border-t-0 border-[#e2e8f0] rounded-b-xl bg-white overflow-hidden">
          {plansLoading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-5 h-5 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
              <span className="text-sm text-[#64748b]">Loading plans…</span>
            </div>
          ) : plansError ? (
            <p className="px-5 py-5 text-sm text-[#dc2626]">{plansError}</p>
          ) : planRows.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[#94a3b8] text-sm">
                No plans found for {selectedYear}–{selectedYear + 1}.
              </p>
              <p className="text-[#b0bec5] text-xs mt-1">
                Plans appear once saved from the Annual Plan tab.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {["Plan Table", "Fiscal Year", "Status", "Download"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {planRows.map((a, idx) => (
                    <tr
                      key={a.id ?? `live-${idx}`}
                      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-[#1e293b]">
                        {planTableLabel(a.source_table)}
                      </td>
                      <td className="px-5 py-3 text-[#475569]">
                        {a.plan_year}–{a.plan_year + 1}
                      </td>
                      <td className="px-5 py-3">
                        {a.is_live ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                            Archived{" "}
                            {a.archived_at
                              ? new Date(a.archived_at).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : ""}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => downloadPlanCSV(a)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#1a3a5c] bg-[#eef4fb] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all"
                        >
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ══ WOREDA RECORDS ══ */}
      <div>
        <div
          className="flex items-center justify-between px-5 py-3 rounded-t-xl border border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
          }}
        >
          <div>
            <p className="text-sm font-semibold text-white">
              Woreda Records — {selectedYear}–{selectedYear + 1}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {recLoading
                ? "Loading…"
                : `${records.length} report${records.length !== 1 ? "s" : ""} from this fiscal year`}
            </p>
          </div>
          {!recLoading && records.length > 0 && (
            <button
              onClick={() => downloadRecordsCSV(records, selectedYear)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Records
            </button>
          )}
        </div>
        <div className="border border-t-0 border-[#e2e8f0] rounded-b-xl bg-white overflow-hidden">
          {recError && (
            <div className="px-5 py-4 flex items-center gap-2 text-sm text-[#dc2626]">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {recError}
            </div>
          )}
          {recLoading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-5 h-5 border-4 border-[#d1fae5] border-t-[#78350f] rounded-full animate-spin" />
              <span className="text-sm text-[#64748b]">Loading records…</span>
            </div>
          ) : records.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-[#f4f6f9] flex items-center justify-center mx-auto mb-3">
                <ListIcon />
              </div>
              <p className="text-[#94a3b8] text-sm">
                No records for {selectedYear}–{selectedYear + 1}
                {fWoreda !== "all" || fSector !== "all"
                  ? " with selected filters"
                  : ""}
                .
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    {[
                      "Date",
                      "Submitted By",
                      "Sector",
                      "Report Type",
                      "Actions",
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
                  {records.map((row, idx) => {
                    const sec = REPORT_SECTORS_ALL.find(
                      (s) => s.id === row._sector,
                    );
                    return (
                      <tr
                        key={row.id ?? idx}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="px-5 py-3 text-[#475569] text-sm">
                          {scFormatDateTime(row)}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-[#1e293b]">
                          {row.username ?? ""}
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
                              className="flex items-center gap-1.5 text-xs font-semibold text-[#1a3a5c] bg-[#eef4fb] hover:bg-[#dce8f4] px-3 py-1.5 rounded-lg transition-all"
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
                            <button
                              onClick={() =>
                                scDownloadCSV(
                                  row,
                                  sec?.label ?? row._sector ?? "Report",
                                )
                              }
                              className="flex items-center gap-1.5 text-xs font-semibold text-[#78350f] bg-[#fffbeb] hover:bg-[#fef3c7] px-3 py-1.5 rounded-lg transition-all"
                            >
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
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              CSV
                            </button>
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
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-2.5 text-[#92400e] text-sm">
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
              {saving ? "Publishing..." : "Publish Announcement"}
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

// ─── Mana Qophessaa sub-sources (used by Galii plan/report and GaliiOverviewPlanTable) ─
const SC_MANA_QOPHESSAA_SOURCES = [
  { id: "liizii", label: "Liizii", key: "liizii" },
  { id: "kiraa_lafaa", label: "Kiraa Lafaa", key: "kiraa_lafaa" },
  { id: "kiraa_gare_liizii", label: "Kiraa gare Liizii", key: "kiraa_gare_liizii" },
  { id: "baaxii_fi_gooroo", label: "Baaxii fi Gooroo", key: "baaxii_fi_gooroo" },
  { id: "kiraa_mana_daldalaa", label: "Kiraa Mana Daldalaa", key: "kiraa_mana_daldalaa" },
  { id: "kiraa_mana_jireenyaa", label: "Kiraa Mana Jireenyaa", key: "kiraa_mana_jireenyaa" },
  { id: "other", label: "Other", key: "other" },
];
const SC_IDILEE_SOURCES = [
  { id: "gibira_mindaa", label: "Gibira mindaa hojjettootaa dhuunfaa", key: "gibira_mindaa" },
  { id: "galii_kiraa", label: "Galii Kiraa", key: "galii_kiraa" },
  { id: "gibira_buaa", label: "Gibira bu'aa daldalaa namoota dhuunfaarraa", key: "gibira_buaa" },
  { id: "qonnaan_bultoota", label: "Qonnaan bultoota dhuunfaarraa", key: "qonnaan_bultoota" },
  { id: "with_holding", label: "With holding", key: "with_holding" },
  { id: "vat", label: "VAT", key: "vat" },
  { id: "tot", label: "TOT", key: "tot" },
];

// ─── GaliiOverviewPlanTable ───────────────────────────────────────────────────
// Shows per-source KG + Qarshii targets for each woreda + subcity total.
// Fetches woreda targets from getWoRedaAnalysis("galii", wId, "annual").
function GaliiOverviewPlanTable({ dbGaliiPlan }) {
  const [woredaTargets, setWoredaTargets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      WOREDAS.map((w) =>
        fetchWoRedaAnalysis("galii", w.id, "annual")
          .then((d) => [w.id, d.targets || {}])
          .catch(() => [w.id, {}]),
      ),
    ).then((results) => {
      setWoredaTargets(Object.fromEntries(results));
      setLoading(false);
    });
  }, []);

  const hasPlanData =
    dbGaliiPlan &&
    SC_MANA_QOPHESSAA_SOURCES.some(
      (s) =>
        Number(dbGaliiPlan[`mq_${s.key}_kg`] || 0) > 0 ||
        Number(dbGaliiPlan[`mq_${s.key}_qarshii`] || 0) > 0,
    );

  if (!hasPlanData) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-6 flex flex-col items-center text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center mb-2 text-[#64748b]">
          <TargetIcon />
        </div>
        <p className="text-[#1e293b] font-semibold text-sm mb-1">
          Karoora Galii Sassaabu Hin Jiru
        </p>
        <p className="text-[#94a3b8] text-xs">
          Karoora Waggaa irraa Galii Sassaabu filadhu.
        </p>
      </div>
    );
  }

  // Row defs: 7 MQ sources (each KG row + Qarshii row) + 7 Idilee sources
  const MQ_ROW_DEFS = SC_MANA_QOPHESSAA_SOURCES.flatMap((src) => [
    {
      label: `${src.label} KG`,
      color: "#0f766e",
      subcityKey: `mq_${src.key}_kg`,
      targetKey: `mq_${src.key}_kg`,
    },
    {
      label: `${src.label} Qarshii`,
      color: "#0d9488",
      subcityKey: `mq_${src.key}_qarshii`,
      targetKey: `mq_${src.key}_qarshii`,
    },
  ]);
  const IDILEE_ROW_DEFS = [
    {
      label: "Idilee (Waliigala Qarshii)",
      color: "#1e40af",
      subcityKey: "idilee_qarshii",
      targetKey: "idilee_qarshii",
    },
  ];

  function PlanTable({ rows, headerColor, headerTitle, headerSub, thColor }) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 border-b border-[#e2e8f0]"
          style={{ background: headerColor }}
        >
          <p className="text-sm font-semibold text-white">{headerTitle}</p>
          <p className="text-white/60 text-xs mt-0.5">{headerSub}</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <div className="w-5 h-5 border-4 border-[#e2e8f0] border-t-[#0f766e] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide min-w-[200px]"
                    style={{ color: thColor }}
                  >
                    Source
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                    Subcity Total
                  </th>
                  {WOREDAS.map((w) => (
                    <th
                      key={w.id}
                      className="text-right px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"
                    >
                      {w.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const subcityTotal = Number(dbGaliiPlan[row.subcityKey] || 0);
                  return (
                    <tr
                      key={row.label}
                      className={`border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${i % 2 !== 0 ? "bg-[#f8fafc]" : ""}`}
                    >
                      <td className="px-5 py-3 font-medium text-[#1e293b]">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          {row.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-[#1e293b]">
                        {subcityTotal.toLocaleString()}
                      </td>
                      {WOREDAS.map((w) => {
                        const val = Number(
                          woredaTargets[w.id]?.[row.targetKey] ?? 0,
                        );
                        return (
                          <td
                            key={w.id}
                            className="px-5 py-3 text-right text-[#64748b]"
                          >
                            {val.toLocaleString()}
                          </td>
                        );
                      })}
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

  return (
    <div className="space-y-4">
      <PlanTable
        rows={MQ_ROW_DEFS}
        headerColor="linear-gradient(90deg,#0f766e 0%,#0d9488 100%)"
        headerTitle="Mana Qophessaa"
        headerSub={`Year ${dbGaliiPlan.year} — KG and Qarshii targets per woreda`}
        thColor="#0f766e"
      />
      <PlanTable
        rows={IDILEE_ROW_DEFS}
        headerColor="linear-gradient(90deg,#1e40af 0%,#2563eb 100%)"
        headerTitle="Idilee"
        headerSub={`Year ${dbGaliiPlan.year} — Qarshii targets per woreda`}
        thColor="#1e40af"
      />
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────────────────────
// ─── GenericWoredaOverviewTable ───────────────────────────────────────────────
// Shows a plan table with rows = fields, cols = each of 4 woredas + Waliigala.
// Fetches each woreda's annual targets via fetchWoRedaAnalysis.
// For Carraa Hojii fields with Dhi/Dub subs, shows each sub as its own row.
function GenericWoredaOverviewTable({ sector, fields, label, gradient, subcityPlan, isCarra }) {
  const [woredaTargets, setWoredaTargets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      WOREDAS.map((w) =>
        fetchWoRedaAnalysis(sector, w.id, "annual")
          .then((d) => [w.id, d.targets || {}])
          .catch(() => [w.id, {}]),
      ),
    ).then((results) => {
      setWoredaTargets(Object.fromEntries(results));
      setLoading(false);
    });
  }, [sector]);

  const hasPlanData =
    subcityPlan && Object.values(subcityPlan).some((v) => typeof v === "number" && v > 0);

  if (!hasPlanData) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-6 flex flex-col items-center text-center shadow-sm mt-6">
        <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center mb-2 text-[#64748b]">
          <TargetIcon />
        </div>
        <p className="text-[#1e293b] font-semibold text-sm mb-1">Karoora {label} Hin Jiru</p>
        <p className="text-[#94a3b8] text-xs">Karoora Waggaa irraa {label} filadhu.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mt-6">
      <div className="px-5 py-3 border-b border-[#e2e8f0]" style={{ background: gradient }}>
        <p className="text-sm font-semibold text-white">{label} Karoora</p>
        <p className="text-white/60 text-xs mt-0.5">Waggaa {subcityPlan?.year} · Aanaa hundaaf fi Waliigala</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <div className="w-6 h-6 border-4 border-[#dbeafe] border-t-[#1e40af] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide min-w-[180px]">Gosa</th>
                {WOREDAS.map((w) => (
                  <th key={w.id} className="text-right px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide min-w-[110px]">{w.name}</th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#eff6ff] min-w-[90px]">Waliigala</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ key, label: fLabel, color }) => {
                const woredaValues = WOREDAS.map((w) => Number(woredaTargets[w.id]?.[key] ?? 0));
                const total = woredaValues.reduce((a, v) => a + v, 0);
                return (
                  <tr key={key} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-2.5 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        {fLabel}
                      </span>
                    </td>
                    {woredaValues.map((val, i) => (
                      <td key={WOREDAS[i].id} className="px-4 py-2.5 text-right text-[#475569]">{val.toLocaleString()}</td>
                    ))}
                    <td className="px-4 py-2.5 text-right font-bold text-[#0f172a] bg-[#eff6ff]">{total.toLocaleString()}</td>
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

function OverviewPage({
  dbPlan,
  dbQonnaPlan,
  dbGaliiPlan,
  dbCarraPlan,
  dbDaldalaPlan,
  dbAtkPlan,
  dbGaliiSassabuPlan,
  u,
}) {
  const hasPlan =
    dbPlan &&
    (PLAN_FIELDS.some((f) => Number(dbPlan[f.key] || 0) > 0) ||
      FIXED_WEREDA_FIELDS.some((f) =>
        WOREDAS.some((w) => Number(dbPlan[`${f.key}_${w.id}`] || 0) > 0),
      ));
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
      color: "#78350f",
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
        { col: "kannisaa_lakk_gaaguraa", label: "Lakk Sheedii" },
        { col: "kannisaa_lakk_kannisaa_waliigalaa", label: "Lakk Gaaguraa" },
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

          {/* ── Fixed per-woreda targets ── */}
          {FIXED_WEREDA_FIELDS.some((f) =>
            WOREDAS.some((w) => Number(dbPlan[`${f.key}_${w.id}`] || 0) > 0),
          ) && (
            <>
              <div className="px-5 py-2.5 border-t border-[#e2e8f0] bg-[#f8fafc]">
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Fixed Per-Woreda Targets
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                        Category
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
                    {FIXED_WEREDA_FIELDS.map(({ key, label, color }) => (
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
                        {WOREDAS.map((w) => (
                          <td key={w.id} className="px-5 py-3 text-[#64748b]">
                            {Number(
                              dbPlan[`${key}_${w.id}`] || 0,
                            ).toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
              background: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
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
          <div className="w-14 h-14 rounded-full bg-[#fffbeb] flex items-center justify-center mb-3 text-[#78350f]">
            <TargetIcon />
          </div>
          <p className="text-[#1e293b] font-semibold mb-1">No Qonna Plan Yet</p>
          <p className="text-[#94a3b8] text-sm max-w-xs">
            Go to Annual Plan → Qonna to enter subcity targets.
          </p>
        </div>
      )}

      {/* ── Carraa Hojii plan — per-woreda table with all 4 woredas ── */}
      <GenericWoredaOverviewTable
        sector="carraa"
        fields={SECTOR_CFG.carraa.fields}
        label="Carraa Hojii Uumuu"
        gradient="linear-gradient(90deg,#1e40af 0%,#2563eb 100%)"
        subcityPlan={dbCarraPlan}
      />

      {/* ── Generic sector plans (Daldala, ATK) — per woreda + total ── */}
      <GenericWoredaOverviewTable
        sector="daldala"
        fields={DALDALA_FIELDS_SC}
        label="Daldala"
        gradient="linear-gradient(90deg,#854d0e 0%,#a16207 100%)"
        subcityPlan={dbDaldalaPlan}
      />
      <GenericWoredaOverviewTable
        sector="atk"
        fields={ATK_FIELDS_SC}
        label="ATK"
        gradient="linear-gradient(90deg,#7e22ce 0%,#9333ea 100%)"
        subcityPlan={dbAtkPlan}
      />

      {/* ── Galii Sassaabu plan — per-source KG + Qarshii with woreda columns ── */}
      <div className="mt-6">
        <GaliiOverviewPlanTable dbGaliiPlan={dbGaliiPlan} />
      </div>

      {/* ── Galii Sassabu plan (new sector) — Mana Qophessaa Total + Idilee Total ── */}
      <div className="mt-6">
        {dbGaliiSassabuPlan &&
        (Number(dbGaliiSassabuPlan.mana_qophessaa_total || 0) > 0 ||
          Number(dbGaliiSassabuPlan.idilee_total || 0) > 0) ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-3 border-b border-[#e2e8f0]"
              style={{
                background: "linear-gradient(90deg,#c2410c 0%,#ea580c 100%)",
              }}
            >
              <p className="text-sm font-semibold text-white">
                Galii Sassabu Karoora
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                Waggaa {dbGaliiSassabuPlan.year} · Waliigala Subcity
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Gosa
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                      Waliigala Subcity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Mana Qophessaa Total",
                      key: "mana_qophessaa_total",
                      color: "#c2410c",
                    },
                    {
                      label: "Idilee Total",
                      key: "idilee_total",
                      color: "#ea580c",
                    },
                  ].map(({ label, key, color }) => (
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
                      <td className="px-5 py-3 text-right font-semibold text-[#1e293b]">
                        {Number(dbGaliiSassabuPlan[key] || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Grand total row */}
                  <tr className="bg-[#fff7ed]">
                    <td className="px-5 py-3 font-extrabold text-[#c2410c]">
                      Waliigala
                    </td>
                    <td className="px-5 py-3 text-right font-extrabold text-[#c2410c]">
                      {(
                        Number(dbGaliiSassabuPlan.mana_qophessaa_total || 0) +
                        Number(dbGaliiSassabuPlan.idilee_total || 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="px-5 py-3 text-xs text-[#94a3b8] border-t border-[#f1f5f9]">
              Karoora Aanaa hundaa argachuuf Karoora Waggaa irraa ilaalaa.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#fff7ed] flex items-center justify-center mb-2 text-[#c2410c]">
              <TargetIcon />
            </div>
            <p className="text-[#1e293b] font-semibold text-sm mb-1">
              Karoora Galii Sassabu Hin Jiru
            </p>
            <p className="text-[#94a3b8] text-xs">
              Karoora Waggaa irraa Galii Sassabu filadhu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Woreda Percentage Inputs ─────────────────────────────────────────
// Reused by both BuusaaPlanPage and QonnaPlanPage.
function WoRedaPctInputs({ pcts, onChange }) {
  const parsed = parsePcts(pcts);
  const { ok, total, error } = validatePcts(parsed);
  const colors = ["#78350f", "#1e40af", "#475569", "#64748b"];
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
            <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-2.5">
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
              <span className="text-[#92400e] text-sm font-semibold">
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
  // Distributed fields (percentage split across woredas)
  const [form, setForm] = useState({ ...EMPTY_PLAN });
  // Fixed per-woreda fields: { fieldKey: { w1, w2, w3, w4 } }
  const [fixed, setFixed] = useState(() =>
    JSON.parse(JSON.stringify(EMPTY_FIXED)),
  );
  const [pcts, setPcts] = useState({ ...DEFAULT_WOREDA_PCTS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handlePct = (id, val) => setPcts((p) => ({ ...p, [id]: val }));
  const handleField = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFixed = (fieldKey, wId, val) =>
    setFixed((p) => ({
      ...p,
      [fieldKey]: { ...p[fieldKey], [wId]: val },
    }));

  const parsed = parsePcts(pcts);
  const pctValid = validatePcts(parsed);
  const hasDistributed = PLAN_FIELDS.some((f) => Number(form[f.key] || 0) > 0);
  const hasFixed = FIXED_WEREDA_FIELDS.some((f) =>
    WOREDAS.some((w) => Number(fixed[f.key]?.[w.id] || 0) > 0),
  );
  const canSubmit = (hasDistributed || hasFixed) && pctValid.ok;

  const share = (woredaId, categoryTotal) =>
    pctValid.ok ? pctShare(parsed, woredaId, categoryTotal) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pctValid.ok) return;
    setSaving(true);
    setSaveError("");
    setSaved(false);

    const wForm = Object.fromEntries(
      WOREDAS.map((w) => [w.id, Math.round(parsed[w.id] * 10)]),
    );

    // Build the full plan payload: distributed fields + fixed per-woreda fields
    const fullPlan = { ...form };
    // Attach fixed values as w1/w2/w3/w4 per field key
    FIXED_WEREDA_FIELDS.forEach(({ key }) => {
      WOREDAS.forEach((w) => {
        fullPlan[`${key}_${w.id}`] = Number(fixed[key]?.[w.id] || 0);
      });
    });

    try {
      await onSave(fullPlan, wForm);
      setSaved(true);
      setForm({ ...EMPTY_PLAN });
      setFixed(JSON.parse(JSON.stringify(EMPTY_FIXED)));
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
          Distributed fields are split by percentage. Fixed fields are entered
          per woreda.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PlanUnlockBanner sector="buusaa" />
        <WoRedaPctInputs pcts={pcts} onChange={handlePct} />

        {/* ── Section 1: Distributed by percentage ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#0f172a 0%,#1e3a5f 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Distributed Targets
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Split proportionally across 4 woredas by the percentages above
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
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                />
              </div>
            ))}
            {/* Daldala A — subcity-only, stored as count × 17400 */}
            <div className="sm:col-span-2">
              <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <p className="text-sm font-semibold text-[#1e293b]">
                    Daldala A (×17,400)
                  </p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Subcity-only field — not distributed to woredas. Enter
                    count; stored as count × 17,400.
                  </p>
                </div>
                <div className="px-4 py-4">
                  <input
                    type="number"
                    min="0"
                    name="daldala_a"
                    value={form.daldala_a}
                    onChange={handleField}
                    placeholder="0"
                    className="w-full sm:w-64 border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20"
                  />
                  {Number(form.daldala_a) > 0 && (
                    <p className="text-xs text-[#64748b] mt-1">
                      = {(Number(form.daldala_a) * 17400).toLocaleString()}{" "}
                      stored
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation preview (distributed only) */}
        {hasDistributed && pctValid.ok && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <p className="text-sm font-semibold text-[#1e293b]">
                Distributed Allocation Preview
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
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]"
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

        {/* ── Section 2: Fixed per-woreda targets ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#065f46 0%,#047857 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Fixed Per-Woreda Targets
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Nyaata Barataa, Sukkaara, Zayitii, and Daldala B — enter a
              separate value for each woreda
            </p>
          </div>
          <div className="px-5 py-5 space-y-6">
            {FIXED_WEREDA_FIELDS.map(({ key, label, color }) => (
              <div key={key}>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#1e293b] mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {WOREDAS.map((w) => (
                    <div key={w.id}>
                      <label className="block text-xs text-[#64748b] font-medium mb-1 truncate">
                        {w.name}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={fixed[key]?.[w.id] ?? ""}
                        onChange={(e) => handleFixed(key, w.id, e.target.value)}
                        placeholder="0"
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#065f46]/20"
                      />
                      {/* Show multiplied value for Daldala B */}
                      {key === "daldala_b_group_a" &&
                        Number(fixed[key]?.[w.id]) > 0 && (
                          <p className="text-[10px] text-[#64748b] mt-0.5">
                            ={" "}
                            {(Number(fixed[key][w.id]) * 4200).toLocaleString()}
                          </p>
                        )}
                      {key === "daldala_b_group_b" &&
                        Number(fixed[key]?.[w.id]) > 0 && (
                          <p className="text-[10px] text-[#64748b] mt-0.5">
                            ={" "}
                            {(Number(fixed[key][w.id]) * 8700).toLocaleString()}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

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
    houseLabel: "Lakk.Sheedii",
    haLabel: "Hektaara/Sheedii",
    unitLabel: "Lakk.Gaaguraa/Sheedii",
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
              background: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
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
                            { label: "Lakk Sheedii" },
                            { label: "Lakk Gaaguraa" },
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
              <p className="flex items-center gap-2 text-[#92400e] text-sm font-semibold">
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
            style={{ backgroundColor: "#78350f" }}
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
// Mana Qophessaa sub-items shared across plan + report forms
// NOTE: SC_MANA_QOPHESSAA_SOURCES and SC_IDILEE_SOURCES are defined earlier
//       (before GaliiOverviewPlanTable) to avoid reference-before-declaration.

// For analysis/comparison ring-chart views — full per-source breakdown
const GALII_FIELDS = [
  // Mana Qophessaa sub-items
  { key: "mq_liizii_kg", label: "Liizii KG", color: "#0f766e" },
  { key: "mq_liizii_qarshii", label: "Liizii Qarshii", color: "#0f766e" },
  { key: "mq_kiraa_lafaa_kg", label: "Kiraa Lafaa KG", color: "#0d9488" },
  {
    key: "mq_kiraa_lafaa_qarshii",
    label: "Kiraa Lafaa Qarshii",
    color: "#0d9488",
  },
  {
    key: "mq_kiraa_gare_liizii_kg",
    label: "Kiraa gare Liizii KG",
    color: "#0891b2",
  },
  {
    key: "mq_kiraa_gare_liizii_qarshii",
    label: "Kiraa gare Liizii Qarshii",
    color: "#0891b2",
  },
  {
    key: "mq_baaxii_fi_gooroo_kg",
    label: "Baaxii fi Gooroo KG",
    color: "#0369a1",
  },
  {
    key: "mq_baaxii_fi_gooroo_qarshii",
    label: "Baaxii fi Gooroo Qarshii",
    color: "#0369a1",
  },
  {
    key: "mq_kiraa_mana_daldalaa_kg",
    label: "Kiraa Mana Daldalaa KG",
    color: "#1e40af",
  },
  {
    key: "mq_kiraa_mana_daldalaa_qarshii",
    label: "Kiraa Mana Daldalaa Qarshii",
    color: "#1e40af",
  },
  {
    key: "mq_kiraa_mana_jireenyaa_kg",
    label: "Kiraa Mana Jireenyaa KG",
    color: "#4f46e5",
  },
  {
    key: "mq_kiraa_mana_jireenyaa_qarshii",
    label: "Kiraa Mana Jireenyaa Qarshii",
    color: "#4f46e5",
  },
  { key: "mq_other_kg", label: "Other KG", color: "#64748b" },
  { key: "mq_other_qarshii", label: "Other Qarshii", color: "#64748b" },
  // Idilee sub-sources
  ...SC_IDILEE_SOURCES.map((s) => ({
    key: `idilee_${s.key}_qarshii`,
    label: s.label,
    color: "#1e40af",
  })),
];

// Each field carries its own subs array: [{suffix, label}]
// Exact sub-columns per field derived from the official CHUO Excel template:
// Leenjii              → int, dhi, dub
// Carraa Hojii Dhaabbii → int, dhi, dub
// Carraa Hojii Qacarrii → int, dhi, dub
// Qusannaa Haawaasaa   → int, qarshii
// Kenna Liqii          → int, mise, qarshii
// Qusanna Dirqii       → int, mise, qarshii
// Deebii Liqii Bilchaate → int, qarshii
// Deebii Liqii Bulee    → int, qarshii
// Industrii Godoo       → kilaastera, lafa, carraa_hojii
const CARRAA_FIELDS = [
  {
    key: "leenjii",
    label: "Leenjii",
    color: "#1e40af",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_dhi", label: "Dhi" },
      { suffix: "_dub", label: "Dub" },
    ],
  },
  {
    key: "carraa_hojii_dhaabbii",
    label: "Carraa Hojii Dhaabbii",
    color: "#0f766e",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_dhi", label: "Dhi" },
      { suffix: "_dub", label: "Dub" },
    ],
  },
  {
    key: "carraa_hojii_qacarrii",
    label: "Carraa Hojii Qacarrii",
    color: "#7c3aed",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_dhi", label: "Dhi" },
      { suffix: "_dub", label: "Dub" },
    ],
  },
  {
    key: "qusannaa_haawaasaa",
    label: "Qusannaa Haawaasaa",
    color: "#475569",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_qarshii", label: "Qarshii" },
    ],
  },
  {
    key: "kenna_liqii",
    label: "Kenna Liqii",
    color: "#b45309",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_mise", label: "Mise" },
      { suffix: "_qarshii", label: "Qarshii" },
    ],
  },
  {
    key: "qusanna_dirqii",
    label: "Qusanna Dirqii",
    color: "#64748b",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_mise", label: "Mise" },
      { suffix: "_qarshii", label: "Qarshii" },
    ],
  },
  {
    key: "deebii_liqii_bilchaate",
    label: "Deebii Liqii Bilchaate",
    color: "#78350f",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_qarshii", label: "Qarshii" },
    ],
  },
  {
    key: "deebii_liqii_bulee",
    label: "Deebii Liqii Bulee",
    color: "#dc2626",
    subs: [
      { suffix: "_int", label: "Int" },
      { suffix: "_qarshii", label: "Qarshii" },
    ],
  },
  {
    key: "industrii_godoo",
    label: "Industrii Godoo",
    color: "#0369a1",
    subs: [
      { suffix: "_kilaastera", label: "Kilaastera" },
      { suffix: "_lafa", label: "Lafa (Hek)" },
      { suffix: "_carraa_hojii", label: "Carraa Hojii" },
    ],
  },
];
// CARRAA_SUBS — all possible suffixes for reference
const CARRAA_SUBS = [
  { suffix: "_int", label: "Int" },
  { suffix: "_dhi", label: "Dhi" },
  { suffix: "_dub", label: "Dub" },
  { suffix: "_qarshii", label: "Qarshii" },
  { suffix: "_mise", label: "Mise" },
  { suffix: "_kilaastera", label: "Kilaastera" },
  { suffix: "_lafa", label: "Lafa (Hek)" },
  { suffix: "_carraa_hojii", label: "Carraa Hojii" },
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
  { key: "toannoo_walii_gala", label: "To'annoo Walii Gala", color: "#78350f" },
  { key: "tmd", label: "Leenjii TMD", color: "#0369a1" },
  { key: "intarshippii", label: "Intarshippii", color: "#dc2626" },
  { key: "ggg", label: "Giddu Gala Gabaa", color: "#475569" },
  { key: "gabayaa_sanbata", label: "Gabaa Sanbata", color: "#854d0e" },
  {
    key: "whg_kudraa",
    label: "Walitti Hidhinsa Gabaa - Kudraa",
    color: "#92400e",
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
    color: "#78350f",
  },
  { key: "galii_atk_galchuu", label: "Galii ATK Galchuu", color: "#b45309" },
];

// Sector config map used by GenericSubcityPlanPage and GenericSubcityAnalysisPage
const SECTOR_CFG = {
  buusaa: {
    fields: [
      ...PLAN_FIELDS.map(({ key, label, color }) => ({ key, label, color })),
      ...FIXED_WEREDA_FIELDS.map(({ key, label, color }) => ({
        key,
        label,
        color,
      })),
    ],
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
        color: "#78350f",
      },
      {
        key: "furdisa_lakk_sheedii",
        label: "Furdisa - Sheedii",
        color: "#78350f",
      },
      {
        key: "furdisa_lakk_horii_waliigalaa",
        label: "Furdisa - Lakk Horii",
        color: "#78350f",
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
        label: "Kannisaa - Lakk Sheedii",
        color: "#b45309",
      },
      {
        key: "kannisaa_lakk_kannisaa_waliigalaa",
        label: "Kannisaa - Lakk Gaaguraa",
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
    color: "#78350f",
    gradient: "linear-gradient(90deg,#78350f 0%,#b45309 100%)",
    fetchFn: fetchSubcityQonnaPlan,
  },
  galii: {
    fields: GALII_FIELDS,
    label: "Galii Sassaabu",
    color: "#475569",
    gradient: "linear-gradient(90deg,#475569 0%,#64748b 100%)",
  },
  carraa: {
    // Flat list with _parent/_parentLabel so analysis tables can group sub-fields
    // under their parent field name and show an Ida'ama subtotal row.
    fields: CARRAA_FIELDS.flatMap((f) =>
      f.subs.length
        ? f.subs.map((s, si) => ({
            key: `${f.key}${s.suffix}`,
            label: `${f.label} — ${s.label}`,
            color: f.color,
            _parent: f.key,
            _parentLabel: f.label,
            _subLabel: s.label,
            _firstSub: si === 0,
            _lastSub: si === f.subs.length - 1,
            _totalSubs: f.subs.length,
          }))
        : [
            {
              key: f.key,
              label: f.label,
              color: f.color,
              _parent: f.key,
              _parentLabel: f.label,
              _subLabel: null,
              _firstSub: true,
              _lastSub: true,
              _totalSubs: 1,
            },
          ],
    ),
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
  galii_sassabu: {
    fields: [
      {
        key: "mana_qophessaa_total",
        planKey: "mana_qophessaa_total",
        label: "Mana Qophessaa Total",
        color: "#c2410c",
      },
      {
        key: "idilee_total",
        planKey: "idilee_total",
        label: "Idilee Total",
        color: "#ea580c",
      },
    ],
    label: "Galii Sassabu",
    color: "#c2410c",
    gradient: "linear-gradient(90deg,#c2410c 0%,#ea580c 100%)",
    fetchFn: fetchSubcityGaliiSassabuPlan,
  },
};

// ─── Generic Subcity Annual Plan Page ────────────────────────────────────────
// Used for Carraa Hojii, Daldala, ATK.
// Subcity enters each woreda's values directly (no % distribution).
function GenericSubcityPlanPage({ sector }) {
  const cfg = SECTOR_CFG[sector];

  // woredaForms: { w1: { field: value }, w2: {...}, w3: {...}, w4: {...} }
  const emptyWoForms = () =>
    Object.fromEntries(
      WOREDAS.map((w) => [
        w.id,
        Object.fromEntries(cfg.fields.map((f) => [f.key, ""])),
      ]),
    );
  const [woredaForms, setWoredaForms] = useState(emptyWoForms());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleField = (wId, key, val) =>
    setWoredaForms((p) => ({
      ...p,
      [wId]: { ...p[wId], [key]: val },
    }));

  const hasValues = WOREDAS.some((w) =>
    cfg.fields.some((f) => Number(woredaForms[w.id][f.key] || 0) > 0),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    // Build woredaPlans: { w1: { field: number }, ... }
    const woredaPlans = Object.fromEntries(
      WOREDAS.map((w) => [
        w.id,
        Object.fromEntries(
          cfg.fields.map((f) => [f.key, Number(woredaForms[w.id][f.key] || 0)]),
        ),
      ]),
    );
    try {
      await saveSubcityGenericPlan(sector, woredaPlans);
      setSaved(true);
      setWoredaForms(emptyWoForms());
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  // Compute totals per field across all woredas
  const fieldTotals = Object.fromEntries(
    cfg.fields.map((f) => [
      f.key,
      WOREDAS.reduce((s, w) => s + Number(woredaForms[w.id][f.key] || 0), 0),
    ]),
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Karoora Aanaa hundaaf Qopha'ee Galchi
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PlanUnlockBanner sector={sector} />

        {/* Per-woreda input grid */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{ background: cfg.gradient }}
          >
            <p className="text-sm font-semibold text-white">
              Karoora {cfg.label}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Karoora Aanaa hundaaf Qopha'ee Galchi
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide min-w-[180px]">
                    Gosa
                  </th>
                  {WOREDAS.map((w) => (
                    <th
                      key={w.id}
                      className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide min-w-[130px]"
                    >
                      {w.name}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#eff6ff] min-w-[100px]">
                    Waliigala
                  </th>
                </tr>
              </thead>
              <tbody>
                {cfg.fields.map(({ key, label, color }) => (
                  <tr
                    key={key}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]"
                  >
                    <td className="px-4 py-2.5 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        {label}
                      </span>
                    </td>
                    {WOREDAS.map((w) => (
                      <td key={w.id} className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={woredaForms[w.id][key]}
                          onChange={(e) =>
                            handleField(w.id, key, e.target.value)
                          }
                          placeholder="0"
                          className="w-full border border-[#e2e8f0] rounded-lg px-2.5 py-2 text-sm text-[#1e293b] bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 text-right"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right font-bold text-[#0f172a] bg-[#eff6ff]">
                      {fieldTotals[key].toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#0f766e] text-sm font-semibold">
                <CheckIcon /> {cfg.label} plan saved for all woredas.
              </p>
            )}
            {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
            {!saved && !saveError && (
              <p className="text-[#94a3b8] text-xs">
                This will replace the previous {cfg.label} plan.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || !hasValues}
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

// ─── Carraa Hojii Subcity Annual Plan Page ───────────────────────────────────
// Subcity enters per-woreda values for each Carraa Hojii field.
// Fields with hasSubs:true get three sub-rows: Int (Enterprise), Dhi (Dhiira/Male), Dub (Dubartii/Female).
// Industrii Godoo has no subs — single value per woreda.
function CarraaSubcityPlanPage() {
  // Build empty form keyed by woreda → sub-field keys from CARRAA_FIELDS.subs
  const emptyWoForms = () =>
    Object.fromEntries(
      WOREDAS.map((w) => [
        w.id,
        Object.fromEntries(
          CARRAA_FIELDS.flatMap((f) =>
            f.subs.length
              ? f.subs.map((s) => [`${f.key}${s.suffix}`, ""])
              : [[f.key, ""]],
          ),
        ),
      ]),
    );

  const [woredaForms, setWoredaForms] = useState(emptyWoForms());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleField = (wId, key, val) =>
    setWoredaForms((p) => ({ ...p, [wId]: { ...p[wId], [key]: val } }));

  const hasValues = WOREDAS.some((w) =>
    Object.values(woredaForms[w.id]).some((v) => Number(v || 0) > 0),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    const woredaPlans = Object.fromEntries(
      WOREDAS.map((w) => [
        w.id,
        Object.fromEntries(
          Object.entries(woredaForms[w.id]).map(([k, v]) => [
            k,
            Number(v || 0),
          ]),
        ),
      ]),
    );
    try {
      await saveSubcityGenericPlan("carraa", woredaPlans);
      setSaved(true);
      setWoredaForms(emptyWoForms());
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  // Total per sub-key across all woredas
  const subTotal = (key) =>
    WOREDAS.reduce((s, w) => s + Number(woredaForms[w.id][key] || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Karoora Aanaa hundaaf Qopha'ee Galchi — Carraa Hojii Uumuu
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PlanUnlockBanner sector="carraa" />

        {/* One table per field — subs as rows, woredas + Total as columns */}
        {CARRAA_FIELDS.map((f) => (
          <div
            key={f.key}
            className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden"
          >
            {/* Field header */}
            <div
              className="px-5 py-2.5 border-b border-[#e2e8f0] flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg,#1e40af 0%,#2563eb 100%)",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: f.color ?? "#fff" }}
              />
              <p className="text-sm font-semibold text-white">{f.label}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    {/* Sub-label column */}
                    <th className="text-left px-4 py-2 text-xs font-semibold text-[#64748b] uppercase tracking-wide border-r border-[#e2e8f0] min-w-[110px]">
                      Gosaa
                    </th>
                    {/* One column per woreda */}
                    {WOREDAS.map((w) => (
                      <th
                        key={w.id}
                        className="text-center px-3 py-2 text-xs font-semibold text-[#334155] uppercase tracking-wide border-r border-[#e2e8f0] min-w-[130px]"
                      >
                        {w.name}
                      </th>
                    ))}
                    {/* Total column */}
                    <th className="text-center px-3 py-2 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#eff6ff] min-w-[90px]">
                      Waliigala
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {f.subs.length > 0 ? (
                    <>
                      {/* One row per sub-column */}
                      {f.subs.map((s) => {
                        const subKey = `${f.key}${s.suffix}`;
                        const rowSubTotal = WOREDAS.reduce(
                          (acc, w) =>
                            acc + Number(woredaForms[w.id][subKey] || 0),
                          0,
                        );
                        // Gender subs (Dhi+Dub only — exclude Int)
                        const genderSubs = f.subs.filter(
                          (x) => x.suffix === "_dhi" || x.suffix === "_dub",
                        );
                        const isGenderSub =
                          s.suffix === "_dhi" || s.suffix === "_dub";
                        // Waliigala for Dhi/Dub rows = Dhi+Dub sum only; for Int/others = per-sub total
                        const waliigala = isGenderSub
                          ? WOREDAS.reduce(
                              (acc, w) =>
                                acc +
                                genderSubs.reduce(
                                  (sa, sx) =>
                                    sa +
                                    Number(
                                      woredaForms[w.id][
                                        `${f.key}${sx.suffix}`
                                      ] || 0,
                                    ),
                                  0,
                                ),
                              0,
                            )
                          : rowSubTotal;
                        return (
                          <tr
                            key={subKey}
                            className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]"
                          >
                            <td className="px-4 py-2 font-semibold text-[#1e40af] text-xs uppercase tracking-wide border-r border-[#e2e8f0]">
                              {s.label}
                            </td>
                            {WOREDAS.map((w) => (
                              <td
                                key={w.id}
                                className="px-2 py-2 border-r border-[#e2e8f0]"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  value={woredaForms[w.id][subKey] ?? ""}
                                  onChange={(e) =>
                                    handleField(w.id, subKey, e.target.value)
                                  }
                                  placeholder="0"
                                  className="w-full border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-sm text-right bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1e40af]/20"
                                />
                              </td>
                            ))}
                            <td className="px-3 py-2 text-right font-bold text-[#0f172a] bg-[#eff6ff]">
                              {waliigala.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    /* No subs — plain single row */
                    <tr className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                      <td className="px-4 py-2 text-xs text-[#94a3b8] border-r border-[#e2e8f0]">
                        —
                      </td>
                      {WOREDAS.map((w) => (
                        <td
                          key={w.id}
                          className="px-2 py-2 border-r border-[#e2e8f0]"
                        >
                          <input
                            type="number"
                            min="0"
                            value={woredaForms[w.id][f.key] ?? ""}
                            onChange={(e) =>
                              handleField(w.id, f.key, e.target.value)
                            }
                            placeholder="0"
                            className="w-full border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-sm text-right bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#1e40af]/20"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-bold text-[#0f172a] bg-[#eff6ff]">
                        {WOREDAS.reduce(
                          (acc, w) =>
                            acc + Number(woredaForms[w.id][f.key] || 0),
                          0,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#0f766e] text-sm font-semibold">
                <CheckIcon /> Carraa Hojii Uumuu plan saved for all woredas.
              </p>
            )}
            {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
            {!saved && !saveError && (
              <p className="text-[#94a3b8] text-xs">
                This will replace the previous Carraa Hojii plan.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving || !hasValues}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-50 bg-[#1e40af] hover:bg-[#1e3a8a]"
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

// ─── Galii Sassabu (new sector) Subcity Annual Plan Page ─────────────────────
// Subcity enters Mana Qophessaa Total + Idilee Total for the whole subcity.
// Backend distributes proportionally to each woreda plan table using weights.
function GaliiSassabuSubcityPlanPage() {
  const ACCENT = "#c2410c";
  const GRADIENT = "linear-gradient(90deg,#c2410c 0%,#ea580c 100%)";

  const emptyForms = () =>
    Object.fromEntries(
      WOREDAS.map((w) => [w.id, { mana_qophessaa_total: "", idilee_total: "" }])
    );

  const [woredaForms, setWoredaForms] = useState(emptyForms());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    fetchSubcityGaliiSassabuPlan()
      .then((d) => d.plan && setExisting(d.plan))
      .catch(() => {});
  }, []);

  const handleField = (wId, field, val) =>
    setWoredaForms((p) => ({ ...p, [wId]: { ...p[wId], [field]: val } }));

  const totals = {
    mana_qophessaa_total: WOREDAS.reduce(
      (s, w) => s + Number(woredaForms[w.id].mana_qophessaa_total || 0), 0
    ),
    idilee_total: WOREDAS.reduce(
      (s, w) => s + Number(woredaForms[w.id].idilee_total || 0), 0
    ),
  };
  const grandTotal = totals.mana_qophessaa_total + totals.idilee_total;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    const woredaPlans = Object.fromEntries(
      WOREDAS.map((w) => [
        w.id,
        {
          mana_qophessaa_total: Number(woredaForms[w.id].mana_qophessaa_total || 0),
          idilee_total: Number(woredaForms[w.id].idilee_total || 0),
        },
      ])
    );
    try {
      await saveSubcityGaliiSassabuPlan(woredaPlans);
      setSaved(true);
      setWoredaForms(emptyForms());
      setTimeout(() => setSaved(false), 4000);
      fetchSubcityGaliiSassabuPlan()
        .then((d) => d.plan && setExisting(d.plan))
        .catch(() => {});
    } catch (err) {
      setSaveError(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "mana_qophessaa_total", label: "Mana Qophessaa Total", color: "#c2410c" },
    { key: "idilee_total", label: "Idilee Total", color: "#ea580c" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">Annual Plan — Galii Sassabu</h1>
        <p className="text-[#64748b] text-sm mt-0.5">
          Enter Mana Qophessaa Total and Idilee Total for each woreda directly.
        </p>
      </div>

      <PlanUnlockBanner sector="galii_sassabu" />

      {existing && (
        <div className="mb-5 rounded-xl border px-5 py-4" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
          <p className="text-xs font-bold text-[#c2410c] uppercase tracking-wide mb-3">
            Current Saved Plan — Year {existing.year}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-[#64748b]">Mana Qophessaa Total</p>
              <p className="text-lg font-extrabold text-[#1e293b]">
                {Number(existing.mana_qophessaa_total || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Idilee Total</p>
              <p className="text-lg font-extrabold text-[#1e293b]">
                {Number(existing.idilee_total || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Grand Total</p>
              <p className="text-lg font-extrabold text-[#c2410c]">
                {(Number(existing.mana_qophessaa_total || 0) + Number(existing.idilee_total || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((f) => (
          <div key={f.key} className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div
              className="px-5 py-2.5 border-b border-[#e2e8f0] flex items-center gap-2"
              style={{ background: GRADIENT }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
              <p className="text-sm font-semibold text-white">{f.label} (Qarshii)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    {WOREDAS.map((w) => (
                      <th key={w.id} className="text-center px-4 py-2 text-xs font-semibold text-[#334155] uppercase tracking-wide border-r border-[#e2e8f0] min-w-[160px]">
                        {w.name}
                      </th>
                    ))}
                    <th className="text-center px-4 py-2 text-xs font-semibold text-[#0f172a] uppercase tracking-wide bg-[#fff7ed] min-w-[100px]">
                      Waliigala
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f1f5f9]">
                    {WOREDAS.map((w) => (
                      <td key={w.id} className="px-2 py-2 border-r border-[#e2e8f0]">
                        <input
                          type="number"
                          min="0"
                          value={woredaForms[w.id][f.key] ?? ""}
                          onChange={(e) => handleField(w.id, f.key, e.target.value)}
                          placeholder="0"
                          className="w-full border border-[#e2e8f0] rounded-lg px-2 py-1.5 text-sm text-right bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-bold text-[#0f172a] bg-[#fff7ed]">
                      {totals[f.key].toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {grandTotal > 0 && (
          <div className="flex items-center justify-between rounded-xl px-5 py-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
            <span className="text-sm font-semibold text-[#c2410c]">Grand Total (All Woredas)</span>
            <span className="text-xl font-extrabold text-[#c2410c]">{grandTotal.toLocaleString()}</span>
          </div>
        )}

        {saveError && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#991b1b] text-sm">{saveError}</div>
        )}

        <div className="flex items-center justify-between bg-white rounded-xl border border-[#e2e8f0] px-5 py-4">
          <div>
            {saved && (
              <p className="flex items-center gap-2 text-[#166534] text-sm font-semibold">
                <CheckIcon /> Plan saved successfully.
              </p>
            )}
            {!saved && !saveError && (
              <p className="text-[#94a3b8] text-xs">Each woreda gets its own fixed targets.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <><CheckIcon /> Save Plan</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


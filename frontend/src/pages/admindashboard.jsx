import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import api from "../api/api";

// ─── Auth header helper ───────────────────────────────────────────────────────
function authHeader() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function UsersIcon() {
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
function PlusIcon() {
  return (
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
  );
}
function KeyIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function EyeIcon({ show }) {
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
function ShieldIcon() {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function BanIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}
function UnlockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
function CollapseIcon({ collapsed }) {
  return collapsed ? (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg
      className="w-5 h-5"
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

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: "wereda", label: "Wereda" },
  { value: "sub-city", label: "Sub-city" },
  { value: "admin", label: "Admin" },
];

const ROLE_COLORS = {
  wereda: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
  "sub-city": "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  admin: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
};

const SECTOR_LABELS = {
  buusaa: "Buusaa Gonofaa",
  carraa: "Carraa Hojii Uumuu",
  qonna: "Qonna",
  daldala: "Daldala",
  atk: "ATK",
  galii: "Galii Sassaabu",
};

const STATUS_STYLES = {
  pending: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  approved: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
  denied: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
  used: "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]",
  expired: "bg-[#f4f6f9] text-[#64748b] border-[#cbd5e1]",
};

// Returns remaining days string for a pending request, or null
function expiryLabel(req) {
  if (req.status !== "pending" || !req.expires_at) return null;
  const msLeft = new Date(req.expires_at) - new Date();
  if (msLeft <= 0) return "Expired";
  const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  return `${days}d left`;
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function ConfirmModal({ username, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 max-w-sm w-full mx-4">
        <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
          <TrashIcon />
        </div>
        <h2 className="text-lg font-bold text-[#1e293b] text-center mb-2">
          Delete User
        </h2>
        <p className="text-[#64748b] text-sm text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#1e293b]">"{username}"</span>?
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-sm font-medium hover:bg-[#f4f6f9] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ username, userId, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.patch(
        `/auth/users/${userId}/password`,
        { password },
        authHeader(),
      );
      onSuccess(`Password updated for "${username}".`);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 max-w-sm w-full mx-4">
        <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
          <KeyIcon />
        </div>
        <h2 className="text-lg font-bold text-[#1e293b] text-center mb-1">
          Reset Password
        </h2>
        <p className="text-[#64748b] text-sm text-center mb-5">
          Set a new password for{" "}
          <span className="font-semibold text-[#1e293b]">"{username}"</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="New password (min. 6 chars)"
              className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 ${error ? "border-red-400" : "border-[#e2e8f0]"}`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
            >
              <EyeIcon show={show} />
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-sm font-medium hover:bg-[#f4f6f9] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#1a3a5c] hover:bg-[#1e4976] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              {saving ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Plan unlock approval modal ───────────────────────────────────────────────
function PlanUnlockApproveModal({ request, onClose, onApproved }) {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editedPlan, setEditedPlan] = useState({});

  // Map sector to its subcity plan fetch endpoint
  const SECTOR_ENDPOINT = {
    buusaa: "/plans/subcity-plan",
    qonna: "/plans/subcity-qonna-plan",
    galii: "/plans/subcity-generic-plan?sector=galii",
    carraa: "/plans/subcity-generic-plan?sector=carraa",
    daldala: "/plans/subcity-generic-plan?sector=daldala",
    atk: "/plans/subcity-generic-plan?sector=atk",
  };

  useEffect(() => {
    const endpoint = SECTOR_ENDPOINT[request.sector];
    if (!endpoint) {
      setLoading(false);
      return;
    }
    api
      .get(endpoint, authHeader())
      .then((res) => {
        const plan = res.data?.plan || {};
        setPlanData(plan);
        // Skip weight/internal fields — they're 0 for non-buusaa sectors
        const SKIP = new Set(["id", "year", "weight_w1", "weight_w2", "weight_w3", "weight_w4"]);
        const editable = {};
        Object.keys(plan).forEach((k) => {
          if (SKIP.has(k)) return;
          if (typeof plan[k] === "number") editable[k] = plan[k];
        });
        setEditedPlan(editable);
      })
      .catch(() => setError("Could not load current plan data."))
      .finally(() => setLoading(false));
  }, [request.sector]);

  const handleFieldChange = (key, value) => {
    setEditedPlan((p) => ({ ...p, [key]: value === "" ? 0 : Number(value) }));
  };

  const handleApprove = async () => {
    setSaving(true);
    setError("");
    try {
      // First approve the request
      await api.patch(
        `/auth/plan-unlock-requests/${request.id}`,
        { action: "approved" },
        authHeader(),
      );
      onApproved(request);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve.");
    } finally {
      setSaving(false);
    }
  };

  const NUMERIC_FIELD_LABELS = {
    hubannoo_uummuu: "Hubannoo Uummuu",
    horannaa_misensaa: "Horannaa Misensaa",
    buusi_jiraataa: "Buusi Jiraataa",
    gumaata_jiraataa: "Gumaata Jiraataa",
    buusi_daldalaa: "Buusi Daldalaa",
    inisheetivii_buusaa_gonofaa: "Inisheetivii",
    gumaata_mootummaa: "Gumaata Mootummaa",
    nyaata_barataa: "Nyaata Barataa",
    sukkaara: "Sukkaara",
    zayitii: "Zayitii",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div
          className="px-6 py-4 border-b border-[#e2e8f0] sticky top-0 bg-white z-10"
          style={{
            background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
          }}
        >
          <p className="text-white font-bold text-base">Approve Plan Alter Request</p>
          <p className="text-white/60 text-xs mt-0.5">
            {request.username} ·{" "}
            {SECTOR_LABELS[request.sector] ?? request.sector} ·{" "}
            {request.plan_year}
          </p>
        </div>
        <div className="px-6 py-5">
          {request.reason && (
            <div className="mb-4 bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-[#92400e] mb-1">
                Reason from requester
              </p>
              <p className="text-sm text-[#78350f]">{request.reason}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#334155] mb-3">
                Current plan values (read-only preview)
              </p>
              {Object.keys(editedPlan).length === 0 ? (
                <p className="text-[#94a3b8] text-sm text-center py-4">
                  No plan data found for this sector/year.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {Object.entries(editedPlan).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-xs text-[#64748b] font-medium mb-1">
                        {NUMERIC_FIELD_LABELS[key] ?? key}
                      </p>
                      <p className="text-sm text-[#1e293b] border border-[#e2e8f0] rounded-lg px-3 py-2 bg-[#f4f6f9]">
                        {val.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-[#64748b] bg-[#f4f6f9] rounded-lg px-3 py-2 mb-5">
                Approving will allow the subcity to re-submit this annual plan.
                The subcity can then update only the values they need to change.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl text-sm font-medium hover:bg-[#f4f6f9] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="flex-1 bg-[#92400e] hover:bg-[#78350f] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    "Approving..."
                  ) : (
                    <>
                      <CheckIcon /> Approve Request
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared image resize helper ───────────────────────────────────────────────
// Draws the image onto a canvas capped at maxPx×maxPx and exports as JPEG.
// This keeps base64 output well under 1 MB regardless of source file size.
function resizeImageToBase64(file, maxPx = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width >= height) {
            height = Math.round((height / width) * maxPx);
            width = maxPx;
          } else {
            width = Math.round((width / height) * maxPx);
            height = maxPx;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user, onPhotoUpdate }) {
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      return;
    }
    setPhotoError("");
    setPhotoLoading(true);
    try {
      // Resize via canvas so base64 output stays well under 1 MB
      const resized = await resizeImageToBase64(file, 800, 0.75);
      await api.post("/auth/profile/photo", { photo: resized }, authHeader());
      setPhoto(resized);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.profile_photo = resized;
      localStorage.setItem("user", JSON.stringify(stored));
      onPhotoUpdate?.(resized);
      setPhotoSuccess("Profile photo updated.");
      setTimeout(() => setPhotoSuccess(""), 3000);
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to upload photo.");
    } finally {
      setPhotoLoading(false);
    }
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
      await api.post(
        "/auth/change-password",
        { old_password: oldPw, new_password: newPw },
        authHeader(),
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
                {(user.username || "A")[0].toUpperCase()}
              </div>
            )}
            <label
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a3a5c] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[#1e4976] transition-colors"
              title="Change photo"
            >
              <CameraIcon />
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
            <p className="font-bold text-[#1e293b] text-lg">{user.username}</p>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[user.role] ?? "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]"}`}
            >
              {user.role}
            </span>
          </div>
        </div>
        {photoLoading && (
          <p className="text-xs text-[#64748b] mb-2">Uploading photo…</p>
        )}
        {photoError && (
          <p className="text-xs text-red-600 mb-2">{photoError}</p>
        )}
        {photoSuccess && (
          <p className="text-xs text-[#92400e] mb-2">{photoSuccess}</p>
        )}
        <div className="space-y-3">
          {[
            { label: "Username", value: user.username },
            { label: "Role", value: user.role },
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
                <EyeIcon show={showOld} />
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
                <EyeIcon show={showNew} />
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

// ─── Manage Users Tab ─────────────────────────────────────────────────────────
function UsersTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/users", authHeader());
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    const u = users.find((x) => x.id === confirmId);
    try {
      await api.delete(`/auth/users/${confirmId}`, authHeader());
      setConfirmId(null);
      showToast(`"${u?.username}" deleted.`);
      fetchUsers();
    } catch (err) {
      setConfirmId(null);
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === false ? true : false;
    setTogglingId(userId);
    try {
      await api.patch(
        `/auth/users/${userId}/status`,
        { is_active: newStatus },
        authHeader(),
      );
      const u = users.find((x) => x.id === userId);
      showToast(`"${u?.username}" ${newStatus ? "activated" : "deactivated"}.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {confirmId && (
        <ConfirmModal
          username={users.find((u) => u.id === confirmId)?.username ?? ""}
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {passwordUser && (
        <PasswordModal
          username={passwordUser.username}
          userId={passwordUser.id}
          onClose={() => setPasswordUser(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
      {toast && (
        <div className="mb-5 flex items-center gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
          <span className="text-[#92400e]">
            <CheckIcon />
          </span>
          <p className="text-[#92400e] text-sm font-medium">{toast}</p>
        </div>
      )}
      {error && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Registered Users ({users.length})
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              All accounts · passwords are not shown
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  {[
                    "Username",
                    "Phone",
                    "Role",
                    "Status",
                    "Registered",
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
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-b border-[#f1f5f9] transition-colors ${u.is_active === false ? "bg-[#fef2f2]/40" : "hover:bg-[#f8fafc]"}`}
                  >
                    <td className="px-5 py-3 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        {u.profile_photo ? (
                          <img
                            src={u.profile_photo}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(u.username || "?")[0].toUpperCase()}
                          </span>
                        )}
                        <span
                          className={
                            u.is_active === false
                              ? "line-through text-[#94a3b8]"
                              : ""
                          }
                        >
                          {u.username}
                        </span>
                        {u.id === currentUserId && (
                          <span className="text-[10px] font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-1.5 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#64748b]">
                      {u.phone || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role] ?? "bg-[#f4f6f9] text-[#64748b] border-[#e2e8f0]"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${u.is_active === false ? "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]" : "bg-[#fffbeb] text-[#92400e] border-[#fde68a]"}`}
                      >
                        {u.is_active === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#64748b] text-xs">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            setPasswordUser({ id: u.id, username: u.username })
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] hover:bg-[#dce8f4] px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <KeyIcon /> Reset PW
                        </button>
                        {u.id !== currentUserId && (
                          <>
                            <button
                              onClick={() =>
                                handleToggleStatus(u.id, u.is_active)
                              }
                              disabled={togglingId === u.id}
                              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all border disabled:opacity-50 ${
                                u.is_active === false
                                  ? "text-[#92400e] bg-[#fffbeb] border-[#fde68a] hover:bg-[#fde68a]"
                                  : "text-[#92400e] bg-[#fef3c7] border-[#fde68a] hover:bg-[#fde68a]"
                              }`}
                            >
                              {u.is_active === false ? (
                                <>
                                  <UnlockIcon /> Activate
                                </>
                              ) : (
                                <>
                                  <BanIcon /> Deactivate
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmId(u.id)}
                              className="flex items-center gap-1.5 text-xs font-medium text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fecaca] px-2.5 py-1.5 rounded-lg transition-all"
                            >
                              <TrashIcon /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-[#94a3b8] text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Report Edit Permissions Tab ──────────────────────────────────────────────
function PermissionsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("pending");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/edit-requests", authHeader());
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleResolve = async (id, action, username, sector) => {
    try {
      await api.patch(`/auth/edit-requests/${id}`, { action }, authHeader());
      showToast(
        `Request from "${username}" (${SECTOR_LABELS[sector] ?? sector}) ${action}.`,
      );
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update request.");
    }
  };

  // Exclude annual_plan edit requests — those belong in the Annual Plan Requests tab
  const dailyRequests = requests.filter(
    (r) => r.report_type !== "annual_plan",
  );
  const filtered =
    filter === "all"
      ? dailyRequests
      : dailyRequests.filter((r) => r.status === filter);
  const pendingCount = dailyRequests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div>
      {toast && (
        <div className="mb-5 flex items-center gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
          <CheckIcon />
          <p className="text-[#92400e] text-sm font-medium">{toast}</p>
        </div>
      )}
      {error && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm">
          {error}
        </div>
      )}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["pending", "all", "approved", "denied"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${filter === f ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a3a5c]/30"}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-[#dc2626] text-white rounded-full px-1.5 py-0.5 text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={fetchRequests}
          className="ml-auto px-4 py-1.5 rounded-full text-xs font-semibold border bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a3a5c]/30 transition-all"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] px-6 py-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#f4f6f9] flex items-center justify-center mx-auto mb-3">
            <KeyIcon />
          </div>
          <p className="text-[#334155] font-semibold mb-1">
            No {filter === "all" ? "" : filter} requests
          </p>
          <p className="text-[#94a3b8] text-sm">
            Report edit permission requests will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Report Edit Requests ({filtered.length})
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Wereda users requesting to re-submit a locked report
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  {[
                    "Wereda",
                    "Sector",
                    "Report Date",
                    "Report Type",
                    "Requested At",
                    "Status",
                    "Actions",
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
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(r.username || "?")[0].toUpperCase()}
                        </span>
                        {r.username}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] px-2 py-1 rounded-full">
                        {SECTOR_LABELS[r.sector] ?? r.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                      {r.report_date}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs max-w-[160px] truncate">
                      {r.report_type || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[r.status] ?? ""}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleResolve(
                                r.id,
                                "approved",
                                r.username,
                                r.sector,
                              )
                            }
                            className="text-xs font-semibold text-[#92400e] bg-[#fffbeb] border border-[#fde68a] hover:bg-[#fde68a] px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleResolve(
                                r.id,
                                "denied",
                                r.username,
                                r.sector,
                              )
                            }
                            className="text-xs font-semibold text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fecaca] px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#94a3b8] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Plan Unlock Requests Tab ─────────────────────────────────────────────────
function PlanUnlockTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("pending");
  const [approveModal, setApproveModal] = useState(null); // request object

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [planRes, editRes] = await Promise.all([
        api.get("/auth/plan-unlock-requests", authHeader()),
        api.get("/auth/edit-requests", authHeader()),
      ]);
      const planReqs = planRes.data.requests || [];
      // Also surface any annual_plan-typed edit_requests (submitted via the
      // old/wrong path) so they appear here instead of being invisible.
      const legacyPlanReqs = (editRes.data.requests || [])
        .filter((r) => r.report_type === "annual_plan")
        .map((r) => ({
          ...r,
          _legacy: true, // flag so we know it came from edit_requests
          plan_year: r.report_date ? new Date(r.report_date).getFullYear() : "—",
        }));
      // Merge, deduplicating by id+source (plan table ids are separate from edit table ids)
      setRequests([...planReqs, ...legacyPlanReqs]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDeny = async (id, username, sector) => {
    try {
      await api.patch(
        `/auth/plan-unlock-requests/${id}`,
        { action: "denied" },
        authHeader(),
      );
      showToast(`Annual plan alter request from "${username}" denied.`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deny request.");
    }
  };

  const handleApproved = (req) => {
    setApproveModal(null);
    showToast(
      `Annual plan alter approved for "${req.username}" (${SECTOR_LABELS[req.sector] ?? req.sector}).`,
    );
    fetchRequests();
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div>
      {approveModal && (
        <PlanUnlockApproveModal
          request={approveModal}
          onClose={() => setApproveModal(null)}
          onApproved={handleApproved}
        />
      )}
      {toast && (
        <div className="mb-5 flex items-center gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
          <CheckIcon />
          <p className="text-[#92400e] text-sm font-medium">{toast}</p>
        </div>
      )}
      {error && (
        <div className="mb-5 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-[#dc2626] text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {["pending", "all", "approved", "denied"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${filter === f ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a3a5c]/30"}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 bg-[#dc2626] text-white rounded-full px-1.5 py-0.5 text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={fetchRequests}
          className="ml-auto px-4 py-1.5 rounded-full text-xs font-semibold border bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a3a5c]/30 transition-all"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-[#dce8f4] border-t-[#1a3a5c] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] px-6 py-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#f4f6f9] flex items-center justify-center mx-auto mb-3">
            <UnlockIcon />
          </div>
          <p className="text-[#334155] font-semibold mb-1">
            No {filter === "all" ? "" : filter} annual plan alter requests
          </p>
          <p className="text-[#94a3b8] text-sm">
            Requests from the sub-city to alter a locked annual plan will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div
            className="px-5 py-3 border-b border-[#e2e8f0]"
            style={{
              background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white">
              Annual Plan Alter Requests ({filtered.length})
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Sub-city requests to alter a locked annual plan
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                  {[
                    "Requester",
                    "Sector",
                    "Plan Year",
                    "Reason",
                    "Requested At",
                    "Status",
                    "Actions",
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
                {filtered.map((r) => (
                  <tr
                    key={`${r._legacy ? "legacy" : "plan"}-${r.id}`}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(r.username || "?")[0].toUpperCase()}
                        </span>
                        {r.username}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold bg-[#eef4fb] text-[#1a3a5c] border border-[#dce8f4] px-2 py-1 rounded-full">
                        {SECTOR_LABELS[r.sector] ?? r.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                      {r.plan_year}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs max-w-[200px] truncate">
                      {r.reason || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[r.status] ?? ""}`}
                        >
                          {r.status}
                        </span>
                        {expiryLabel(r) && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${expiryLabel(r) === "Expired" ? "bg-[#fef2f2] text-[#991b1b]" : "bg-[#fef3c7] text-[#92400e]"}`}
                          >
                            {expiryLabel(r)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {!r._legacy && r.status === "pending" &&
                      expiryLabel(r) !== "Expired" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setApproveModal(r)}
                            className="text-xs font-semibold text-[#92400e] bg-[#fffbeb] border border-[#fde68a] hover:bg-[#fde68a] px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            Review & Approve
                          </button>
                          <button
                            onClick={() =>
                              handleDeny(r.id, r.username, r.sector)
                            }
                            className="text-xs font-semibold text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fecaca] px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#94a3b8] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Create User Form ─────────────────────────────────────────────────────────
function CreateUserTab() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    phone: "",
    role: "wereda",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required.";
    else if (form.username.trim().length < 3)
      next.username = "Username must be at least 3 characters.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.role) next.role = "Please select a role.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    setSuccess("");
    try {
      await api.post(
        "/auth/register",
        {
          username: form.username.trim(),
          password: form.password,
          phone: form.phone.trim(),
          role: form.role,
        },
        authHeader(),
      );
      setSuccess(
        `Account created for "${form.username.trim()}" (${form.role}).`,
      );
      setForm({ username: "", password: "", phone: "", role: "wereda" });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Failed to create user. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div
          className="px-6 py-4 border-b border-[#e2e8f0]"
          style={{
            background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <PlusIcon />
            <p className="text-white font-semibold text-sm">New Account</p>
          </div>
          <p className="text-white/60 text-xs mt-0.5">
            All fields are required.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5"
          noValidate
        >
          {success && (
            <div className="flex items-center gap-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3">
              <span className="text-[#92400e]">
                <CheckIcon />
              </span>
              <p className="text-[#92400e] text-sm font-medium">{success}</p>
            </div>
          )}
          {serverError && (
            <div className="flex items-center gap-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
              <p className="text-[#dc2626] text-sm">{serverError}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">
              Username
            </label>
            <input
              name="username"
              type="text"
              autoComplete="off"
              placeholder="e.g. Aanaa Gooroo"
              value={form.username}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 ${errors.username ? "border-red-400" : "border-[#e2e8f0]"}`}
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 ${errors.password ? "border-red-400" : "border-[#e2e8f0]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]"
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              autoComplete="off"
              placeholder="e.g. 0911234567"
              value={form.phone}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 ${errors.phone ? "border-red-400" : "border-[#e2e8f0]"}`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-1.5">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((r) => (
                <div
                  key={r.value}
                  onClick={() => {
                    setForm((p) => ({ ...p, role: r.value }));
                    setErrors((p) => ({ ...p, role: "" }));
                  }}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center transition-all ${form.role === r.value ? "border-[#1a3a5c] bg-[#eef4fb] text-[#1a3a5c] font-semibold" : "border-[#e2e8f0] bg-[#f4f6f9] text-[#64748b] hover:border-[#1a3a5c]/30"}`}
                >
                  <p className="text-xs font-medium">{r.label}</p>
                </div>
              ))}
            </div>
            {errors.role && (
              <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1a3a5c] hover:bg-[#1e4976] text-white font-semibold py-3 text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating account…
              </>
            ) : (
              <>
                <PlusIcon /> Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const [activeNav, setActiveNav] = useState("create");
  const [collapsed, setCollapsed] = useState(false);
  const sideW = collapsed ? "w-16" : "w-64";
  const [profilePhoto, setProfilePhoto] = useState(user.profile_photo || null);

  // Count pending requests for badge
  const [pendingEditCount, setPendingEditCount] = useState(0);
  const [pendingPlanCount, setPendingPlanCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [editRes, planRes] = await Promise.all([
          api.get("/auth/edit-requests", authHeader()),
          api.get("/auth/plan-unlock-requests", authHeader()),
        ]);
        setPendingEditCount(
          (editRes.data.requests || []).filter(
            (r) => r.status === "pending" && r.report_type !== "annual_plan",
          ).length,
        );
        setPendingPlanCount(
          (planRes.data.requests || []).filter((r) => r.status === "pending")
            .length,
        );
      } catch {
        /* silent */
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalPending = pendingEditCount + pendingPlanCount;

  const NAV_ITEMS = [
    { id: "create", label: "Create User", Icon: PlusIcon },
    { id: "users", label: "Manage Users", Icon: UsersIcon },
    {
      id: "permissions",
      label: "Report Permissions",
      Icon: KeyIcon,
      badge: pendingEditCount,
    },
    {
      id: "plan_unlock",
      label: "Annual Plan Requests",
      Icon: UnlockIcon,
      badge: pendingPlanCount,
    },
    { id: "profile", label: "Profile", Icon: ProfileIcon },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case "create":
        return <CreateUserTab />;
      case "users":
        return <UsersTab currentUserId={user.id} />;
      case "permissions":
        return <PermissionsTab />;
      case "plan_unlock":
        return <PlanUnlockTab />;
      case "profile":
        return <ProfilePage user={user} onPhotoUpdate={setProfilePhoto} />;
      default:
        return null;
    }
  };

  const pageTitle =
    {
      create: "Create User",
      users: "Manage Users",
      permissions: "Report Edit Permissions",
      plan_unlock: "Annual Plan Alter Requests",
      profile: "Profile",
    }[activeNav] ?? "Admin";

  return (
    <div
      className="flex h-screen max-h-screen bg-[#f4f6f9] font-['DM_Sans',system-ui,sans-serif] overflow-hidden"
      style={{ position: "fixed", inset: 0 }}
    >
      {/* ════ SIDEBAR ════ */}
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
                Admin
              </p>
              <p className="text-white/50 text-xs truncate">Reporting System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeNav === id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="relative flex-shrink-0">
                <Icon />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-[#dc2626] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-0.5 leading-none">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </span>
              {!collapsed && (
                <span className="truncate flex-1 text-left">{label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom: logout + collapse */}
        <div className="px-2 py-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
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

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[#1e293b] font-semibold text-base">
            {pageTitle}
          </h2>
          <div className="flex items-center gap-3">
            {totalPending > 0 && (
              <span className="text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] px-2.5 py-1 rounded-full">
                {totalPending} pending
              </span>
            )}
            <button
              onClick={() => setActiveNav("profile")}
              title="Profile"
              className="flex-shrink-0 focus:outline-none"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#dce8f4] hover:border-[#1a3a5c] transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold hover:bg-[#1e4976] transition-all">
                  {(user.username || "A")[0].toUpperCase()}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

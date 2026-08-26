import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import api from "../api/api";

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

const ROLE_OPTIONS = [
  { value: "wereda", label: "Wereda" },
  { value: "sub-city", label: "Sub-city" },
  { value: "admin", label: "Admin" },
];

const ROLE_COLORS = {
  wereda: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  "sub-city": "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  admin: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
};

function authHeader() {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
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
          This action cannot be undone.
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

// ─── Password Modal ───────────────────────────────────────────────────────────
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

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null); // { id, username }

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
          onSuccess={(msg) => {
            showToast(msg);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="mb-5 flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
          <span className="text-[#166534]">
            <CheckIcon />
          </span>
          <p className="text-[#166534] text-sm font-medium">{toast}</p>
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
                  {["Username", "Phone", "Role", "Registered", "Actions"].map(
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
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-[#1e293b]">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.username[0].toUpperCase()}
                        </span>
                        {u.username}
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
                    <td className="px-5 py-3 text-[#64748b] text-xs">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setPasswordUser({ id: u.id, username: u.username })
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-[#1a3a5c] bg-[#eef4fb] border border-[#dce8f4] hover:bg-[#dce8f4] px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <KeyIcon /> Reset Password
                        </button>
                        {u.id !== currentUserId && (
                          <button
                            onClick={() => setConfirmId(u.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fecaca] px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            <TrashIcon /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const [activeTab, setActiveTab] = useState("create"); // "create" | "users"

  // ── Create user form state ──
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col">
      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 shadow-md"
        style={{ background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-9 w-9 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Reporting System
            </p>
            <p className="text-white/60 text-xs">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {(user.username || "A")[0].toUpperCase()}
              </span>
            </div>
            <span className="text-white text-sm font-medium">
              {user.username || "Admin"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-white text-sm"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Page title */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#1a3a5c 0%,#1e4976 100%)",
            }}
          >
            <UsersIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">
              User Management
            </h1>
            <p className="text-[#64748b] text-sm mt-0.5">
              Create accounts, reset passwords, and manage users.
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "create", label: "Create User", icon: <PlusIcon /> },
            { id: "users", label: "Manage Users", icon: <UsersIcon /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === id
                  ? "bg-[#1a3a5c] text-white border-[#1a3a5c] shadow-sm"
                  : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a3a5c]/30 hover:text-[#1a3a5c]"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── Create User Tab ── */}
        {activeTab === "create" && (
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
                  <p className="text-white font-semibold text-sm">
                    New Account
                  </p>
                </div>
                <p className="text-white/60 text-xs mt-0.5">
                  All fields are required. The user will log in with these
                  credentials.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="px-6 py-6 space-y-5"
                noValidate
              >
                {success && (
                  <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
                    <span className="text-[#166534] flex-shrink-0">
                      <CheckIcon />
                    </span>
                    <p className="text-[#166534] text-sm font-medium">
                      {success}
                    </p>
                  </div>
                )}
                {serverError && (
                  <div className="flex items-center gap-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                    <svg
                      className="w-5 h-5 text-[#dc2626] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-[#dc2626] text-sm">{serverError}</p>
                  </div>
                )}

                {/* Username */}
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
                    className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] transition-colors ${errors.username ? "border-red-400" : "border-[#e2e8f0]"}`}
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] transition-colors ${errors.password ? "border-red-400" : "border-[#e2e8f0]"}`}
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
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Phone */}
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
                    className={`w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c] transition-colors ${errors.phone ? "border-red-400" : "border-[#e2e8f0]"}`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Role */}
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
                        className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center transition-all ${
                          form.role === r.value
                            ? "border-[#1a3a5c] bg-[#eef4fb] text-[#1a3a5c] font-semibold"
                            : "border-[#e2e8f0] bg-[#f4f6f9] text-[#64748b] hover:border-[#1a3a5c]/30"
                        }`}
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
                      Creating account...
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
        )}

        {/* ── Manage Users Tab ── */}
        {activeTab === "users" && <UsersTab currentUserId={user.id} />}
      </main>
    </div>
  );
}

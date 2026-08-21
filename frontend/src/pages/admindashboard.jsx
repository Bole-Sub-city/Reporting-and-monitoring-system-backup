import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";
import api from "../api/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function EyeIcon({ show }) {
  return show ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: "wereda",   label: "Wereda" },
  { value: "sub-city", label: "Sub-city" },
  { value: "admin",    label: "Admin" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();

  // read logged-in admin from localStorage
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  // ── form state ──
  const [form, setForm] = useState({ username: "", password: "", phone: "", role: "wereda" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  // ── handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const validate = () => {
    const next = {};
    if (!form.username.trim())        next.username = "Username is required.";
    else if (form.username.trim().length < 3) next.username = "Username must be at least 3 characters.";
    if (!form.password)               next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.phone.trim())           next.phone = "Phone number is required.";
    if (!form.role)                   next.role = "Please select a role.";
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
      const token = localStorage.getItem("token");
      await api.post(
        "/auth/register",
        { username: form.username.trim(), password: form.password, phone: form.phone.trim(), role: form.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Account created for "${form.username.trim()}" (${form.role}).`);
      setForm({ username: "", password: "", phone: "", role: "wereda" });
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col">

      {/* ── Top nav ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 shadow-md"
        style={{ background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Reporting System</p>
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
            <span className="text-white text-sm font-medium">{user.username || "Admin"}</span>
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
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Page title */}
          <div className="mb-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
              style={{ background: "linear-gradient(135deg,#1a3a5c 0%,#1e4976 100%)" }}
            >
              <UsersIcon />
              <span className="sr-only">Users</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1e293b]">Create New User</h1>
            <p className="text-[#64748b] text-sm mt-1">
              Set up a username, password, and role for a new staff member.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">

            {/* Card header */}
            <div
              className="px-6 py-4 border-b border-[#e2e8f0]"
              style={{ background: "linear-gradient(90deg,#1a3a5c 0%,#1e4976 100%)" }}
            >
              <div className="flex items-center gap-2">
                <PlusIcon />
                <p className="text-white font-semibold text-sm">New Account</p>
              </div>
              <p className="text-white/60 text-xs mt-0.5">
                All fields are required. The user will log in with the credentials you set here.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5" noValidate>

              {/* Success banner */}
              {success && (
                <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
                  <span className="text-[#166534] flex-shrink-0"><CheckIcon /></span>
                  <p className="text-[#166534] text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Server error banner */}
              {serverError && (
                <div className="flex items-center gap-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-[#dc2626] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-[#dc2626] text-sm">{serverError}</p>
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#334155] mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Aanaa Gooroo"
                  value={form.username}
                  onChange={handleChange}
                  className={[
                    "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8]",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]",
                    errors.username ? "border-red-400" : "border-[#e2e8f0]",
                  ].join(" ")}
                />
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#334155] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className={[
                      "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 pr-11 text-sm text-[#1e293b] placeholder:text-[#94a3b8]",
                      "transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]",
                      errors.password ? "border-red-400" : "border-[#e2e8f0]",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon show={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.password}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#334155] mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="off"
                  placeholder="e.g. 0911234567"
                  value={form.phone}
                  onChange={handleChange}
                  className={[
                    "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8]",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]",
                    errors.phone ? "border-red-400" : "border-[#e2e8f0]",
                  ].join(" ")}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.phone}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-[#334155] mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={[
                    "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b]",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/20 focus:border-[#1a3a5c]",
                    errors.role ? "border-red-400" : "border-[#e2e8f0]",
                  ].join(" ")}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.role}</p>
                )}
                {/* Role hint */}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ROLE_OPTIONS.map((r) => (
                    <div
                      key={r.value}
                      onClick={() => { setForm((p) => ({ ...p, role: r.value })); setErrors((p) => ({ ...p, role: "" })); }}
                      className={[
                        "cursor-pointer rounded-lg border px-3 py-2 text-center transition-all",
                        form.role === r.value
                          ? "border-[#1a3a5c] bg-[#eef4fb] text-[#1a3a5c] font-semibold"
                          : "border-[#e2e8f0] bg-[#f4f6f9] text-[#64748b] hover:border-[#1a3a5c]/30",
                      ].join(" ")}
                    >
                      <p className="text-xs font-medium">{r.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#1a3a5c] hover:bg-[#1e4976] active:bg-[#163152] text-white font-semibold py-3 text-sm
                           transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a5c]/40
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Create Account
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Info note */}
          <div className="mt-4 flex items-start gap-2 bg-[#eef4fb] border border-[#dce8f4] rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-[#1a3a5c] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[#1a3a5c] text-xs leading-relaxed">
              The new user will log in using the username and password you set here.
              For wereda accounts, make sure the username exactly matches one of the four registered woreda names
              (<strong>Aanaa Gooroo</strong>, <strong>Aanaa Dhadacha Araaraa</strong>, <strong>Aanaa Dhakaa Adii</strong>, <strong>Aanaa Andoodee</strong>)
              so the system can link them to the correct plan tables.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import api from "../api/api";
import logo from "../assets/adamalogo.png";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await api.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user.role;

      // Redirect based on role – supports both "sub-city" and "subcity"
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "sub-city" || role === "subcity") {
        navigate("/sub-city/dashboard", { replace: true });
      } else if (role === "wereda") {
        navigate("/wereda/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      // No response at all = network is down (ERR_NETWORK / timeout / DNS failure)
      const isNetworkError =
        !err.response ||
        err.code === "ERR_NETWORK" ||
        err.code === "ECONNABORTED" ||
        err.message === "Network Error";

      setServerError(
        isNetworkError
          ? "Cannot reach the server. Please check your internet connection and try again."
          : err.response?.data?.message || "Invalid username or password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Gradient border wrapper — amber → navy on all sides */}
        <div className="rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#1a3a5c] p-[4px] shadow-lg">
          <div className="rounded-2xl bg-white p-8 sm:p-10">
            {/* Small logo inside card */}
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="logo"
                className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-[#e2e8f0]"
              />
            </div>

            <h2 className="text-center text-2xl font-semibold text-[#1a3a5c]">
              Sign in to your account
            </h2>
            <p className="mt-1 text-center text-xs font-semibold tracking-widest text-[#475569]">
              Enter your credentials to access your dashboard.
            </p>

            {serverError && (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm flex items-center gap-2 ${
                  serverError.includes("server") ||
                  serverError.includes("internet") ||
                  serverError.includes("connection")
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  {serverError.includes("server") ||
                  serverError.includes("internet") ||
                  serverError.includes("connection") ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4M12 16h.01" />
                    </>
                  )}
                </svg>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              <div className="w-full text-left">
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#334155]"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className={[
                    "w-full rounded-lg border bg-[#f8fafc] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#cbd5e1]",
                    "transition-colors duration-200",
                    "focus:border-[#1a3a5c] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/15",
                    errors.username ? "border-red-400" : "border-[#e2e8f0]",
                  ].join(" ")}
                />
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="w-full text-left">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#334155]"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={[
                    "w-full rounded-lg border bg-[#f8fafc] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#cbd5e1]",
                    "transition-colors duration-200",
                    "focus:border-[#1a3a5c] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/15",
                    errors.password ? "border-red-400" : "border-[#e2e8f0]",
                  ].join(" ")}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#f59e0b] hover:bg-[#d97706] px-8 py-3 text-base font-bold text-white
                         transition-all duration-200 hover:-translate-y-0.5 shadow-md
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]/40
                         disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

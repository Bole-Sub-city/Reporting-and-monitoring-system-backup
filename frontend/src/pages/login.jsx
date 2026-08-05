import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import api from "../api/api";

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
        navigate("/admin/dashboard");
      } else if (role === "sub-city" || role === "subcity") {
        navigate("/sub-city/dashboard");
      } else if (role === "wereda") {
        navigate("/wereda/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid username or password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center font-serif text-2xl font-semibold text-[#1a3a5c]">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-sm text-[#64748b]">
            Enter your credentials to access your dashboard.
          </p>

          {serverError && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="w-full text-left">
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[#334155]">
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
                  "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8]",
                  "transition-colors duration-200",
                  "focus:border-[#1a3a5c] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/15",
                  errors.username ? "border-red-400" : "border-[#e2e8f0]",
                ].join(" ")}
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.username}</p>
              )}
            </div>

            <div className="w-full text-left">
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#334155]">
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
                  "w-full rounded-lg border bg-[#f4f6f9] px-4 py-3 text-sm text-[#1e293b] placeholder:text-[#94a3b8]",
                  "transition-colors duration-200",
                  "focus:border-[#1a3a5c] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/15",
                  errors.password ? "border-red-400" : "border-[#e2e8f0]",
                ].join(" ")}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600" role="alert">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1a3a5c] px-8 py-3 text-base font-semibold text-white
                         transition-all duration-200 hover:bg-[#1e4976]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a5c]/40
                         disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

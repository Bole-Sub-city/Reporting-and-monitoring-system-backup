import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
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

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "sub-city") {
        navigate("/sub-city/dashboard");
      } else if (role === "wereda") {
        navigate("/wereda/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid username or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-navy-900/50 p-6 backdrop-blur-sm sm:p-8">
          <h2 className="text-center font-serif text-2xl font-semibold text-gold-gradient">
            Sign in to your account
          </h2>

          <p className="mt-2 text-center text-sm text-slate-400">
            Enter your credentials to access your dashboard.
          </p>

          {serverError && (
            <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full pt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

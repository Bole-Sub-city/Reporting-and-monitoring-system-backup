import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import RoleSelector from "../components/auth/RoleSelector";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { ROLE_OPTIONS } from "../constants/roles";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "";

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoleLabel = useMemo(
    () => ROLE_OPTIONS.find((role) => role.id === selectedRole)?.label,
    [selectedRole],
  );

  const validate = () => {
    const nextErrors = {};

    if (!selectedRole) {
      nextErrors.role = "Please select your role.";
    }

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Prototype: account requests may require admin approval later
    await new Promise((resolve) => setTimeout(resolve, 700));

    navigate("/login", {
      state: {
        message: `Account request submitted for ${selectedRoleLabel}. An administrator will review your registration.`,
        role: selectedRole,
      },
    });

    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-navy-900/50 p-6 backdrop-blur-sm sm:p-8">
          <h2 className="text-center font-serif text-2xl font-semibold text-gold-gradient">
            Create account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Register as Admin, Sub-city, or Wereda. Account approval may be
            required by an administrator.
          </p>

          <div className="mt-8">
            <RoleSelector
              roles={ROLE_OPTIONS}
              selectedRole={selectedRole}
              onSelect={(role) => {
                setSelectedRole(role);
                setErrors((prev) => ({ ...prev, role: "" }));
              }}
              error={errors.role}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <Input
              id="fullName"
              name="fullName"
              label="Full name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Create account"}
            </Button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to={selectedRole ? `/login?role=${selectedRole}` : "/login"}
                className="font-medium text-gold-400 underline-offset-4 hover:text-gold-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

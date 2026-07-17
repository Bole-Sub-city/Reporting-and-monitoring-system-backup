<<<<<<< HEAD
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import RoleSelector from '../components/auth/RoleSelector'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ROLE_OPTIONS } from '../constants/roles'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || ''

  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedRoleLabel = useMemo(
    () => ROLE_OPTIONS.find((role) => role.id === selectedRole)?.label,
    [selectedRole],
  )

  const validate = () => {
    const nextErrors = {}

    if (!selectedRole) {
      nextErrors.role = 'Please select your role.'
    }

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Prototype: account requests may require admin approval later
    await new Promise((resolve) => setTimeout(resolve, 700))

    navigate('/login', {
      state: {
        message: `Account request submitted for ${selectedRoleLabel}. An administrator will review your registration.`,
        role: selectedRole,
      },
    })

    setIsSubmitting(false)
  }

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
                setSelectedRole(role)
                setErrors((prev) => ({ ...prev, role: '' }))
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

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Create account'}
            </Button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                to={selectedRole ? `/login?role=${selectedRole}` : '/login'}
                className="font-medium text-gold-400 underline-offset-4 hover:text-gold-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend registration
    console.log("Signup attempt:", form);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-['DM_Sans',system-ui,sans-serif]"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #1a3060 0%, #0d1f3c 45%, #070f1e 100%)",
      }}
    >
      {/* Back to home */}
      <Link
        to="/"
        className="fixed top-5 left-6 text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md animate-rise">
        {/* Card */}
        <div className="bg-[#0d1f3c]/80 border border-white/10 rounded-2xl px-8 py-10 shadow-2xl backdrop-blur-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-[#d4af62] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Adama, Oromia
            </p>
            <h1 className="font-['Fraunces',Georgia,serif] text-3xl font-bold text-[#d4af62]">
              Buusaa Gonofaa
            </h1>
            <p className="text-[#9aafc7] text-sm mt-2">Create a new account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#9aafc7] text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full bg-[#0a1628] border border-white/15 rounded-lg px-4 py-3 text-white
                           text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/70
                           focus:ring-1 focus:ring-[#c9a84c]/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#9aafc7] text-sm font-medium mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                className="w-full bg-[#0a1628] border border-white/15 rounded-lg px-4 py-3 text-white
                           text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/70
                           focus:ring-1 focus:ring-[#c9a84c]/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#9aafc7] text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full bg-[#0a1628] border border-white/15 rounded-lg px-4 py-3 text-white
                           text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/70
                           focus:ring-1 focus:ring-[#c9a84c]/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#9aafc7] text-sm font-medium mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repeat your password"
                className="w-full bg-[#0a1628] border border-white/15 rounded-lg px-4 py-3 text-white
                           text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/70
                           focus:ring-1 focus:ring-[#c9a84c]/40 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-[#0a1628] font-semibold
                         py-3 rounded-lg text-sm tracking-wide transition-all duration-200
                         hover:-translate-y-0.5 mt-2"
            >
              Create Account
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-[#9aafc7] text-xs mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#d4af62] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
>>>>>>> 2f82f9058a14098d65d0f9e4abd2e7b1ccd53496

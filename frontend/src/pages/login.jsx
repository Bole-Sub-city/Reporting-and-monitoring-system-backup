import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { ROLE_OPTIONS, ROLE_DASHBOARD_PATHS } from '../constants/roles'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '')
  const [notice, setNotice] = useState(location.state?.message || '')
  const [formData, setFormData] = useState({ phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (location.state?.role) {
      setSelectedRole(location.state.role)
    }
  }, [location.state?.role])

  const validateForm = () => {
    const nextErrors = {}

    if (!selectedRole) {
      nextErrors.role = 'Please select your role.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!/^[\d\s+()-]{7,20}$/.test(formData.phone.trim())) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const dashboardPath = ROLE_DASHBOARD_PATHS[selectedRole]
    navigate(dashboardPath, {
      state: {
        role: selectedRole,
        phone: formData.phone,
      },
    })

    setIsSubmitting(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value)
    setErrors((prev) => ({ ...prev, role: '' }))
  }

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

          {notice && (
            <p className="mt-4 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-center text-sm text-gold-400">
              {notice}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <Select
              id="role"
              name="role"
              label="Select your role"
              value={selectedRole}
              onChange={handleRoleChange}
              error={errors.role}
            >
              <option value="" disabled>
                Choose a role
              </option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </Select>

            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              autoComplete="tel"
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
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

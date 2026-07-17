import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from '../pages/home'
import Login from '../pages/login'
import AdminDashboard from '../pages/admindashboard'
import SubCityDashboard from '../pages/subcitydashboard'
import WoRedaDashboard from '../pages/woredadashboard'

// Wraps WoRedaDashboard and pulls user info from login navigation state
function WoRedaDashboardWrapper() {
  const { state } = useLocation()
  // Build user object from login state; fall back to defaults for dev
  const user = {
    name:     state?.name     || "Biruk Haile",
    woreda:   state?.woreda   || "Woreda 08",
    subcity:  state?.subcity  || "Kirkos",
    initials: state?.initials || "BH",
  }
  return <WoRedaDashboard user={user} />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"      element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Role dashboards — login redirects here based on selected role */}
      <Route path="/admin/dashboard"    element={<AdminDashboard />} />
      <Route path="/sub-city/dashboard" element={<SubCityDashboard />} />
      <Route path="/wereda/dashboard"   element={<WoRedaDashboardWrapper />} />

      {/* Fallback → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

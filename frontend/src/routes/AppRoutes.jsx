import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import AdminDashboard from '../pages/admindashboard'
import SubCityDashboard from '../pages/subcitydashboard'
import WeredaDashboard from '../pages/wereda'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/sub-city/dashboard" element={<SubCityDashboard />} />
      <Route path="/wereda/dashboard" element={<WeredaDashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

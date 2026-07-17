import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/home'
import Login from '../pages/login'
import Signup from '../pages/signup'
import AdminDashboard from '../pages/admindashboard'
import SubCityDashboard from '../pages/subcitydashboard'
import WeredaDashboard from '../pages/wereda'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/sub-city/dashboard" element={<SubCityDashboard />} />
      <Route path="/wereda/dashboard" element={<WeredaDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

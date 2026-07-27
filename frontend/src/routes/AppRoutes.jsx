import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import AdminDashboard from "../pages/admindashboard";
import WoRedaDashboard from "../pages/woredadashboard";
import SubCityDashboard from "../pages/subcitydashboard"; // <-- import the sub‑city component

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* Role dashboards */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/sub-city/dashboard" element={<SubCityDashboard />} />{" "}
      {/* use SubCityDashboard */}
      <Route path="/wereda/dashboard" element={<WoRedaDashboard />} />
      {/* Fallback → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

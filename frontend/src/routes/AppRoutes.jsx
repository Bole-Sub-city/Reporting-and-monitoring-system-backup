import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import AdminDashboard from "../pages/admindashboard";
import WoRedaDashboard from "../pages/woredadashboard";
import SubCityDashboard from "../pages/subcitydashboard";

// ─── Auth guard ───────────────────────────────────────────────────────────────
// Redirects to /login if there is no token in localStorage.
// Uses replace so the login page replaces the current history entry —
// pressing Back after login won't return to the protected route.
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected role dashboards */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/sub-city/dashboard"
        element={
          <PrivateRoute>
            <SubCityDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/wereda/dashboard"
        element={
          <PrivateRoute>
            <WoRedaDashboard />
          </PrivateRoute>
        }
      />

      {/* Fallback → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

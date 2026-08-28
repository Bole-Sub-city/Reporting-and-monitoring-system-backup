import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import AdminDashboard from "../pages/admindashboard";
import WoRedaDashboard from "../pages/woredadashboard";
import SubCityDashboard from "../pages/subcitydashboard";

// ─── Role → home route map ────────────────────────────────────────────────────
function dashboardPathForRole(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "sub-city" || role === "subcity") return "/sub-city/dashboard";
  if (role === "wereda") return "/wereda/dashboard";
  return "/login";
}

// ─── Auth + role guard ────────────────────────────────────────────────────────
// Redirects to /login when unauthenticated.
// Redirects to the user's own dashboard when the role doesn't match `allowedRole`.
function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "";
    // Normalise "subcity" / "sub-city" so both map to the same check
    const normalised = role === "subcity" ? "sub-city" : role;
    const allowed =
      allowedRole === "sub-city"
        ? normalised === "sub-city"
        : normalised === allowedRole;

    if (!allowed) {
      return <Navigate to={dashboardPathForRole(role)} replace />;
    }
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
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/sub-city/dashboard"
        element={
          <PrivateRoute allowedRole="sub-city">
            <SubCityDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/wereda/dashboard"
        element={
          <PrivateRoute allowedRole="wereda">
            <WoRedaDashboard />
          </PrivateRoute>
        }
      />

      {/* Fallback → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { useNavigate } from "react-router-dom";
import logo from "../assets/adamalogo.png";

export default function SubCityDashboard({ user: propUser }) {
  const navigate = useNavigate();

  // Fallback to localStorage if no prop passed
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = propUser || storedUser;

  const u = {
    name: user?.username || "Sub-city User",
    role: user?.role || "sub-city",
    initials: (user?.username || "S").slice(0, 2).toUpperCase(),
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold text-gray-800 text-sm">
            Reporting System
          </span>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {u.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{u.name}</p>
              <p className="text-xs text-gray-500 capitalize">{u.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menu
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Sub-city Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {u.name}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Sub-city Overview
          </h2>
          <p className="text-gray-400 text-sm max-w-sm">
            The sub-city dashboard is under development. Monitoring and
            reporting features will appear here.
          </p>
          <span className="mt-4 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full">
            Coming Soon
          </span>
        </div>
      </main>
    </div>
  );
}

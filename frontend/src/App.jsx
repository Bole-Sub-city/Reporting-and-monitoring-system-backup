import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Signup from "./pages/signup";
import WoRedaDashboard from "./pages/woredadashboard";

// Placeholder until teammate builds the login page
function LoginPlaceholder() {
  return (
    <div
      className="min-h-screen flex items-center justify-center text-center font-['DM_Sans',system-ui,sans-serif]"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #1a3060 0%, #0d1f3c 45%, #070f1e 100%)",
      }}
    >
      <div className="text-[#9aafc7]">
        <p className="text-[#d4af62] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Adama, Oromia
        </p>
        <h1 className="font-['Fraunces',Georgia,serif] text-4xl font-bold text-[#d4af62] mb-3">
          Login
        </h1>
        <p className="mb-6">This page is being built by a teammate.</p>
        <a
          href="/"
          className="border border-white/40 text-white/80 px-6 py-2 rounded-full text-sm hover:bg-white/10 transition-all"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<LoginPlaceholder />} />
        <Route path="/signup"  element={<Signup />} />
        {/* One dashboard component handles all 4 woredas via user prop from login */}
        <Route path="/woreda"  element={<WoRedaDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

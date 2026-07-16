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

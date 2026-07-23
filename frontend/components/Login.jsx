import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const [passwordtype, setpasswordtype] = useState('password')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        window.location.href = "/drive";
      } else {
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  async function googleregister(data) {
    const { credential } = data;

    const response = await fetch(`${BASE_URL}/user/googleregister`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    });
    const output = await response.json();

    if (output == 'register') {
      navigate('/drive')
    }

  }

  async function checklogin() {
    const res = await fetch(`${BASE_URL}/checklogin`, {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data === "already login");
    if (data === "already login") {
      navigate("/drive");
    }
  }

  useEffect(() => {
    checklogin()
  }, []);
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] relative overflow-hidden font-sans bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px]">

        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-1 flex-col justify-center lg:px-16 lg:py-20 relative z-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900 mb-10 lg:mb-14 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl sm:text-3xl">☁️</span>
            CloudVault
          </Link>

          <div className="max-w-lg">
            {/* Heading design matching landing page sections */}
            <span className="text-[#868A8E] text-[11px] uppercase tracking-[2px] font-black block mb-3">
              SIGN IN TO YOUR ACCOUNT
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-black leading-[1.06] tracking-tight text-gray-800 mb-4 uppercase select-none">
              Welcome Back<br />
              <span className="text-gray-800">To CloudVault</span>
            </h1>

            {/* Lime badge */}
            <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10px] font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-6 hover:rotate-0 transition-transform">
              YOUR FILES ARE WAITING
            </div>

            <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-10 max-w-md">
              Access your files from anywhere. Your data is encrypted end-to-end
              and always under your control.
            </p>

            {/* Floating feature cards - desktop only */}
            <div className="hidden lg:flex flex-col gap-4">
              {[
                { ico: "🔐", label: "Bank-level encryption", color: "#CCFF00" },
                { ico: "⚡", label: "Lightning-fast sync", color: "#1A6EEF" },
                { ico: "🌍", label: "Access from anywhere", color: "#9D5CFF" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] shrink-0"
                    style={{ background: feature.color }}
                  >
                    {feature.ico}
                  </div>
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating decorative card - bottom left */}
          <div className="hidden lg:block absolute left-[43%] bottom-[10%] animate-bounce" style={{ animationDuration: "6s" }}>
            <div className="bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[4deg] max-w-[150px]">
              <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Storage</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-lg font-black text-gray-900 leading-none">99.9</span>
                <span className="text-[9px] font-bold text-gray-400 mb-0.5">% uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 sm:py-16 lg:px-10 relative z-10">
          {/* Form card with neo-brutalist styling */}
          <div className="w-full max-w-md bg-white border-2 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl p-8 sm:p-10">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 mb-2 uppercase">
                Sign In
              </h2>
              <p className="text-xs text-gray-500 font-semibold">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-gray-900 font-black hover:underline transition-colors"
                >
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  googleregister(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              />
            </div>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-[2px] bg-gray-900/15"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-[2px] bg-gray-900/15"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-black text-gray-900 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${errors.email ? "border-red-500" : "border-gray-900"} rounded-xl text-sm font-bold text-gray-900 bg-white placeholder-gray-400 transition-all duration-200 outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px]`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <span className="text-[10px] font-bold text-red-500">{errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-black text-gray-900 uppercase tracking-wider"
                  >
                    Password
                  </label>
                </div>
                <input
                  type={passwordtype}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 ${errors.password ? "border-red-500" : "border-gray-900"} rounded-xl text-sm font-bold text-gray-900 bg-white placeholder-gray-400 transition-all duration-200 outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px]`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="text-[10px] font-bold text-red-500">
                    {errors.password}
                  </span>
                )}
                <div className="w-5 h-5 absolute top-9 right-3 cursor-pointer" onClick={() => {
                  setpasswordtype(passwordtype === 'password' ? 'text' : 'password')
                }}>
                  {passwordtype === 'password' && <img src="/hide.png"></img>}
                  {passwordtype === 'text' && <img src="/show.png"></img>}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="px-4 py-3 bg-red-50 border-2 border-red-400 rounded-xl text-xs font-bold text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3.5 cursor-pointer mt-2 bg-gray-900 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all duration-200 hover:bg-gray-800 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                      style={{ animation: "spin 0.6s linear infinite" }}
                    />
                    Signing in...
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            {/* Trust Badges */}
            <div className="mt-7 pt-6 border-t-2 border-gray-900/10">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { ico: "🔒", label: "256-bit SSL" },
                  { ico: "🛡️", label: "SOC 2" },
                  { ico: "✓", label: "GDPR" },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full text-[8px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1"
                  >
                    <span className="text-xs">{item.ico}</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative card - top right */}
        <div className="hidden lg:block absolute right-[6%] top-[8%] z-20 animate-bounce" style={{ animationDuration: "5s" }}>
          <div className="bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-6deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none">
            ☁️
          </div>
        </div>
        <div className="hidden lg:block absolute right-[5%] bottom-[10%] z-20 animate-bounce" style={{ animationDuration: "7s" }}>
          <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[5deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none text-white">
            🔒
          </div>
        </div>
        <div className="hidden lg:block absolute left-[56%] top-[8%] z-20 animate-bounce" style={{ animationDuration: "6.5s" }}>
          <div className="bg-[#FF9F0A] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-6deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none text-white">
            🔑
          </div>
        </div>
        <div className="hidden lg:block absolute left-[56%] bottom-[8%] z-20 animate-bounce" style={{ animationDuration: "5.5s" }}>
          <div className="bg-[#9D5CFF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[10deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none text-white">
            📁
          </div>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";


const BASE_URL = "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const [passwordtype,setpasswordtype] = useState('password')
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

    if(output == 'register'){
      navigate('/drive')
    }
    
  }

  async function checklogin(){
    const res = await fetch(`${BASE_URL}/checklogin`, {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data === "already login");
    if (data === "already login") {
      navigate("/drive");
    }
  }

  useEffect( () => {
    checklogin()
  }, []);
  return (
    <>
      {/* Add custom animations */}
      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          33% { transform: translate(-50%, -50%) scale(1.08) translate(18px, -12px); }
          66% { transform: translate(-50%, -50%) scale(0.95) translate(-12px, 16px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          40% { transform: translate(-50%, -50%) scale(1.12) translate(-20px, 10px); }
          70% { transform: translate(-50%, -50%) scale(0.92) translate(14px, -18px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA] relative overflow-hidden">
        {/* Background animated orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Orb 1 */}
          <div
            className="absolute w-75 h-75 sm:w-1-100 lg:w-125 lg:h-125 rounded-full"
            style={{
              top: "20%",
              left: "15%",
              background:
                "radial-gradient(circle, rgba(2,132,199,0.18) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              filter: "blur(80px)",
              animation: "orbFloat1 10s ease-in-out infinite",
            }}
          />
          {/* Orb 2 */}
          <div
            className="absolute w-62.5 h-62.5 sm:w-87.5 sm:h-87.5 lg:w-100 lg:h-100 rounded-full"
            style={{
              top: "70%",
              left: "80%",
              background:
                "radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(8,145,178,0.10) 50%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              filter: "blur(80px)",
              animation: "orbFloat2 12s ease-in-out infinite",
            }}
          />
          {/* Orb 3 */}
          <div
            className="absolute w-50 h-50 sm:w-62.5 sm:h-62.5 lg:w-75 lg:h-75 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              filter: "blur(80px)",
              animation: "orbFloat1 8s ease-in-out infinite reverse",
            }}
          />
        </div>

        {/* Left Panel - Branding */}
        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-16 lg:px-16 lg:py-20 relative z-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg sm:text-xl  tracking-tight text-[#2E302E] mb-8 sm:mb-10 lg:mb-12 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl sm:text-3xl">☁️</span>
            CloudVault
          </Link>

          <div className="max-w-120">
            <h1 className="text-3xl sm:text-4xl lg:text-[56px]  leading-[1.1] tracking-[-1.8px] text-[#1A1C1A] mb-4 sm:mb-5">
              Welcome back to{" "}
              <span className="bg-linear-to-br from-[#0284C7] to-[#7C3AED] bg-clip-text text-transparent">
                CloudVault
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#4A4D4A] leading-relaxed mb-8 sm:mb-10">
              Access your files from anywhere. Your data is encrypted end-to-end
              and always under your control.
            </p>

            {/* Stats - Hidden on small screens */}
            <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-6 p-6 bg-white border-[1.5px] border-[#E0DFDF] rounded-2xl shadow-sm">
              {[
                { value: "99.99%", label: "Uptime" },
                { value: "2.4M+", label: "Active Users" },
                { value: "AES-256", label: "Encryption" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl sm:text-2xl  tracking-tight text-[#1A1C1A] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8A8D8A] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="hidden lg:flex flex-col gap-3 mt-8">
              {[
                {
                  ico: "🔐",
                  text: "Bank-level security with zero-knowledge encryption",
                },
                {
                  ico: "⚡",
                  text: "Lightning-fast sync across all your devices",
                },
                {
                  ico: "🌍",
                  text: "Access your files from anywhere in the world",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-[#4A4D4A]"
                >
                  <span className="text-base">{feature.ico}</span>
                  {feature.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10 sm:py-16 lg:px-10 bg-white border-t lg:border-t-0 lg:border-l border-[#E0DFDF] relative z-10">
          <div className="w-full max-w-110">
            {/* Form Header */}
            <div className="text-center mb-8 sm:mb-9">
              <h2 className="text-2xl sm:text-[28px]  tracking-[-0.8px] text-[#1A1C1A] mb-2">
                Sign in to your account
              </h2>
              <p className="text-sm text-[#4A4D4A]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#4A4D4A] font-semibold hover:text-[#2E302E] transition-colors"
                >
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                googleregister(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
            />

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-[#E0DFDF]"></div>
              <span className="text-xs font-semibold text-[#8A8D8A] uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-[#E0DFDF]"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[13px] font-semibold text-[#1A1C1A] tracking-[0.2px]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 sm:py-3.25 border-[1.5px] ${errors.email ? "border-[#DC2626]" : "border-[#CECECE]"} rounded-[10px] text-sm text-[#1A1C1A] bg-white placeholder-[#8A8D8A] transition-all duration-200 outline-none focus:border-[#4A4D4A] focus:ring-[3px] focus:ring-[#4A4D4A]/10`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <span className="text-xs text-[#DC2626]">{errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 relative ">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[13px] font-semibold text-[#1A1C1A] tracking-[0.2px]"
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
                  className={`w-full px-4 py-3 sm:py-3.25 border-[1.5px] ${errors.password ? "border-[#DC2626]" : "border-[#CECECE]"} rounded-[10px] text-sm text-[#1A1C1A] bg-white placeholder-[#8A8D8A] transition-all duration-200 outline-none focus:border-[#4A4D4A] focus:ring-[3px] focus:ring-[#4A4D4A]/10`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="text-xs text-[#DC2626]">
                    {errors.password}
                  </span>
                )}
                <div className="w-5 h-5  absolute top-10 right-3 cursor-pointer" onClick={()=>{
                  setpasswordtype(passwordtype === 'password' ? 'text' : 'password')
                }}>
                  {passwordtype === 'password' && <img src="/hide.png"></img>}
                  {passwordtype === 'text' && <img src="/show.png"></img>}
                </div>
              </div>

              {/* Remember Me Checkbox
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className=" border-[1.5px] border-[#CECECE] rounded-[5px] cursor-pointer  accent-[#4A4D4A]"
                />
                <label htmlFor="rememberMe" className="text-[13px] text-[#4A4D4A] cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div> */}

              {/* Submit Error */}
              {errors.submit && (
                <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-[#DC2626]">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3  sm:py-3.5 cursor-pointer mt-2 border-none rounded-[10px] bg-[#4A4D4A] text-white text-sm font-bold transition-all duration-200 hover:bg-[#2E302E] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(74,77,74,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_2px_8px_rgba(74,77,74,0.25)]"
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
                  "Sign In"
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-7 pt-6 border-t border-[#E0DFDF] text-center">
              <p className="text-xs text-[#8A8D8A] leading-relaxed">
                Protected by industry-leading encryption.
                <br className="hidden sm:block" />
                Your data is always under your control.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-5">
              {[
                { ico: "🔒", label: "256-bit SSL" },
                { ico: "🛡️", label: "SOC 2 Certified" },
                { ico: "✓", label: "GDPR Compliant" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-[#8A8D8A] font-medium"
                >
                  <span className="text-sm">{item.ico}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email"; // Get email from registration
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        
        // Focus last filled input or last input
        const lastIndex = Math.min(pastedOtp.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    
    // Focus last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${BASE_URL}/user/verifyemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          otp: otpCode,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/drive');
        }, 1500);
      } else {
        setError("An error occurred.");
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setResending(true);
    setError("");
    
    try {
      const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: location.state?.email
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCountdown(60);
        setCanResend(false);
        // Clear current OTP
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("An error occurred.");
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError("An error occurred.");
    } finally {
      setResending(false);
    }
  };
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
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-checkmark {
          animation: checkmark 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-success-pulse {
          animation: successPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 py-8 relative overflow-hidden font-sans bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px]">

        {/* Floating decorative icons */}
        <div className="hidden md:block absolute left-[8%] top-[15%] z-20 animate-bounce" style={{ animationDuration: "5s" }}>
          <div className="bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-8deg] w-12 h-12 rounded-xl flex items-center justify-center text-xl select-none">
            ✉️
          </div>
        </div>
        <div className="hidden md:block absolute right-[8%] top-[12%] z-20 animate-bounce" style={{ animationDuration: "6s" }}>
          <div className="bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[6deg] w-12 h-12 rounded-xl flex items-center justify-center text-xl select-none">
            🔐
          </div>
        </div>
        <div className="hidden md:block absolute left-[12%] bottom-[15%] z-20 animate-bounce" style={{ animationDuration: "7s" }}>
          <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[4deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none text-white">
            ☁️
          </div>
        </div>
        <div className="hidden md:block absolute right-[10%] bottom-[18%] z-20 animate-bounce" style={{ animationDuration: "5.5s" }}>
          <div className="bg-[#9D5CFF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-5deg] w-11 h-11 rounded-xl flex items-center justify-center text-lg select-none text-white">
            🛡️
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-lg relative z-10">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 text-xl font-black tracking-tight text-gray-900 mb-8 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">☁️</span>
            CloudVault
          </Link>

          {/* Card */}
          <div className="bg-white border-2 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-2xl p-8 sm:p-10">
            {!success ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-xl bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-3 uppercase">
                    Verify Your Email
                  </h1>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    We've sent a 6-digit verification code to<br />
                    <span className="font-black text-gray-900">{email}</span>
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit}>
                  {/* OTP Input */}
                  <div className="flex gap-2 sm:gap-3 justify-center mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black border-2 ${
                          error ? 'border-red-500' : 'border-gray-900'
                        } rounded-xl bg-white transition-all duration-200 outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:bg-[#CCFF00]/10`}
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border-2 border-red-400 rounded-xl text-xs font-bold text-red-600 text-center">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || otp.some(d => !d)}
                    className="w-full px-5 py-3.5 sm:py-4 bg-gray-900 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all duration-200 hover:bg-gray-800 hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span 
                          className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                          style={{ animation: 'spin 0.6s linear infinite' }}
                        />
                        Verifying...
                      </span>
                    ) : (
                      'Verify Email →'
                    )}
                  </button>

                  {/* Resend
                  <div className="text-center">
                    <p className="text-sm text-[#8A8D8A] mb-3">
                      Didn't receive the code?
                    </p>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm font-semibold text-[#4A4D4A] hover:text-[#2E302E] transition-colors disabled:opacity-50"
                      >
                        {resending ? 'Resending...' : 'Resend code'}
                      </button>
                    ) : (
                      <p className="text-sm font-semibold text-[#8A8D8A]">
                        Resend code in {countdown}s
                      </p>
                    )}
                  </div> */}
                </form>

                {/* Back Link */}
                <div className="mt-6 pt-6 border-t-2 border-gray-900/10 text-center">
                  <Link 
                    to="/register" 
                    className="text-xs font-black text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to registration
                  </Link>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-xl bg-[#CCFF00] border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center animate-success-pulse">
                    <svg className="w-10 h-10 text-gray-900 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-3 uppercase">
                  Email Verified! 🎉
                </h2>
                <p className="text-xs text-gray-500 font-semibold mb-6">
                  Your account has been successfully verified.<br />
                  Redirecting to your dashboard...
                </p>
                <div className="flex justify-center">
                  <div 
                    className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full"
                    style={{ animation: 'spin 0.8s linear infinite' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full px-4 py-1.5">
              <p className="text-[9px] font-black text-gray-700 uppercase tracking-wider">
                🔒 This verification keeps your account secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

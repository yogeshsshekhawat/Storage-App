import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const BASE_URL = 'http://localhost:3000';

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
        setError(data.message || 'Invalid verification code');
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Something went wrong. Please try again.');
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
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('Something went wrong. Please try again.');
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

      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-8 relative overflow-hidden">
        {/* Background animated orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute w-100 h-100 rounded-full"
            style={{
              top: '20%',
              left: '15%',
              background: 'radial-gradient(circle, rgba(2,132,199,0.18) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(80px)',
              animation: 'orbFloat1 10s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-87.5 h-87.5 rounded-full"
            style={{
              top: '70%',
              left: '80%',
              background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(8,145,178,0.10) 50%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(80px)',
              animation: 'orbFloat2 12s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-75 h-75 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(80px)',
              animation: 'orbFloat1 8s ease-in-out infinite reverse'
            }}
          />
        </div>

        {/* Main Card */}
        <div className="w-full max-w-120 relative z-10">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 text-xl  tracking-tight text-[#2E302E] mb-8 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">☁️</span>
            CloudVault
          </Link>

          {/* Card */}
          <div className="bg-white border-[1.5px] border-[#E0DFDF] rounded-2xl shadow-lg p-8 sm:p-10">
            {!success ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#0284C7] to-[#7C3AED] flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl  tracking-tight text-[#1A1C1A] mb-3">
                    Verify your email
                  </h1>
                  <p className="text-sm text-[#4A4D4A] leading-relaxed">
                    We've sent a 6-digit verification code to<br />
                    <span className="font-semibold text-[#1A1C1A]">{email}</span>
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
                        className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-[1.5px] ${
                          error ? 'border-[#DC2626]' : 'border-[#CECECE]'
                        } rounded-xl bg-white transition-all duration-200 outline-none focus:border-[#4A4D4A] focus:ring-[3px] focus:ring-[#4A4D4A]/10`}
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#DC2626] text-center">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || otp.some(d => !d)}
                    className="w-full px-5 py-3.5 sm:py-4 border-none rounded-xl bg-[#4A4D4A] text-white text-sm font-bold transition-all duration-200 hover:bg-[#2E302E] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(74,77,74,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[0_2px_8px_rgba(74,77,74,0.25)] mb-6"
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
                      'Verify Email'
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
                <div className="mt-6 pt-6 border-t border-[#E0DFDF] text-center">
                  <Link 
                    to="/register" 
                    className="text-sm text-[#4A4D4A] hover:text-[#2E302E] font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to registration
                  </Link>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#16A34A] to-[#0891B2] flex items-center justify-center shadow-lg animate-success-pulse">
                    <svg className="w-10 h-10 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl  tracking-tight text-[#1A1C1A] mb-3">
                  Email verified! 🎉
                </h2>
                <p className="text-sm text-[#4A4D4A] mb-6">
                  Your account has been successfully verified.<br />
                  Redirecting to your dashboard...
                </p>
                <div className="flex justify-center">
                  <div 
                    className="w-8 h-8 border-3 border-[#4A4D4A]/20 border-t-[#4A4D4A] rounded-full"
                    style={{ animation: 'spin 0.8s linear infinite' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#8A8D8A]">
              🔒 This verification helps keep your account secure
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

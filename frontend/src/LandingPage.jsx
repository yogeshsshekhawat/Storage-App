import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiUploadCloud,
  FiShield,
  FiFolder,
  FiTrash2,
  FiCheck,
  FiShare2,
  FiStar,
  FiSettings,
  FiClock,
  FiSearch,
  FiFileText,
  FiImage,
  FiVideo,
  FiFolderPlus
} from "react-icons/fi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BASE_URl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const landingPlans = [
  {
    key: "Basic",
    name: "Basic (Free)",
    tagline: "Personal use",
    taglineColorClass: "text-gray-400 font-semibold",
    price: "₹0",
    features: [
      { text: "200 MB Storage Limit", bold: true, included: true },
      { text: "Priority upload speeds", bold: false, included: false },
      { text: "Google Picker API access", bold: false, included: false },
      { text: "30-day trash auto-cleanup", bold: false, included: true },
    ],
    buttonText: "Sign Up Free",
    isPopular: false,
    bgClass: "bg-white",
    borderColorClass: "border-[#CCFF00]",
  },
  {
    key: "Pro",
    name: "Pro Plan",
    tagline: "SaaS 2.0 Power",
    taglineColorClass: "text-blue-600 font-bold",
    price: "₹299",
    features: [
      { text: "200 GB Storage Limit", bold: true, included: true },
      { text: "Priority upload speeds", bold: false, included: true },
      { text: "Google Picker API access", bold: false, included: true },
      { text: "Star favorites & folder sharing", bold: false, included: true },
    ],
    buttonText: "Upgrade to Pro",
    isPopular: true,
    bgClass: "bg-[#FAFAFA]",
    borderColorClass: "border-[#2B7FFF]",
  },
  {
    key: "Enterprise",
    name: "Enterprise",
    tagline: "Organizations",
    taglineColorClass: "text-gray-400 font-semibold",
    price: "₹599",
    features: [
      { text: "1 TB Storage Limit", bold: true, included: true },
      { text: "Dedicated picker credentials", bold: false, included: true },
      { text: "SLA Uptime Guarantee", bold: false, included: true },
      { text: "24/7 dedicated representative", bold: false, included: true },
    ],
    buttonText: "Choose Enterprise",
    isPopular: false,
    bgClass: "bg-white",
    borderColorClass: "border-[#9D5CFF]",
  }
];

const bubbleStyles = [
  {
    inactive: "bg-[#E0F2FE]/80 border-2 border-blue-300 text-blue-900 -rotate-1 hover:rotate-0 hover:scale-[1.01] hover:bg-[#E0F2FE]",
    active: "bg-[#E0F2FE] border-2 border-blue-400 rotate-0 scale-[1.02] shadow-md text-blue-900",
    question: "text-[#0369A1] font-black text-sm md:text-base flex items-center gap-2",
    answer: "text-[#0C4A6E] text-xs md:text-sm font-medium mt-3 border-t border-blue-300/40 pt-2.5 leading-relaxed",
    icon: "text-blue-500",
    badge: "bg-blue-200 text-[#0369A1]"
  },
  {
    inactive: "bg-white border-2 border-gray-200 text-gray-800 rotate-1 hover:rotate-0 hover:scale-[1.01] hover:bg-gray-50",
    active: "bg-white border-2 border-gray-300 rotate-0 scale-[1.02] shadow-md text-gray-800",
    question: "text-gray-850 font-black text-sm md:text-base flex items-center gap-2",
    answer: "text-gray-500 text-xs md:text-sm font-medium mt-3 border-t border-gray-150 pt-2.5 leading-relaxed",
    icon: "text-gray-400",
    badge: "bg-gray-100 text-gray-500"
  },
  {
    inactive: "bg-[#EEF2F6]/80 border-2 border-indigo-200 text-indigo-900 -rotate-0.5 hover:rotate-0 hover:scale-[1.01] hover:bg-[#EEF2F6]",
    active: "bg-[#EEF2F6] border-2 border-indigo-350 rotate-0 scale-[1.02] shadow-md text-indigo-900",
    question: "text-indigo-950 font-black text-sm md:text-base flex items-center gap-2",
    answer: "text-indigo-850 text-xs md:text-sm font-medium mt-3 border-t border-indigo-200 pt-2.5 leading-relaxed",
    icon: "text-indigo-500",
    badge: "bg-indigo-100 text-[#4F46E5]"
  },
  {
    inactive: "bg-[#2E302E] border-2 border-[#1c1d1c] text-white rotate-0.5 hover:rotate-0 hover:scale-[1.01] hover:bg-[#3d3f3d]",
    active: "bg-[#2E302E] border-2 border-black rotate-0 scale-[1.02] shadow-md text-white",
    question: "text-white font-black text-sm md:text-base flex items-center gap-2",
    answer: "text-gray-300 text-xs md:text-sm font-medium mt-3 border-t border-white/10 pt-2.5 leading-relaxed",
    icon: "text-white",
    badge: "bg-[#4A4D4A] text-gray-350"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState("Pro");
  const [activeNav, setActiveNav] = useState("features");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${BASE_URl}/checklogin`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data === "already login") {
            navigate("/drive");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = document.querySelector(".features-track");
    if (!track) return;

    let mm = gsap.matchMedia();

    // DESKTOP animations (width >= 768px)
    mm.add("(min-width: 768px)", () => {
      // 1. Horizontal Features Pin
      const scrollAmount = track.scrollWidth - track.parentElement.clientWidth;

      gsap.to(track, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: "#features",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollAmount + 250}`,
          invalidateOnRefresh: true,
        }
      });

      // 2. Vertical Serpentine Flow Draw Line (6 steps)
      const flowTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#flow",
          scrub: 1,
          start: "top 75%",
          end: "bottom 85%",
          invalidateOnRefresh: true,
        }
      });

      // Initial settings for elements (Circles completely invisible, details hidden)
      gsap.set(["#flow-step-1", "#flow-step-2", "#flow-step-3", "#flow-step-4", "#flow-step-5", "#flow-step-6"], {
        width: "16px",
        height: "16px",
        backgroundColor: "#ffffff",
        borderColor: "#E0DFDF",
        opacity: 0
      });
      gsap.set(["#flow-svg-serpentine", "#flow-svg-serpentine-track"], { opacity: 0 });
      gsap.set(["#flow-num-1", "#flow-num-2", "#flow-num-3", "#flow-num-4", "#flow-num-5", "#flow-num-6"], { opacity: 0 });
      gsap.set(["#flow-detail-1", "#flow-detail-2", "#flow-detail-3", "#flow-detail-4", "#flow-detail-5", "#flow-detail-6"], { opacity: 0, y: 15 });

      flowTl
        // 1. First fade in the connector track lines
        .to(["#flow-svg-serpentine", "#flow-svg-serpentine-track"], { opacity: 1, duration: 0.15 })

        // Step 1: Active immediately
        .to("#flow-step-1", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-1", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-1", { opacity: 1, y: 0, duration: 0.1 }, "<")

        // Draw to Step 2
        .to("#flow-path-line", { strokeDashoffset: 80, duration: 0.2 })
        .to("#flow-step-2", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-2", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-2", { opacity: 1, y: 0, duration: 0.1 }, "<")

        // Draw to Step 3
        .to("#flow-path-line", { strokeDashoffset: 60, duration: 0.2 })
        .to("#flow-step-3", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-3", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-3", { opacity: 1, y: 0, duration: 0.1 }, "<")

        // Draw to Step 4
        .to("#flow-path-line", { strokeDashoffset: 40, duration: 0.2 })
        .to("#flow-step-4", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-4", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-4", { opacity: 1, y: 0, duration: 0.1 }, "<")

        // Draw to Step 5
        .to("#flow-path-line", { strokeDashoffset: 20, duration: 0.2 })
        .to("#flow-step-5", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-5", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-5", { opacity: 1, y: 0, duration: 0.1 }, "<")

        // Draw to Step 6
        .to("#flow-path-line", { strokeDashoffset: 0, duration: 0.2 })
        .to("#flow-step-6", { opacity: 1, width: "48px", height: "48px", backgroundColor: "#4A4D4A", color: "#ffffff", borderColor: "#4A4D4A", duration: 0.1 })
        .to("#flow-num-6", { opacity: 1, duration: 0.05 }, "<")
        .to("#flow-detail-6", { opacity: 1, y: 0, duration: 0.1 }, "<");
    });

    // MOBILE animations (width < 768px)
    mm.add("(max-width: 767px)", () => {
      // 1. Mobile Features Stagger
      gsap.from(".features-track > div", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#features",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });

    return () => mm.revert();
  }, []);

  const faqItems = [
    {
      q: "What is CloudVault?",
      a: "CloudVault is a modern SaaS file storage app that gives you high-fidelity organization, folder management, star favorites, instant trash recovery, and native Google Drive import capabilities."
    },
    {
      q: "Is there a free plan?",
      a: "Yes! The Basic Plan is 100% free forever with 200 MB storage capacity, full directory creation, and 30-day trash auto-cleanup."
    },
    {
      q: "Can I import files directly from Google Drive?",
      a: "Yes. Pro & Enterprise users can trigger the native Google Drive Picker API directly inside CloudVault to import files instantly into their account."
    },
    {
      q: "How secure is my data?",
      a: "All connections run over TLS 1.3 encryption with secure download credentials and secure session cookies."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#1A1C1A] selection:bg-[#4A4D4A]/10 selection:text-[#1A1C1A] overflow-x-hidden bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px]">
      {/* Sticky Header - Neo-Brutalist Style */}
      <nav
        className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-12 z-50 transition-all duration-300 ${scrolled || mobileNavOpen
          ? "bg-white/95 backdrop-blur-md border-b-2 border-gray-900 shadow-[0_4px_0px_rgba(0,0,0,0.08)]"
          : "bg-transparent"
          }`}
      >
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-[#2E302E]">
          <span className="text-xl">☁️</span>
          <span>CloudVault</span>
        </Link>

        {/* Desktop Links - Neo-Brutalist Pill */}
        <div className="hidden md:flex items-center bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-full p-1 gap-0.5">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveNav("home"); }}
            className={`text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${activeNav === "home"
              ? "text-gray-900 bg-[#CCFF00]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setActiveNav("features")}
            className={`text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${activeNav === "features"
              ? "text-gray-900 bg-[#CCFF00]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            Product
          </a>
          <a
            href="#flow"
            onClick={() => setActiveNav("flow")}
            className={`text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${activeNav === "flow"
              ? "text-gray-900 bg-[#CCFF00]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setActiveNav("pricing")}
            className={`text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${activeNav === "pricing"
              ? "text-gray-900 bg-[#CCFF00]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setActiveNav("faq")}
            className={`text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider ${activeNav === "faq"
              ? "text-gray-900 bg-[#CCFF00]"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            FAQ
          </a>
        </div>

        {/* Desktop Auth CTA - Neo-Brutalist Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full font-black text-xs text-gray-900 uppercase tracking-wider"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-gray-900 border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] text-white rounded-full font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="md:hidden p-2 text-gray-700 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Slide-down Nav Dropdown - Neo-Brutalist */}
        {mobileNavOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-gray-900 p-5 flex flex-col gap-3 shadow-[0_4px_0px_rgba(0,0,0,1)] md:hidden animate-fade-in">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileNavOpen(false); }}
              className="text-sm font-black text-gray-900 py-1.5 uppercase tracking-wider"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              Features
            </a>
            <a
              href="#flow"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              FAQ
            </a>
            <div className="pt-3 border-t-2 border-gray-900 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full py-2.5 text-center bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-xl font-black text-xs text-gray-900 uppercase tracking-wider"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileNavOpen(false)}
                className="w-full py-2.5 text-center bg-gray-900 border-2 border-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,0.3)]"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Center-aligned with floating cards */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 md:pt-40 pb-16 px-6 overflow-hidden">

        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(204,255,0,0.06) 0%, rgba(26,110,239,0.04) 40%, transparent 70%)" }}></div>

        {/* ──── Floating Neo-Brutalist Cards (scattered around headline) ──── */}

        {/* Card 1 — Top-left: Upload Stats */}
        <div className="hidden md:block absolute left-[6%] top-[18%] z-20 animate-bounce" style={{ animationDuration: "5s" }}>
          <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[-6deg] max-w-[180px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#a8d900] flex items-center justify-center text-[10px] font-black text-gray-900 border border-gray-800">📁</div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-800 leading-none">24 Folders</p>
                <p className="text-[8px] text-gray-400 font-semibold">Active directories</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[8px] font-bold text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Synced just now
            </div>
          </div>
        </div>

        {/* Card 2 — Top-right: User activity */}
        <div className="hidden md:block absolute right-[5%] top-[14%] z-20 animate-bounce" style={{ animationDuration: "6s" }}>
          <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[5deg] max-w-[190px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-[9px] flex items-center justify-center border border-gray-800">YS</div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-800 leading-none">Yogesh S.</p>
                <p className="text-[8px] text-gray-400 font-semibold">Pro Plan · 200 GB</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Online now
            </div>
          </div>
        </div>

        {/* Card 3 — Middle-left: File upload */}
        <div className="hidden lg:block absolute left-[3%] top-[48%] z-20 animate-bounce" style={{ animationDuration: "7s" }}>
          <div className="bg-[#CCFF00] border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[4deg] max-w-[175px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">📄</span>
              <div>
                <p className="text-[10px] font-extrabold text-gray-900 leading-none">design_specs.fig</p>
                <p className="text-[8px] text-gray-700 font-bold">4.8 MB · Uploading</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-gray-900/20 rounded-full overflow-hidden">
              <div className="h-full bg-gray-900 rounded-full" style={{ width: "68%" }}></div>
            </div>
            <p className="text-[8px] font-extrabold text-gray-800 mt-1 text-right">68%</p>
          </div>
        </div>

        {/* Card 4 — Middle-right: Security badge */}
        <div className="hidden lg:block absolute right-[3%] top-[52%] z-20 animate-bounce" style={{ animationDuration: "5.5s" }}>
          <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[-4deg] max-w-[170px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-sm border border-gray-800">🛡️</div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-800 leading-none">OAuth 2.0</p>
                <p className="text-[8px] text-gray-400 font-semibold">JWT Session Active</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1.5 text-[8px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              🔒 TLS 1.3 Encrypted
            </div>
          </div>
        </div>

        {/* Card 5 — Bottom-left: Storage meter */}
        <div className="hidden md:block absolute left-[10%] bottom-[22%] z-20 animate-bounce" style={{ animationDuration: "6.5s" }}>
          <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[3deg] max-w-[160px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Storage</p>
            <div className="flex items-end gap-1 mb-1.5">
              <span className="text-lg font-black text-gray-900 leading-none">32.4</span>
              <span className="text-[9px] font-bold text-gray-400 mb-0.5">%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1A6EEF] rounded-full" style={{ width: "32.4%" }}></div>
            </div>
            <p className="text-[8px] text-gray-400 font-semibold mt-1">3.24 GB of 10 GB</p>
          </div>
        </div>

        {/* Card 6 — Bottom-right: Google Drive */}
        <div className="hidden md:block absolute right-[8%] bottom-[18%] z-20 animate-bounce" style={{ animationDuration: "4.8s" }}>
          <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-xl p-3 rotate-[-5deg] max-w-[175px] transition-transform hover:rotate-0 hover:scale-105 cursor-default">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">☁️</span>
              <div>
                <p className="text-[10px] font-extrabold text-white leading-none">Google Drive</p>
                <p className="text-[8px] text-blue-200 font-bold">Picker API Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[8px] font-extrabold text-white/90 bg-white/20 border border-white/30 px-2 py-0.5 rounded-md w-fit">
              ✓ 3 files imported
            </div>
          </div>
        </div>

        {/* ──── Center Content ──── */}
        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">

          {/* Section heading design — matches Features/Pricing style */}
          <div className="relative w-full mb-6">
            {/* Floating symbol — right */}
            <div className="absolute right-[2%] md:right-[-4%] -top-6 z-10 animate-bounce" style={{ animationDuration: "4.5s" }}>
              <div className="bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-8deg] w-12 h-12 rounded-xl flex items-center justify-center text-xl select-none font-bold">
                ☁️
              </div>
            </div>
            {/* Floating symbol — left */}
            <div className="absolute left-[2%] md:right-[-4%] -top-6 z-10 animate-bounce" style={{ animationDuration: "4.5s" }}>
              <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[+8deg] w-12 h-12 rounded-xl flex items-center justify-center text-xl select-none font-bold">
                🔒
              </div>
            </div>

            <span className="text-[#868A8E] text-[11px] uppercase tracking-[2px] font-black block mb-3">
              CLOUD STORAGE PLATFORM
            </span>
          </div>

          {/* Big centered headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-black text-gray-800 tracking-tight leading-[1.06] mb-5 select-none max-w-3xl">
            Take Full Control.{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block">
              <span className="relative z-10">Organize Files</span>
            </span>{" "}
            <br className="hidden md:block" />
            Without The Clutter
          </h1>

          {/* Slanted lime badge — matching section heading design */}
          <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-5 py-2 rounded-full select-none mb-6 hover:rotate-0 transition-transform">
            SAAS 2.0 CLOUD VAULT IS LIVE
          </div>

          {/* Subtitle */}
          <p className="text-sm md:text-[15px] text-gray-500 font-semibold max-w-xl text-center mt-5 mb-10 leading-relaxed">
            Upload files of any size. CloudVault organizes your directories, extracts file types, rates favorites, and provides native Google Drive imports instantly.
          </p>

          {/* Two CTA Buttons — matching reference image */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 mt-10">
            <Link
              to="/features"
              onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-7 py-3.5 bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] text-gray-900 text-xs font-black rounded-full text-center uppercase tracking-wider whitespace-nowrap hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Learn More
            </Link>
            <Link
              to="/register"
              className="px-7 py-3.5 bg-gray-900 border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] text-white text-xs font-black rounded-full text-center uppercase tracking-wider whitespace-nowrap hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              Get Started <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Small fine-print note */}
          <p className="text-[10.5px] text-[#868A8E] font-semibold leading-normal max-w-md">
            Includes 200 MB free storage. No credit card required. Cancel or upgrade anytime.
          </p>
        </div>

        {/* ──── Logo Trust Bar ──── */}
        {/* <div className="relative z-10 mt-20 w-full max-w-4xl border-t border-gray-200/60 pt-8">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[2px] text-center mb-5">Built With Technologies You Trust</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40 grayscale">
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">⚛️</span>
              <span className="text-[11px] font-black tracking-wide">React</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">🍃</span>
              <span className="text-[11px] font-black tracking-wide">MongoDB</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">🟢</span>
              <span className="text-[11px] font-black tracking-wide">Node.js</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">☁️</span>
              <span className="text-[11px] font-black tracking-wide">Cloud Storage</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">🔐</span>
              <span className="text-[11px] font-black tracking-wide">OAuth 2.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="text-lg">📂</span>
              <span className="text-[11px] font-black tracking-wide">Google Drive</span>
            </div>
          </div>
        </div> */}
      </section>

      {/* Features Section with GSAP Horizontal Pin Animation */}
      <section className="md:h-screen bg-transparent overflow-hidden flex flex-col justify-center relative w-full py-16 md:py-0" id="features">

        {/* Centered Heading at the Top - styled like FAQ graphic layout */}
        <div className="max-w-5xl mx-auto px-6 w-full text-left mb-12 shrink-0 relative">
          {/* Floating symbols */}
          <div className="absolute right-[10%] -top-4 z-10 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[12deg] w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl select-none font-bold">
              ⚡
            </div>
          </div>
          <div className="absolute left-[5%] -bottom-6 z-0 opacity-30 rotate-[-15deg]">
            <div className="bg-[#9D5CFF] border border-gray-400 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] w-10 h-10 rounded-xl flex items-center justify-center text-white text-base select-none">
              📁
            </div>
          </div>

          <span className="text-[#868A8E] text-[11px] uppercase tracking-[2px] font-black block mb-2">
            WHAT WE OFFER
          </span>

          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 flex-wrap">
            <h2 className="text-4xl md:text-[52px] font-black tracking-tight text-gray-800 leading-[1.02] uppercase select-none">
              FEATURES <br />
              <span className="text-gray-800">WE ENGINEER</span>
            </h2>

            <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-2">
              TO TIDY UP YOUR STORAGE SPACE
            </div>
          </div>

          <p className="text-[11.5px] text-gray-400 mt-4 leading-relaxed font-semibold max-w-xl text-left">
            Explore our core features. Everything you need to securely scale, sync, and organize your cloud storage.
          </p>
        </div>

        {/* Sliding Cards Container (Spans full 100vw screen width, slides edge-to-edge) */}
        <div className="w-full overflow-x-auto md:overflow-hidden hide-scrollbar flex items-center relative pt-4 pb-12">
          <div className="features-track flex gap-6 flex-nowrap shrink-0 px-6 md:px-[calc((100vw-1100px)/2)]">

            {/* 1. Folder Management */}
            <div className="p-6 border-4 border-[#CCFF00] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiFolder />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">Folder Management</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Create directories, rename folders, delete, and restore items. Built on top of robust MongoDB relationships.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 pb-2 border-b border-gray-200">
                  <span>Directory tree</span>
                  <span className="text-blue-500 font-extrabold">+ New Folder</span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-gray-700 font-bold">
                  <div className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <span className="text-blue-500">📁</span>
                    <span>root</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 pl-6 bg-white border border-gray-150 rounded-lg">
                    <span className="text-blue-400">📁</span>
                    <span>documents</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 pl-10 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg animate-pulse">
                    <span className="text-blue-500">📁</span>
                    <span>project_assets/</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. OAuth 2.0 Security */}
            <div className="p-6 border-4 border-[#1A6EEF] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiShield />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">OAuth 2.0 Security</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Google OAuth integration and secure JSON Web Token (JWT) session cookies protect your files from unauthorized access.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none items-center justify-center min-h-[140px]">
                <div className="w-full max-w-[220px] bg-white border border-gray-250 rounded-xl p-3 flex flex-col gap-2.5 shadow-sm">
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase text-center">Google Sign In</div>
                  <div className="flex items-center justify-center gap-2 py-1.5 px-3 border border-gray-250 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 w-full cursor-default">
                    <span className="text-base">🌐</span>
                    <span>Sign in with Google</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 py-1 rounded-md">
                    <span>🛡️ JWT Session Signed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Google Picker API */}
            <div className="p-6 border-4 border-[#9D5CFF] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiUploadCloud />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">Google Picker API</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Import any folder or document directly from your Google Drive account using Google's native cloud picker window.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 border-b border-gray-200 pb-2">
                  <span className="text-amber-500">☁️</span>
                  <span>Import from Google Drive</span>
                </div>
                <div className="flex flex-col gap-1 text-[11px] font-bold text-gray-650">
                  <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-lg">
                    <span>📄 presentation.pptx</span>
                    <span className="text-[9px] text-blue-500">Select</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-lg">
                    <span>🎬 final_render.mp4</span>
                    <span className="text-[9px] text-blue-500">Select</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                    <span>📁 Assets Folder</span>
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-extrabold">Importing...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Smart Trash Restores */}
            <div className="p-6 border-4 border-[#CCFF00] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiTrash2 />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">Smart Trash Restores</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Safely recover deleted files. Deletions are sent to Trash and kept for 30 days before permanent auto-delete triggers.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 border-b border-gray-200 pb-2">
                  <span>Trash Can (Auto-purges 30 days)</span>
                  <span className="text-red-500">Empty Trash</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗑️</span>
                    <span>invoice_copy.pdf</span>
                  </div>
                  <button className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-extrabold cursor-default border-none">
                    Restore
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Secure File Sharing */}
            <div className="p-6 border-4 border-[#1A6EEF] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiShare2 />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">Secure File Sharing</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Generate secure sharing URLs for folders or specific files with simple read/write toggle options to share assets instantly.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="text-[10px] font-bold text-gray-400 border-b border-gray-200 pb-2">Share Settings</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Link Permission</span>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-extrabold">Read & Write</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-white border border-gray-200 rounded-xl">
                    <input className="text-[9px] text-gray-500 font-semibold truncate bg-transparent border-none outline-none select-all w-full" value="https://cloudvault.app/share/73hskd7" readOnly />
                    <button className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-lg whitespace-nowrap cursor-default border-none">Copy link</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Starred Favorites */}
            <div className="p-6 border-4 border-[#9D5CFF] rounded-3xl bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px] transition-transform hover:-translate-y-1">
              <div>
                <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center text-xl mb-4">
                  <FiStar />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800 mb-2">Starred Favorites</h3>
                <p className="text-[11.5px] text-gray-400 leading-relaxed font-medium mb-4">
                  Bookmark and keep vital folders and documents accessible. Star items to view them inside your unified favorites panel.
                </p>
              </div>
              {/* Mini UI Illustration */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] select-none">
                <div className="text-[10px] font-bold text-gray-400 border-b border-gray-200 pb-2">Favorites Panel</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <span>⭐</span>
                      <span>logo_v2.png</span>
                    </div>
                    <span className="text-[9px] text-gray-400">1.2 MB</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <span>⭐</span>
                      <span>contracts.zip</span>
                    </div>
                    <span className="text-[9px] text-gray-400">12.5 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-transparent pt-0 pb-24" id="flow">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col relative">

          {/* Section Heading - styled like FAQ graphic layout */}
          <div className="max-w-5xl mx-auto px-6 w-full text-left mb-16 relative">
            {/* Floating symbols */}
            <div className="absolute right-[8%] -top-8 z-10 animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[15deg] w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl select-none font-bold">
                ⚙️
              </div>
            </div>
            <div className="absolute left-[10%] -bottom-6 z-0 opacity-30 rotate-[-10deg]">
              <div className="bg-[#9D5CFF] border border-gray-400 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] w-10 h-10 rounded-xl flex items-center justify-center text-white text-base select-none">
                🔑
              </div>
            </div>

            <span className="text-[#868A8E] text-[11px] uppercase tracking-[2px] font-black block mb-2">
              WORKFLOW STEPS
            </span>

            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 flex-wrap">
              <h2 className="text-4xl md:text-[52px] font-black tracking-tight text-gray-800 leading-[1.02] uppercase select-none">
                HOW IT <br />
                <span className="text-gray-800">WORKS</span>
              </h2>

              <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-2">
                FOLLOW THE SERPENTINE TRACK
              </div>
            </div>

            <p className="text-[11.5px] text-gray-400 mt-4 leading-relaxed font-semibold max-w-xl text-left">
              Get set up and start uploading files in just a few simple steps. Explore our onboarding structure.
            </p>
          </div>

          {/* Unified Vertical Serpentine Infographic */}
          <div className="relative w-full max-w-4xl mx-auto h-auto md:h-[1440px] pt-0 pb-10">

            {/* SVG Connector Path */}
            <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
              <svg id="flow-svg-serpentine" className="w-full h-full" viewBox="0 0 100 1440" preserveAspectRatio="none" fill="none">
                <path
                  id="flow-svg-serpentine-track"
                  d="M 50,120 C 15,240 15,240 50,360 C 85,480 85,480 50,600 C 15,720 15,720 50,840 C 85,960 85,960 50,1080 C 15,1200 15,1200 50,1320"
                  stroke="#E5E7EB"
                  strokeWidth="1.5"
                  pathLength="100"
                />
                <path
                  id="flow-path-line"
                  d="M 50,120 C 15,240 15,240 50,360 C 85,480 85,480 50,600 C 15,720 15,720 50,840 C 85,960 85,960 50,1080 C 15,1200 15,1200 50,1320"
                  stroke="#4A4D4A"
                  strokeWidth="2.5"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  pathLength="100"
                />
              </svg>
            </div>

            {/* Vertical Flow Steps (6 rows of 240px with Centered Circles) */}
            <div className="flex flex-col gap-12 md:grid md:grid-rows-6 md:h-full relative z-10">

              {/* Step 1 (Right circle peak turn, but centered circle loop) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div id="flow-detail-1" className="order-1 md:order-none text-center md:text-right flex flex-col items-center md:items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 1</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Sign Up</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Create your account with secure credentials to activate your cloud allocation.
                  </p>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-1"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-1">1</span>
                    </div>
                  </div>
                </div>
                <div className="order-2 md:order-none flex justify-center md:justify-start w-full">
                  {/* Large Register Mockup */}
                  <div className="bg-white border-4 border-[#CCFF00] rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      <span className="text-[9.5px] text-gray-400 font-bold ml-1">Register Account</span>
                    </div>
                    <div className="h-6 bg-gray-50 border border-gray-100 rounded-lg w-full flex items-center px-2 text-[9.5px] text-gray-400">username@email.com</div>
                    <div className="h-6 bg-[#4A4D4A] rounded-lg w-full flex items-center justify-center text-[9.5px] text-white font-bold cursor-default">Create Secure Account</div>
                  </div>
                </div>
              </div>

              {/* Step 2 (Left loop turn, centered circle loop) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div className="order-2 md:order-none flex justify-center md:justify-end w-full">
                  {/* Large OTP Mockup */}
                  <div className="bg-white border-4 border-[#1A6EEF] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
                    <span className="text-[9.5px] font-bold text-gray-400">Enter Security Code</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 border border-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-xs text-emerald-600">8</div>
                      <div className="w-8 h-8 border border-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-xs text-emerald-600">2</div>
                      <div className="w-8 h-8 border border-gray-250 rounded-lg flex items-center justify-center font-extrabold text-xs text-gray-300">•</div>
                      <div className="w-8 h-8 border border-gray-250 rounded-lg flex items-center justify-center font-extrabold text-xs text-gray-300">•</div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-2"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-2">2</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-2" className="order-1 md:order-none text-center md:text-left flex flex-col items-center md:items-start">
                  <span className="text-xs font-bold text-gray-400">STEP 2</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Verify OTP</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Verify your email using our instant one-time-password security flow.
                  </p>
                </div>
              </div>

              {/* Step 3 (Right circle) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div id="flow-detail-3" className="order-1 md:order-none text-center md:text-right flex flex-col items-center md:items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 3</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Select Tier</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Choose our free Basic tier or unlock Pro limits via integrated Razorpay cards.
                  </p>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-3"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-3">3</span>
                    </div>
                  </div>
                </div>
                <div className="order-2 md:order-none flex justify-center md:justify-start w-full">
                  {/* Large Tier Card Mockup */}
                  <div className="bg-white border-4 border-[#9D5CFF] rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
                    <div className="flex flex-col text-left">
                      <span className="text-[9.5px] font-bold text-gray-800 uppercase tracking-wider">Premium SaaS Tier</span>
                      <span className="text-[8.5px] text-gray-400 font-medium">200 GB & Razorpay Checkout</span>
                    </div>
                    <span className="text-[9.5px] bg-[#4A4D4A] text-white px-2.5 py-1 rounded-full font-bold">₹299/mo</span>
                  </div>
                </div>
              </div>

              {/* Step 4 (Left circle) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div className="order-2 md:order-none flex justify-center md:justify-end w-full">
                  {/* Large Upload Box Mockup */}
                  <div className="bg-white border-4 border-dashed border-[#CCFF00] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] h-[100px]">
                    <span className="text-lg">📁</span>
                    <span className="text-[9.5px] text-gray-400 font-bold">Drag and drop folders to upload</span>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-4"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-4">4</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-4" className="order-1 md:order-none text-center md:text-left flex flex-col items-center md:items-start">
                  <span className="text-xs font-bold text-gray-400">STEP 4</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Import Cloud</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Link Google Drive Picker or drag-and-drop local folders to populate your workspace.
                  </p>
                </div>
              </div>

              {/* Step 5 (Right circle) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div id="flow-detail-5" className="order-1 md:order-none text-center md:text-right flex flex-col items-center md:items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 5</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Organize Assets</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Group files into nested directories, tag favorites, and search quickly.
                  </p>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-5"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-5">5</span>
                    </div>
                  </div>
                </div>
                <div className="order-2 md:order-none flex justify-center md:justify-start w-full">
                  {/* Large Folder Structure Mockup */}
                  <div className="bg-white border-4 border-[#1A6EEF] rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] text-left">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">📂</span>
                        <span className="text-[10px] font-bold text-gray-700">Client Attachments</span>
                      </div>
                      <span className="text-[8.5px] text-gray-400 font-bold">4 Items</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-gray-500 pl-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">📄</span>
                        <span>design_spec.docx</span>
                      </div>
                      <span>1.8 MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 (Left circle) */}
              <div className="flex flex-col md:grid md:grid-cols-[1fr_120px_1fr] gap-6 md:gap-16 items-center h-auto md:h-[240px]">
                <div className="order-2 md:order-none flex justify-center md:justify-end w-full">
                  {/* Large Share Toggle Mockup */}
                  <div className="bg-white border-4 border-[#9D5CFF] rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] text-left">
                    <div className="text-[9.5px] font-bold text-gray-400 border-b border-gray-100 pb-1.5">Sharing Links</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-600 font-semibold truncate w-32">https://cloudvault.app/share/73hskd7</span>
                      <span className="text-[7.5px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Active</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-6"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-6">6</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-6" className="order-1 md:order-none text-center md:text-left flex flex-col items-center md:items-start">
                  <span className="text-xs font-bold text-gray-400">STEP 6</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Secure Sharing</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Create access links instantly with custom read/write toggle permissions.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-transparent" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          {/* Centered Heading - redesigned to match FAQ graphic layout */}
          <div className="max-w-5xl mx-auto px-6 w-full text-left mb-16 relative">
            {/* Floating symbols */}
            <div className="absolute right-[5%] -top-4 z-10 animate-bounce" style={{ animationDuration: "4.5s" }}>
              <div className="bg-[#9D5CFF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-8deg] w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl select-none font-bold">
                💎
              </div>
            </div>
            <div className="absolute left-[8%] -bottom-6 z-0 opacity-20 rotate-[15deg]">
              <div className="bg-[#1A6EEF] border border-gray-400 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] w-10 h-10 rounded-xl flex items-center justify-center text-white text-base select-none">
                💳
              </div>
            </div>

            <span className="text-[#868A8E] text-[11px] uppercase tracking-[2px] font-black block mb-2">
              PRICING PLANS
            </span>

            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 flex-wrap">
              <h2 className="text-4xl md:text-[52px] font-black tracking-tight text-gray-800 leading-[1.02] uppercase select-none">
                CHOOSE YOUR <br />
                <span className="text-gray-800">STORAGE LIMIT</span>
              </h2>

              <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[1.5deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-2">
                SIMPLE SCALABLE PRICING
              </div>
            </div>

            <p className="text-[11.5px] text-gray-400 mt-4 leading-relaxed font-semibold max-w-xl text-left">
              Select one of our standard pricing options below. Upgrade, downgrade, or cancel your cloud storage plan at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-6">
            {landingPlans.map((plan) => {
              const isActive = activePlan === plan.key;
              const isPro = plan.key === "Pro";

              // Dynamic CTA Button styling
              const btnClass = isPro
                ? "w-full py-3 text-center bg-[#4A4D4A] hover:bg-[#2E302E] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
                : "w-full py-3 text-center border border-gray-200 hover:bg-[#F4F3F3] text-gray-700 text-xs font-bold rounded-xl transition-all";

              return (
                <div
                  key={plan.key}
                  onClick={() => setActivePlan(plan.key)}
                  className={`p-8 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out transform relative select-none ${plan.bgClass} ${plan.borderColorClass} ${isActive
                    ? `border-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] scale-105 -translate-y-2.5 z-20 opacity-100`
                    : `border-4 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] scale-95 translate-y-0 opacity-70 md:opacity-80 z-10 hover:opacity-90 hover:scale-97`
                    }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#4A4D4A] text-white text-[9px] uppercase tracking-widest font-extrabold rounded-full z-10">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800 mb-1">{plan.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[8px] bg-blue-100 text-blue-600 font-extrabold uppercase tracking-wide">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className={`text-xs block ${plan.taglineColorClass || "text-gray-400 font-semibold"} uppercase`}>
                      {plan.tagline}
                    </span>
                    <div className="my-6">
                      <span className="text-3xl font-extrabold text-[#1A1C1A]">{plan.price}</span>
                      <span className="text-xs text-gray-400 font-semibold"> / month</span>
                    </div>
                    <ul className={`flex flex-col gap-3.5 mb-8 text-xs text-gray-500 font-medium border-t pt-6 ${isPro ? "border-gray-200" : "border-gray-100"
                      }`}>
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className={`flex items-center gap-2 ${!feature.included ? "text-gray-400/85 line-through" : ""
                            }`}
                        >
                          <FiCheck
                            className={`${feature.included
                              ? isPro ? "text-green-600" : "text-green-500"
                              : "text-gray-300"
                              } text-sm flex-shrink-0`}
                          />
                          <span>
                            {feature.bold ? (
                              <strong>{feature.text}</strong>
                            ) : (
                              feature.text
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to="/register"
                    className={btnClass}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 border-t border-[#EBEAEA] relative overflow-hidden" id="faq">
        <div className="max-w-4xl mx-auto px-6 relative z-10">

          {/* Creative Graphic Header */}
          <div className="relative w-full mb-16 select-none">
            {/* Large background question mark bubble */}
            <div className="absolute -top-10 right-2 md:right-8 w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-3xl font-black shadow-lg rotate-12 pointer-events-none transition-transform hover:scale-110 duration-300 select-none">
              ?
            </div>
            <div className="absolute -bottom-8 -left-4 w-12 h-12 rounded-xl bg-gray-800 text-white flex items-center justify-center text-xl font-bold -rotate-12 pointer-events-none opacity-10 select-none">
              ?
            </div>

            <span className="text-[#4A4D4A] text-xs uppercase tracking-widest font-black block mb-2">Got questions?</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-none uppercase">
              QUESTIONS
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <h2 className="text-4xl md:text-5xl font-black text-gray-700 tracking-tight leading-none uppercase">
                WE ANSWER
              </h2>
              <div className="bg-[#ccff00] border border-black/10 text-black font-extrabold text-[9px] md:text-xs tracking-wider py-1.5 px-3.5 rounded-lg uppercase shadow-sm inline-block w-fit rotate-[-1deg] hover:rotate-0 transition-transform">
                BEFORE YOU TRUST US WITH YOUR FILES
              </div>
            </div>
          </div>

          {/* Staggered Floating Cards list */}
          <div className="flex flex-col gap-5">
            {faqItems.map((faq, index) => {
              const isOpen = openFaq === index;
              const style = bubbleStyles[index % bubbleStyles.length];

              return (
                <div
                  key={index}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className={`rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out transform ${isOpen ? style.active : style.inactive
                    }`}
                >
                  <div className="p-5 md:p-6 flex flex-col justify-between">
                    <div className="w-full flex items-center justify-between text-left">
                      <span className={style.question}>
                        <span className={`text-[8.5px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md ${style.badge}`}>
                          Q{index + 1}
                        </span>
                        {faq.q}
                      </span>
                      <span className={`text-xl font-bold transition-transform duration-300 ${style.icon} ${isOpen ? "rotate-45" : ""}`}>
                        ＋
                      </span>
                    </div>

                    {isOpen && (
                      <div className={style.answer}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer - Neo-Brutalist Style */}
      <footer className="bg-white border-t-4 border-gray-900 pt-0 pb-0 text-[#1A1C1A] relative overflow-hidden">

        {/* ──── Big CTA Banner ──── */}
        <div className="bg-[#CCFF00] border-b-4 border-gray-900 py-12 px-6 md:px-12 relative">
          {/* Floating decorative icons */}
          <div className="absolute right-[8%] top-4 animate-bounce hidden md:block" style={{ animationDuration: "5s" }}>
            <div className="bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[8deg] w-10 h-10 rounded-xl flex items-center justify-center text-base select-none">
              🚀
            </div>
          </div>
          <div className="absolute left-[5%] bottom-4 animate-bounce hidden md:block" style={{ animationDuration: "6s" }}>
            <div className="bg-[#1A6EEF] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-6deg] w-10 h-10 rounded-xl flex items-center justify-center text-base select-none text-white">
              ⚡
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-[42px] font-black text-gray-900 tracking-tight leading-[1.1] mb-4 uppercase select-none">
              Ready To Organize<br />Your Cloud?
            </h2>
            <p className="text-sm font-bold text-gray-800/70 mb-8 max-w-md mx-auto">
              Join thousands of teams using CloudVault to manage their files, folders, and storage with zero clutter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-gray-900 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] text-white text-xs font-black rounded-full uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                Get Started Free <span className="text-sm">→</span>
              </Link>
              <a
                href="#features"
                className="px-8 py-3.5 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-gray-900 text-xs font-black rounded-full uppercase tracking-wider hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>

        {/* ──── Main Footer Content ──── */}
        <div className="px-6 md:px-12 py-14">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 mb-14">

            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xl font-black text-gray-900 mb-4">
                <span className="text-2xl">☁️</span> CloudVault
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed font-semibold mb-5 max-w-xs">
                Modern cloud storage built for speed, privacy, and collaboration. Organize your workspace in one premium SaaS dashboard.
              </p>

              {/* Tech stack mini badges */}
              {/* <div className="flex flex-wrap gap-2 mb-5">
                {["React", "Node.js", "MongoDB", "Cloud Storage"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-full text-[9px] font-black text-gray-800 uppercase tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div> */}

              <span className="text-[10px] text-gray-400 font-bold">
                © {new Date().getFullYear()} CloudVault Inc. All rights reserved.
              </span>
            </div>

            {/* Link Columns */}
            {[
              {
                title: "Product",
                links: [
                  { text: "Features", href: "#features" },
                  { text: "Pricing", href: "#pricing" },
                  { text: "How It Works", href: "#flow" },
                  { text: "Security", href: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { text: "About Us", href: "#" },
                  { text: "Careers", href: "#" },
                  { text: "Blog", href: "#" },
                  { text: "Contact", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { text: "Privacy Policy", href: "/privacy-policy" },
                  { text: "Terms of Service", href: "/terms-of-service" },
                  { text: "Cookie Settings", href: "#" },
                  { text: "FAQ", href: "#faq" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[2px] mb-5">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.text}>
                      {link.href.startsWith("/") ? (
                        <Link
                          to={link.href}
                          className="text-[11.5px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {link.text}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-[11.5px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {link.text}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ──── Bottom Bar ──── */}
          <div className="max-w-6xl mx-auto border-t-2 border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left side tagline */}
            <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10px] font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none hover:rotate-0 transition-transform">
              Built with ♥ for teams who move fast
            </div>

            {/* Social Links — neo-brutalist mini cards */}
            <div className="flex items-center gap-3">
              {[
                { name: "instagram", icon: <FaInstagram className="text-sm" />, href: "https://www.instagram.com/yogesh__shekhawat_" },
                { name: "GitHub", icon: <FaGithub className="text-sm" />, href: "https://github.com/yogeshsshekhawat" },
                { name: "LinkedIn", icon: <FaLinkedinIn className="text-sm" />, href: "https://www.linkedin.com/in/yogesh-shekhawat-a1a66128b" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-lg flex items-center justify-center text-xs font-black text-gray-900 hover:bg-[#CCFF00] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all select-none"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

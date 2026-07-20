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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BASE_URl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

  const faqs = [
    {
      q: "What is CloudVault?",
      a: "CloudVault is a secure, high-fidelity MERN stack cloud storage management system. It provides seamless file storage, Google Drive picker integrations, and robust JWT session security."
    },
    {
      q: "How does the Google Picker integration work?",
      a: "With our native Google Picker API integration, you can log into Google OAuth directly, browse files inside your Google Drive, and import them with a single click."
    },
    {
      q: "Can I restore files after deleting them?",
      a: "Yes! Deleting a file moves it to the Trash folder. Items in the Trash can be restored within 30 days. After 30 days, they are permanently removed automatically."
    },
    {
      q: "What are the storage limits for each tier?",
      a: "Our Basic (Free) plan includes 1 GB of storage. Upgrading to the Pro plan expands your storage to 5 GB. Enterprise plans provide unlimited custom storage solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#1A1C1A] selection:bg-[#4A4D4A]/10 selection:text-[#1A1C1A]">
      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-300 ${scrolled
            ? "bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#EBEAEA] shadow-sm"
            : "bg-transparent"
          }`}
      >
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-[#2E302E]">
          <span className="text-xl">☁️</span>
          <span>CloudVault</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#flow" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-200 hover:bg-[#F4F3F3] hover:text-black transition-colors rounded-lg font-semibold text-xs text-gray-700"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-all text-white rounded-lg font-semibold text-xs shadow-sm hover:shadow"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full filter blur-[120px] opacity-25 bg-gradient-to-tr from-blue-300 via-indigo-200 to-purple-300 animate-pulse-glow"></div>
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full filter blur-[80px] opacity-15 bg-emerald-200"></div>
          <div className="absolute top-[60%] left-[75%] w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-15 bg-amber-200"></div>
        </div>

        <div className="relative z-10 max-w-6xl w-full text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm text-[11px] font-semibold text-gray-600 mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>CloudVault SaaS 2.0 is Live</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1A1C1A] tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Secure, modern storage <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              for your files.
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-500 font-medium max-w-2xl mb-10 leading-relaxed animate-slide-up">
            Organize, share, and manage your assets with a beautiful, high-fidelity SaaS interface.
            Native Google Picker integrations, full CRUD folders, star-rating favorites, and instant trash recovery.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-slide-up">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4A4D4A] hover:bg-[#2E302E] transition-all text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg"
            >
              Get Started Free (1 GB)
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 bg-white hover:bg-[#F4F3F3] text-gray-700 transition-colors text-sm font-semibold rounded-xl"
            >
              Learn More
            </a>
          </div>

          {/* Premium UI Mockup - Enlarged to max-w-5xl to replicate Home dashboard layout exactly */}
          <div className="w-full max-w-5xl border border-gray-200/80 bg-white/70 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] rounded-2xl p-3 animate-slide-up">
            <div className="w-full bg-white border border-[#EBEAEA] rounded-xl overflow-hidden shadow-inner flex flex-col">
              {/* Mockup header */}
              <div className="w-full h-11 border-b border-[#EBEAEA] bg-gray-50/50 flex items-center justify-between px-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-[11px] font-semibold text-gray-400 select-none">
                  cloudvault.app/drive
                </div>
                <div className="w-10"></div>
              </div>

              {/* Mockup content panel */}
              <div className="flex h-[420px] text-left text-[#1A1C1A] select-none">
                {/* Mockup Sidebar - Matched exactly with Home.jsx */}
                <div className="w-52 border-r border-[#EBEAEA] p-3 flex flex-col bg-white shrink-0">
                  {/* Mockup Logo */}
                  <div className="flex items-center gap-2 h-10 font-bold pl-2 text-xs text-[#2E302E] mb-3">
                    <img src="/logo.png" className="w-5 h-5" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span>CloudVault</span>
                  </div>

                  {/* Mockup Sidebar Action Buttons */}
                  <div className="flex flex-col gap-2 mb-4">
                    <button className="w-full h-8 bg-[#4A4D4A] text-white rounded-lg flex items-center justify-center gap-2 text-[10.5px] font-bold">
                      <FiUploadCloud className="text-[11px]" />
                      Upload Files
                    </button>
                    <button className="w-full h-8 border border-[#b9b7b7] hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 text-[10.5px] text-gray-700">
                      <FiFolderPlus className="text-gray-500 text-xs" />
                      New Folder
                    </button>
                    <button className="w-full h-8 border border-[#b9b7b7] hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 text-[10.5px] text-gray-700">
                      <img src="/google-drive.png" className="w-3.5 h-3.5" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                      Import From Drive
                    </button>
                  </div>

                  {/* Navigation List */}
                  <h6 className="text-[8px] text-[#898a89] tracking-[1.5px] font-bold mb-1 pl-2">
                    NAVIGATION
                  </h6>
                  <div className="flex flex-col gap-0.5 mb-4">
                    <div className="h-7 bg-[#EBEAEA] border border-[#ababab] text-gray-800 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <span className="text-blue-600 font-bold">🏠</span> Dashboard
                    </div>
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiFolder className="text-gray-400" /> My Files
                    </div>
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiClock className="text-gray-400" /> Recent
                    </div>
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiStar className="text-orange-400" /> Favorites
                    </div>
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiShare2 className="text-blue-500" /> Shared
                    </div>
                  </div>

                  {/* System List */}
                  <h6 className="text-[8px] text-[#898a89] tracking-[1.5px] font-bold mb-1 pl-2">
                    SYSTEM
                  </h6>
                  <div className="flex flex-col gap-0.5 mb-4">
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiTrash2 className="text-red-500" /> Trash
                    </div>
                    <div className="h-7 hover:bg-gray-50 text-gray-500 rounded-lg flex items-center pl-2.5 text-[10.5px] font-semibold gap-2">
                      <FiSettings className="text-gray-400" /> Settings
                    </div>
                  </div>

                  {/* Storage Capacity Widget */}
                  <div className="mt-auto bg-[#F4F3F3] border border-[#cdcccc] rounded-xl p-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-gray-600">
                      <span>Storage</span>
                      <span>32.40%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E0DFDF] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4CA4E6] rounded-full" style={{ width: "32.4%" }}></div>
                    </div>
                    <span className="text-[8px] text-gray-500">3.24 GB of 10 GB used</span>
                    <button className="w-full h-6 bg-[#707270] hover:bg-black text-white text-[8px] font-bold rounded-lg mt-0.5">
                      ✨ Upgrade to Pro
                    </button>
                  </div>
                </div>

                {/* Mockup Workspace Pane */}
                <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
                  {/* Workspace top Navbar */}
                  <div className="h-12 border-b border-[#EBEAEA] px-6 flex items-center justify-between shrink-0">
                    <div className="relative w-72">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                        <FiSearch className="text-xs" />
                      </span>
                      <input
                        type="text"
                        disabled
                        placeholder="Search files, folders..."
                        className="w-full pl-8 pr-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-[10.5px] outline-none placeholder-gray-400"
                      />
                    </div>
                    {/* Mock Profile Avatar */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center border border-white shadow-sm">
                      YS
                    </div>
                  </div>

                  {/* Main Grid View */}
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex justify-between items-center shrink-0">
                      <h2 className="text-xs font-extrabold text-gray-800">Root Directory</h2>
                      <span className="text-[9px] px-2 py-0.5 bg-gray-50 border border-gray-150 rounded-full text-gray-400 font-bold">10 GB Capacity Limit</span>
                    </div>

                    {/* Folders List Row */}
                    <div>
                      <h3 className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-2">Folders</h3>
                      <div className="grid grid-cols-3 gap-3 shrink-0">
                        <div className="border border-[#E0DFDF] p-2 rounded-xl flex items-center justify-between bg-[#FAFAFA]/50 hover:bg-white transition-all cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base flex-shrink-0">📁</span>
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-bold text-gray-700 truncate leading-none mb-0.5">Documents</h4>
                              <span className="text-[8px] text-gray-400 font-medium">24 Files</span>
                            </div>
                          </div>
                          <span className="text-gray-300 text-xs">⋮</span>
                        </div>
                        <div className="border border-[#E0DFDF] p-2 rounded-xl flex items-center justify-between bg-[#FAFAFA]/50 hover:bg-white transition-all cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base flex-shrink-0">📁</span>
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-bold text-gray-700 truncate leading-none mb-0.5">Images</h4>
                              <span className="text-[8px] text-gray-400 font-medium">18 Files</span>
                            </div>
                          </div>
                          <span className="text-gray-300 text-xs">⋮</span>
                        </div>
                        <div className="border border-[#E0DFDF] p-2 rounded-xl flex items-center justify-between bg-[#FAFAFA]/50 hover:bg-white transition-all cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base flex-shrink-0">📁</span>
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-bold text-gray-700 truncate leading-none mb-0.5">Videos</h4>
                              <span className="text-[8px] text-gray-400 font-medium">6 Files</span>
                            </div>
                          </div>
                          <span className="text-gray-300 text-xs">⋮</span>
                        </div>
                      </div>
                    </div>

                    {/* Files List Table */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <h3 className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-2">Recent Files</h3>
                      <div className="flex-1 border border-gray-150 rounded-xl overflow-hidden bg-white text-[10px] flex flex-col min-h-0">
                        {/* Table Header */}
                        <div className="h-8 bg-gray-50 flex items-center px-4 justify-between text-gray-400 border-b border-gray-150 font-bold select-none shrink-0">
                          <span className="w-[50%]">Name</span>
                          <span className="w-[18%]">Size</span>
                          <span className="w-[18%]">Type</span>
                          <span className="w-[14%] text-right">Shared</span>
                        </div>
                        {/* Table Body */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="h-8 flex items-center px-4 justify-between text-gray-600 hover:bg-gray-50/50 border-b border-gray-100 transition-colors">
                            <span className="w-[50%] truncate font-bold text-gray-700 flex items-center gap-1.5">
                              <FiFileText className="text-blue-500 text-xs shrink-0" />
                              monthly_report.pdf
                            </span>
                            <span className="w-[18%] text-gray-400">1.4 MB</span>
                            <span className="w-[18%] text-gray-400 font-medium">PDF</span>
                            <span className="w-[14%] text-right text-blue-500 font-bold">🔗 Yes</span>
                          </div>
                          <div className="h-8 flex items-center px-4 justify-between text-gray-600 hover:bg-gray-50/50 border-b border-gray-100 transition-colors">
                            <span className="w-[50%] truncate font-bold text-gray-700 flex items-center gap-1.5">
                              <FiImage className="text-emerald-500 text-xs shrink-0" />
                              banner_v2.png
                            </span>
                            <span className="w-[18%] text-gray-400">2.8 MB</span>
                            <span className="w-[18%] text-gray-400 font-medium">PNG</span>
                            <span className="w-[14%] text-right text-gray-300">—</span>
                          </div>
                          <div className="h-8 flex items-center px-4 justify-between text-gray-600 hover:bg-gray-50/50 transition-colors">
                            <span className="w-[50%] truncate font-bold text-gray-700 flex items-center gap-1.5">
                              <FiVideo className="text-purple-500 text-xs shrink-0" />
                              demo_recording.mp4
                            </span>
                            <span className="w-[18%] text-gray-400">15.2 MB</span>
                            <span className="w-[18%] text-gray-400 font-medium">MP4</span>
                            <span className="w-[14%] text-right text-blue-500 font-bold">🔗 Yes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating active file upload progress widget - matched layout inside Home.jsx */}
                  <div className="absolute bottom-4 right-4 z-20 w-60 bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-lg rounded-xl overflow-hidden">
                    <div className="h-8 border-b border-gray-100 flex items-center justify-between px-3 bg-gray-50/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                        <h4 className="text-[9px] font-bold text-gray-600">Uploading File</h4>
                      </div>
                      <button className="text-[9px] text-red-500 hover:bg-red-50 px-1.5 py-0.5 rounded font-bold">
                        Cancel
                      </button>
                    </div>
                    <div className="p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-start gap-2">
                        <span className="text-base leading-none shrink-0">📄</span>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[9.5px] font-bold text-gray-700 truncate leading-none mb-0.5">design_specs.fig</h5>
                          <span className="text-[8px] text-gray-400">4.8 MB</span>
                        </div>
                        <span className="text-[9px] font-bold text-blue-600">68%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with GSAP Horizontal Pin Animation */}
      <section className="md:h-screen bg-white border-y border-[#EBEAEA] overflow-hidden flex flex-col justify-center relative w-full py-16 md:py-0" id="features">

        {/* Centered Heading at the Top */}
        <div className="max-w-6xl mx-auto px-6 w-full text-center mb-10 md:mb-14 shrink-0">
          <span className="text-[#4A4D4A] text-xs uppercase tracking-widest font-bold">Deep Features</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mt-3 text-[#1A1C1A] leading-tight">
            Engineered for seamless file management.
          </h2>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed font-semibold max-w-xl mx-auto">
            Explore our core features. Everything you need to securely scale, sync, and organize your cloud storage.
          </p>
        </div>

        {/* Sliding Cards Container (Spans full 100vw screen width, slides edge-to-edge) */}
        <div className="w-full overflow-x-auto md:overflow-hidden hide-scrollbar flex items-center relative py-4">
          <div className="features-track flex gap-6 flex-nowrap shrink-0 px-6 md:px-[calc((100vw-1100px)/2)]">

            {/* 1. Folder Management */}
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
            <div className="p-6 border border-[#E0DFDF] rounded-3xl bg-white hover:shadow-lg transition-shadow w-[80vw] sm:w-[45vw] md:w-[360px] shrink-0 flex flex-col justify-between min-h-[380px]">
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
      <section className="bg-[#FAFAFA] pt-0 pb-24" id="flow">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col relative">

          {/* Unified Vertical Serpentine Infographic */}
          <div className="relative w-full max-w-4xl mx-auto h-[1440px] pt-0 pb-10">

            {/* SVG Connector Path */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
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
            <div className="grid grid-rows-6 h-full relative z-10">

              {/* Step 1 (Right circle peak turn, but centered circle loop) */}
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div id="flow-detail-1" className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 1</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Sign Up</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Create your account with secure credentials to activate your cloud allocation.
                  </p>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-1"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-1">1</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  {/* Large Register Mockup */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
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
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div className="flex justify-end">
                  {/* Large OTP Mockup */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
                    <span className="text-[9.5px] font-bold text-gray-400">Enter Security Code</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 border border-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-xs text-emerald-600">8</div>
                      <div className="w-8 h-8 border border-emerald-500 rounded-lg flex items-center justify-center font-extrabold text-xs text-emerald-600">2</div>
                      <div className="w-8 h-8 border border-gray-250 rounded-lg flex items-center justify-center font-extrabold text-xs text-gray-300">•</div>
                      <div className="w-8 h-8 border border-gray-250 rounded-lg flex items-center justify-center font-extrabold text-xs text-gray-300">•</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-2"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-2">2</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-2" className="text-left flex flex-col items-start">
                  <span className="text-xs font-bold text-gray-400">STEP 2</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Verify OTP</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Verify your email using our instant one-time-password security flow.
                  </p>
                </div>
              </div>

              {/* Step 3 (Right circle) */}
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div id="flow-detail-3" className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 3</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Select Tier</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Choose our free Basic tier or unlock Pro limits via integrated Razorpay cards.
                  </p>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-3"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-3">3</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  {/* Large Tier Card Mockup */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px]">
                    <div className="flex flex-col text-left">
                      <span className="text-[9.5px] font-bold text-gray-800 uppercase tracking-wider">Premium SaaS Tier</span>
                      <span className="text-[8.5px] text-gray-400 font-medium">5 GB & Razorpay Checkout</span>
                    </div>
                    <span className="text-[9.5px] bg-[#4A4D4A] text-white px-2.5 py-1 rounded-full font-bold">$4.99/mo</span>
                  </div>
                </div>
              </div>

              {/* Step 4 (Left circle) */}
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div className="flex justify-end">
                  {/* Large Upload Box Mockup */}
                  <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] h-[100px]">
                    <span className="text-lg">📁</span>
                    <span className="text-[9.5px] text-gray-400 font-bold">Drag and drop folders to upload</span>
                  </div>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-4"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-4">4</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-4" className="text-left flex flex-col items-start">
                  <span className="text-xs font-bold text-gray-400">STEP 4</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Import Cloud</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Link Google Drive Picker or drag-and-drop local folders to populate your workspace.
                  </p>
                </div>
              </div>

              {/* Step 5 (Right circle) */}
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div id="flow-detail-5" className="text-right flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-400">STEP 5</span>
                  <h3 className="text-base font-extrabold text-gray-800 mt-0.5 mb-1.5">Organize Assets</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-[280px] leading-relaxed">
                    Group files into nested directories, tag favorites, and search quickly.
                  </p>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-5"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-5">5</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  {/* Large Folder Structure Mockup */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] text-left">
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
              <div className="grid grid-cols-[1fr_120px_1fr] gap-16 items-center h-[240px]">
                <div className="flex justify-end">
                  {/* Large Share Toggle Mockup */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.03)] select-none w-full max-w-[300px] text-left">
                    <div className="text-[9.5px] font-bold text-gray-400 border-b border-gray-100 pb-1.5">Sharing Links</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-600 font-semibold truncate w-32">https://cloudvault.app/share/73hskd7</span>
                      <span className="text-[7.5px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center h-full">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <div
                      id="flow-step-6"
                      className="w-4 h-4 rounded-full border border-[#E0DFDF] bg-white flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm"
                    >
                      <span id="flow-num-6">6</span>
                    </div>
                  </div>
                </div>
                <div id="flow-detail-6" className="text-left flex flex-col items-start">
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
      <section className="py-24 bg-white border-t border-[#EBEAEA]" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[#4A4D4A] text-xs uppercase tracking-widest font-bold">Pricing Plans</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-[#1A1C1A]">
              Simple plans for any storage scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 border border-[#E0DFDF] rounded-2xl bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Basic (Free)</h3>
                <span className="text-xs text-gray-400 font-semibold uppercase">Personal use</span>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#1A1C1A]">$0</span>
                  <span className="text-xs text-gray-400 font-semibold"> / month</span>
                </div>
                <ul className="flex flex-col gap-3.5 mb-8 text-xs text-gray-500 font-medium border-t border-gray-100 pt-6">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span><strong>1 GB Storage Limit</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 line-through">
                    <FiCheck className="text-gray-300 text-sm flex-shrink-0" />
                    <span>Priority upload speeds</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 line-through">
                    <FiCheck className="text-gray-300 text-sm flex-shrink-0" />
                    <span>Google Picker API integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span>30-day trash cleanup schedule</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center border border-gray-200 hover:bg-[#F4F3F3] text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 border-2 border-[#4A4D4A] rounded-2xl bg-[#FAFAFA] flex flex-col justify-between shadow-md relative scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#4A4D4A] text-white text-[9px] uppercase tracking-widest font-extrabold rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Pro Plan</h3>
                <span className="text-xs text-blue-600 font-bold uppercase">SaaS 2.0 Power</span>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#1A1C1A]">$4.99</span>
                  <span className="text-xs text-gray-400 font-semibold"> / month</span>
                </div>
                <ul className="flex flex-col gap-3.5 mb-8 text-xs text-gray-500 font-medium border-t border-gray-200 pt-6">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 text-sm flex-shrink-0" />
                    <span><strong>5 GB Storage Limit</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 text-sm flex-shrink-0" />
                    <span>Priority upload speeds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 text-sm flex-shrink-0" />
                    <span>Google Picker API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-600 text-sm flex-shrink-0" />
                    <span>Star favorites & folder sharing</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center bg-[#4A4D4A] hover:bg-[#2E302E] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 border border-[#E0DFDF] rounded-2xl bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Enterprise</h3>
                <span className="text-xs text-gray-400 font-semibold uppercase">Organizations</span>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#1A1C1A]">Custom</span>
                  <span className="text-xs text-gray-400 font-semibold"> / month</span>
                </div>
                <ul className="flex flex-col gap-3.5 mb-8 text-xs text-gray-500 font-medium border-t border-gray-100 pt-6">
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span><strong>Custom / Unlimited Storage</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span>Dedicated Picker credential setups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span>SLA Uptime Guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="text-green-500 text-sm flex-shrink-0" />
                    <span>24/7 dedicated support representative</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center border border-gray-200 hover:bg-[#F4F3F3] text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#EBEAEA]" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#4A4D4A] text-xs uppercase tracking-widest font-bold">Frequently Asked</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-[#1A1C1A]">
              Got questions? We've got answers.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-[#E0DFDF] rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-gray-800 text-sm cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-gray-400 text-lg transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                      ＋
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-450 font-medium leading-relaxed border-t border-gray-50 pt-3 text-gray-500">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EBEAEA] py-16 px-6 md:px-12 text-[#1A1C1A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-[#2E302E] mb-4">
              <span>☁️</span> CloudVault
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium mb-4">
              Modern cloud storage built for speed, privacy, and collaboration.
              Organize your workspace in one premium SaaS dashboard.
            </p>
            <span className="text-[10px] text-gray-400 font-semibold">
              © {new Date().getFullYear()} CloudVault Inc. All rights reserved.
            </span>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Integrations", "Security"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Settings"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-400">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-[#1A1C1A] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
          <span>Built with ♥ for teams who move fast.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-black">Twitter</a>
            <a href="#" className="hover:text-black">GitHub</a>
            <a href="#" className="hover:text-black">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

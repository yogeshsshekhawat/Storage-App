import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  FiFolder, 
  FiShield, 
  FiInfo, 
  FiLock, 
  FiUserCheck, 
  FiDatabase,
  FiCode,
  FiEye
} from "react-icons/fi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function AboutUs() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#1A1C1A] overflow-x-hidden bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px]">
      
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
          <Link
            to="/"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-900 bg-[#CCFF00]"
          >
            About Us
          </Link>
          <Link
            to="/privacy-policy"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            Privacy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            Terms
          </Link>
        </div>

        {/* Desktop Auth CTA */}
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

        {/* Mobile Hamburger Toggle */}
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

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-gray-900 p-5 flex flex-col gap-3 shadow-[0_4px_0px_rgba(0,0,0,1)] md:hidden">
            <Link
              to="/"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-900 py-1.5 uppercase tracking-wider"
            >
              About Us
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              onClick={() => setMobileNavOpen(false)}
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
            >
              Terms of Service
            </Link>
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
                className="w-full py-2.5 text-center bg-gray-900 border-2 border-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wider"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 text-center">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(204,255,0,0.06) 0%, rgba(26,110,239,0.04) 40%, transparent 70%)" }}></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10px] md:text-xs font-black uppercase text-gray-800 px-5 py-2 rounded-full select-none mb-6">
            Verification & Compliance Center
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight leading-[1.06] mb-6">
            About <span className="underline decoration-[#2B7FFF] decoration-4">CloudVault</span>
          </h1>

          <p className="text-sm md:text-base text-gray-500 font-semibold max-w-xl mx-auto leading-relaxed">
            This document outlines the core purpose, functionality, and data security policies of the <strong className="text-gray-900 font-bold">CloudVault</strong> platform, specifically regarding our Google API integrations.
          </p>
        </div>
      </section>

      {/* Core Purpose & App Identity Section */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-10 mb-10">
          <span className="text-[#868A8E] text-[10px] uppercase tracking-[2px] font-black block mb-2">
            1. APPLICATION BRAND & PURPOSE
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase mb-4">
            CloudVault Identity & General Usage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mb-4">
                <strong className="text-gray-900 font-bold">CloudVault</strong> is an online cloud file manager that empowers individuals and organizations to upload, structure, search, and securely archive their digital files. Users can create custom directories, rate files as favorites, and restore mistakenly deleted items from a secure trash layout.
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                By maintaining clean data separation, users enjoy a clutter-free environment. For quick account creation, <strong className="text-gray-900 font-bold">CloudVault</strong> uses Google OAuth. Furthermore, users can connect their Google Drive accounts to selectively import specific documents directly into their cloud space.
              </p>
            </div>
            <div className="bg-[#FAFAFA] border-2 border-gray-900 rounded-2xl p-5 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                Compliance Summary
              </h3>
              <div className="flex flex-col gap-2.5 text-[11px] font-bold text-gray-650">
                <div>
                  <span className="text-gray-400 block uppercase text-[9px] tracking-wider">Application Name:</span>
                  <span className="text-gray-900 font-black text-xs">CloudVault</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[9px] tracking-wider">Developer Contact:</span>
                  <span className="text-gray-900 text-xs">storageyog@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google API Integration & Scopes Table Section (EASY FOR GOOGLE TO READ) */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-10 mb-10">
          <span className="text-[#868A8E] text-[10px] uppercase tracking-[2px] font-black block mb-2">
            2. GOOGLE API SCOPES DISCLOSURE
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase mb-4">
            How CloudVault Uses Google User Data
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mb-6">
            Google's review team can find the exact list of OAuth scopes requested by <strong className="text-gray-900 font-bold">CloudVault</strong>, alongside their descriptions and implementation details below:
          </p>

          {/* Scopes Table */}
          <div className="overflow-x-auto border-2 border-gray-900 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-[#FAFAFA]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b-2 border-gray-900 text-[10.5px] font-black text-gray-900 uppercase tracking-wider">
                  <th className="p-4 border-r-2 border-gray-900">OAuth Scope URL</th>
                  <th className="p-4 border-r-2 border-gray-900">Scope Label / Name</th>
                  <th className="p-4 border-r-2 border-gray-900">Data Accessed</th>
                  <th className="p-4">Detailed Usage in CloudVault</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-gray-700 divide-y-2 divide-gray-900">
                <tr className="bg-white">
                  <td className="p-4 border-r-2 border-gray-900 font-mono text-[10.5px] text-gray-900">
                    email
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 font-extrabold text-gray-900">
                    Email Address
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 text-gray-500">
                    Your Google primary email address.
                  </td>
                  <td className="p-4 text-gray-500 leading-relaxed">
                    Used as a unique account identifier to register or link your <strong className="text-gray-900 font-bold">CloudVault</strong> profile, allowing you to log in securely.
                  </td>
                </tr>
                <tr className="bg-[#FAFAFA]">
                  <td className="p-4 border-r-2 border-gray-900 font-mono text-[10.5px] text-gray-900">
                    profile
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 font-extrabold text-gray-900">
                    Basic Profile Info
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 text-gray-500">
                    Name, profile picture, and general public attributes.
                  </td>
                  <td className="p-4 text-gray-500 leading-relaxed">
                    Used to retrieve your name and profile avatar, which is displayed inside the personal client dashboard to customize the session UI.
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border-r-2 border-gray-900 font-mono text-[10.5px] text-gray-900">
                    openid
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 font-extrabold text-gray-900">
                    OpenID Connect Identity
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 text-gray-500">
                    A unique, secure Google user ID token.
                  </td>
                  <td className="p-4 text-gray-500 leading-relaxed">
                    Used to securely verify the authenticity of your login requests against Google's authentication servers.
                  </td>
                </tr>
                <tr className="bg-[#FAFAFA]">
                  <td className="p-4 border-r-2 border-gray-900 font-mono text-[10.5px] text-gray-900">
                    https://www.googleapis.com/auth/drive.readonly
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 font-extrabold text-gray-900 text-purple-600">
                    Google Drive Read-Only Scope
                  </td>
                  <td className="p-4 border-r-2 border-gray-900 text-gray-500">
                    Read-only access to browse and copy files stored on your Google Drive.
                  </td>
                  <td className="p-4 text-gray-500 leading-relaxed">
                    Triggered exclusively on-demand when you click "Import from Drive" within the dashboard. This launches the secure, client-side **Google Drive Picker API overlay**. CloudVault **only** downloads the specific document or folder you explicitly click and authorize. We have no background, permanent, or write access to your Drive files.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* User Flow & Integration Details */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-10 mb-10">
          <span className="text-[#868A8E] text-[10px] uppercase tracking-[2px] font-black block mb-2">
            3. DETAILED USER EXPERIENCE & FLOW
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase mb-6">
            How Data is Exchanged
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 border-2 border-gray-900 rounded-2xl bg-[#FAFAFA] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs border border-gray-900">1</span>
                <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">User Authorization</h3>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed font-semibold">
                When you initiate a Google Drive import in <strong className="text-gray-900 font-bold">CloudVault</strong>, you are prompted to log in and authorize the Drive API. This runs entirely in a secure, pop-up dialog direct to Google's OAuth consent servers.
              </p>
            </div>

            <div className="p-5 border-2 border-gray-900 rounded-2xl bg-[#FAFAFA] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center font-bold text-xs border border-gray-900">2</span>
                <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">The Picker Interface</h3>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed font-semibold">
                Upon authorization, Google launches a client-side Drive Picker window in your browser. This displays your files locally. <strong className="text-gray-900 font-bold">CloudVault</strong> cannot view this list until you actively select a file and click "Select".
              </p>
            </div>

            <div className="p-5 border-2 border-gray-900 rounded-2xl bg-[#FAFAFA] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs border border-gray-900">3</span>
                <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Transfer & Encryption</h3>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed font-semibold">
                Once selected, the file is retrieved using a secure download URL and copied to your personal directory in <strong className="text-gray-900 font-bold">CloudVault</strong>. All transfers are encrypted with TLS 1.3, and the file is only available to you.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Data Protection Policy Section */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-10 mb-10">
          <span className="text-[#868A8E] text-[10px] uppercase tracking-[2px] font-black block mb-2">
            4. COMPLIANCE & PRIVACY GUARANTEE
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase mb-4">
            Security and Non-Disclosure Commitment
          </h2>
          <div className="space-y-4 text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
            <p>
              To ensure compliance with Google's API Services User Data Policy, <strong className="text-gray-900 font-bold">CloudVault</strong> strictly adheres to the following guidelines:
            </p>
            <ul className="list-decimal pl-5 space-y-2.5">
              <li>
                <strong>No Sharing or Selling:</strong> We do not lease, share, sell, or trade any Google profile data, email identifiers, or imported file contents with third-party advertising systems or directories.
              </li>
              <li>
                <strong>Minimal Storage:</strong> We only store files that you explicitly ask us to import. Profile metadata (your name and image) is used dynamically to display your account details and is not stored or shared for other purposes.
              </li>
              <li>
                <strong>Secure Transmissions:</strong> Every request is encrypted via HTTPS with TLS 1.3 certificates. Client sessions are stored via secure, signed JWT cookies with strict settings to prevent scripts from hijacking credentials.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <footer className="w-full bg-white border-t-4 border-gray-900 mt-20">
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

              <span className="text-[10px] text-gray-400 font-bold">
                © {new Date().getFullYear()} CloudVault Inc. All rights reserved.
              </span>
            </div>

            {/* Link Columns */}
            {[
              {
                title: "Product",
                links: [
                  { text: "Features", href: "/#features" },
                  { text: "Pricing", href: "/#pricing" },
                  { text: "How It Works", href: "/#flow" },
                  { text: "Security", href: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { text: "About Us", href: "/about-us" },
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

          {/* Bottom Bar */}
          <div className="max-w-6xl mx-auto border-t-2 border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10px] font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none hover:rotate-0 transition-transform">
              Built with ♥ for teams who move fast
            </div>

            {/* Social Links */}
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

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  FiFileText, 
  FiUserCheck, 
  FiFolder, 
  FiCreditCard, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiMail,
  FiDatabase
} from "react-icons/fi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function TermsOfService() {
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
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#1A1C1A] overflow-x-hidden bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px] pb-0">
      
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-full p-1 gap-0.5">
          <Link
            to="/"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
            className="text-[11px] font-black px-4 py-1.5 rounded-full transition-all duration-300 uppercase tracking-wider text-gray-900 bg-[#CCFF00]"
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
              className="text-sm font-black text-gray-700 py-1.5 uppercase tracking-wider"
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
              className="text-sm font-black text-gray-900 py-1.5 uppercase tracking-wider"
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
          {/* Slanted lime badge */}
          <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10px] md:text-xs font-black uppercase text-gray-800 px-5 py-2 rounded-full select-none mb-6">
            Terms & Conditions Center
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-800 tracking-tight leading-[1.06] mb-6">
            Terms of <span className="underline decoration-[#1A6EEF] decoration-4">Service</span>
          </h1>

          <p className="text-sm md:text-base text-gray-500 font-semibold max-w-xl mx-auto leading-relaxed">
            By utilizing the CloudVault cloud storage app, you agree to comply with and be bound by the following terms.
          </p>
        </div>
      </section>

      {/* Grid of Sections */}
      <section className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Acceptance of Terms */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-blue-600 mb-6 font-bold">
                <FiFileText />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                By accessing or using <strong className="text-gray-900 font-bold">CloudVault</strong>, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services.
              </p>
            </div>
          </div>

          {/* Section 2: User Accounts & Registration */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-purple-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-purple-600 mb-6 font-bold">
                <FiUserCheck />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                2. User Accounts
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                To use CloudVault, you must sign up using email or through your Google Account via OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.
              </p>
            </div>
          </div>

          {/* Section 3: Permitted Use & Storage Limits */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-lime-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-gray-900 mb-6 font-bold">
                <FiDatabase />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                3. Permitted Use & Storage
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mb-4">
                CloudVault provides users with cloud storage. The capacity of your storage is determined by your subscription plan:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-gray-500 font-semibold mb-4">
                <li><strong>Basic Plan:</strong> 200 MB storage capacity (Free).</li>
                <li><strong>Pro Plan:</strong> 200 GB storage capacity.</li>
                <li><strong>Enterprise Plan:</strong> 1 TB storage capacity.</li>
              </ul>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                You agree not to use the service to upload any malicious code, viruses, or materials that violate copyright, trademark, or any intellectual property rights of third parties.
              </p>
            </div>
          </div>

          {/* Section 4: Third-Party Integrations */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-emerald-600 mb-6 font-bold">
                <FiFolder />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                4. Third-Party Integrations
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mb-4">
                Our application offers the ability to import files directly from Google Drive.
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                By using the "Import from Drive" feature, you authorize CloudVault to access and download the specific files you select. This integration is governed by Google's API Services User Data Policy, and your credentials are processed securely using Google OAuth consent protocols.
              </p>
            </div>
          </div>

          {/* Section 5: Subscription Plans & Fees */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-orange-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-orange-600 mb-6 font-bold">
                <FiCreditCard />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                5. Subscriptions & Fees
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                Some features or storage plans require recurring payments. Payments are processed securely via our integration with Razorpay. All fees are non-refundable, and subscription plans can be modified, cancelled, or upgraded through your CloudVault dashboard at any time.
              </p>
            </div>
          </div>

          {/* Section 6: Limitation of Liability */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-red-500 mb-6 font-bold">
                <FiAlertTriangle />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                6. Limitation of Liability
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                CloudVault is provided on an "as is" and "as available" basis. While we strive for maximum service uptime and data redundancy via our secure cloud infrastructure, we make no guarantees that the service will be entirely error-free, uninterrupted, or that data loss will never occur. We recommend maintaining local backups of critical files.
              </p>
            </div>
          </div>

          {/* Section 7: Changes to Terms */}
          <div className="bg-white border-4 border-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 flex flex-col justify-between md:col-span-2">
            <div>
              <div className="w-12 h-12 bg-teal-100 border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center text-xl text-teal-600 mb-6 font-bold">
                <FiRefreshCw />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-4 tracking-tight">
                7. Changes to Terms
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will post the updated terms on this page and revise the "Last Updated" date. Your continued use of CloudVault after any changes indicates your acceptance of the updated terms.
              </p>
            </div>
          </div>

        </div>

        {/* Section 8: Support Card */}
        <div className="bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-10 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase mb-2">
                Need Help Understanding Our Terms?
              </h2>
              <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed">
                Reach out to our compliance and technical support team for clarification.
              </p>
            </div>
            <a 
              href="mailto:storageyog@gmail.com" 
              className="flex items-center gap-2 px-6 py-3 bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full font-black text-xs text-gray-900 uppercase tracking-wider whitespace-nowrap"
            >
              <FiMail className="text-base" /> Email Support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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

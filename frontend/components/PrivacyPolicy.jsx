import { Link } from "react-router";
import { FiArrowLeft, FiShield } from "react-icons/fi";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#1A1C1A] overflow-x-hidden bg-[linear-gradient(to_right,#e8e8e8_1px,transparent_1px),linear-gradient(to_bottom,#e8e8e8_1px,transparent_1px)] bg-[size:32px_32px] py-12 px-6">
      
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full font-black text-xs text-gray-900 uppercase tracking-wider"
        >
          <FiArrowLeft className="text-sm" /> Back to Home
        </Link>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto bg-white border-4 border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-3xl p-6 md:p-12 relative overflow-hidden">
        
        {/* Slanted Accent Badge */}
        <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-8 hover:rotate-0 transition-transform">
          Legal Agreement
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl font-bold">
            <FiShield />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight leading-none uppercase select-none">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Last Updated: July 25, 2026
            </p>
          </div>
        </div>

        <hr className="border-t-2 border-gray-900 my-8" />

        {/* Content Section */}
        <div className="space-y-8 text-sm text-gray-700 font-medium leading-relaxed">
          
          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              1. Introduction
            </h2>
            <p>
              Welcome to CloudVault. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application, including our integration with third-party services like Google Drive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              2. Information We Collect and Access
            </h2>
            <p className="mb-4">
              To provide our storage and import functionalities, we access or collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-2.5">
              <li>
                <strong>Google Account Information:</strong> When you register or log in using Google OAuth, we access your name, email address, and profile picture to create and manage your CloudVault account.
              </li>
              <li>
                <strong>Google Drive Files:</strong> When you use our "Import from Drive" feature, you explicitly authorize access to your Google Drive via the Google Picker API. 
                <span className="bg-amber-50 text-amber-900 border-l-4 border-amber-500 p-2 block mt-1.5 font-semibold rounded-r-md">
                  We only access the specific files and folders you actively select. We do not scan, read, or have access to any other files in your Google Drive.
                </span>
              </li>
              <li>
                <strong>Uploaded Content:</strong> We store the files you upload or import to our secure cloud storage servers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              3. How We Use Your Information
            </h2>
            <p className="mb-3">
              We use the collected information solely to power the features of CloudVault, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Creating and managing your user account and subscription status.</li>
              <li>Processing and importing your selected Google Drive files into your personal CloudVault directory.</li>
              <li>Delivering files securely back to you when you download or share them.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              4. Data Sharing and Third Parties
            </h2>
            <p className="mb-3">
              <strong>We do not sell, rent, or trade your personal data or your Google user data to third parties.</strong>
            </p>
            <p>
              Your file data is stored securely and is only shared with third-party service providers (like payment gateways or database hosting providers) to the extent necessary to support billing and basic app operations. All communication between our application, third-party APIs, and your browser is encrypted using TLS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              5. Data Security & Storage
            </h2>
            <p>
              Your security is our highest priority. All files uploaded to CloudVault are stored in highly secure, private cloud storage. Downloads are authorized dynamically using secure, temporary access links. Session data is stored on your device using encrypted, HTTP-only cookie parameters to prevent unauthorized hijacking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              6. Your Rights & Deletion requests
            </h2>
            <p>
              You can delete your uploaded files and directories from your CloudVault dashboard at any time. When you empty your trash, your files are permanently removed from our storage systems. If you wish to delete your account entirely, you can request account deletion by emailing us at the address provided below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              7. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at:
              <br />
              <strong className="text-gray-900 block mt-2">Email: storageyog@gmail.com</strong>
            </p>
          </section>

        </div>

      </main>

      {/* Footer copyright */}
      <div className="text-center mt-10 text-[10.5px] text-gray-400 font-bold">
        © {new Date().getFullYear()} CloudVault Inc. All rights reserved.
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

export default function TermsOfService() {
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
        <div className="inline-block bg-[#CCFF00] border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[1deg] text-[10.5px] md:text-xs font-black uppercase text-gray-800 px-4 py-1.5 rounded-full select-none mb-8 hover:rotate-0 transition-transform">
          Terms & Conditions
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl border-2 border-gray-900 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-2xl font-bold">
            <FiFileText />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight leading-none uppercase select-none">
              Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using CloudVault, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              2. User Accounts & Registration
            </h2>
            <p>
              To use CloudVault, you must sign up using email or through your Google Account via OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              3. Permitted Use & Storage Limits
            </h2>
            <p className="mb-3">
              CloudVault provides users with cloud storage. The capacity of your storage is determined by your subscription plan:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Basic Plan:</strong> 200 MB storage capacity (Free).</li>
              <li><strong>Pro Plan:</strong> 200 GB storage capacity.</li>
              <li><strong>Enterprise Plan:</strong> 1 TB storage capacity.</li>
            </ul>
            <p className="mt-3">
              You agree not to use the service to upload any malicious code, viruses, or materials that violate copyright, trademark, or any intellectual property rights of third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              4. Third-Party Integrations (Google Drive Picker)
            </h2>
            <p>
              Our application offers the ability to import files directly from Google Drive. By using the "Import from Drive" feature, you authorize CloudVault to access and download the specific files you select. This integration is governed by Google's API Services User Data Policy, and your credentials are processed securely using Google OAuth consent protocols.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              5. Subscription Plans & Fees
            </h2>
            <p>
              Some features or storage plans require recurring payments. Payments are processed securely via our integration with Razorpay. All fees are non-refundable, and subscription plans can be modified, cancelled, or upgraded through your CloudVault dashboard at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              6. Limitation of Liability
            </h2>
            <p>
              CloudVault is provided on an "as is" and "as available" basis. While we strive for maximum service uptime and data redundancy via our secure cloud infrastructure, we make no guarantees that the service will be entirely error-free, uninterrupted, or that data loss will never occur. We recommend maintaining local backups of critical files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will post the updated terms on this page and revise the "Last Updated" date. Your continued use of CloudVault after any changes indicates your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-gray-900 uppercase mb-3 select-none">
              8. Contact Support
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact support:
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

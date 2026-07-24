import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Settings = ({ data, currentPlan, setShowUpgradeModal, url, getdata, handleLogout }) => {
  const plans = {
    Basic: { name: "Basic (Free)", limit: 200 * 1024 * 1024, label: "200 MB" },
    Pro: { name: "Pro Plan", limit: 200 * 1024 * 1024 * 1024, label: "200 GB" },
    Enterprise: { name: "Enterprise Plan", limit: 1024 * 1024 * 1024 * 1024, label: "1 TB" },
  };

  const activePlanInfo = plans[currentPlan] || plans.Basic;
  const totalSize = data?.totalSize || 0;
  const storageLimitBytes = data?.storageLimit || activePlanInfo.limit;
  const storageper = totalSize ? Math.min((totalSize / storageLimitBytes) * 100, 100) : 0;

  const formatBytes = (bytes) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) bytes = 0;
    if (bytes >= 1024 * 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1) + " TB";
    }
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (data) {
      setName(data.username || "");
      setEmail(data.useremail || "");
    }
  }, [data]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${url}user/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        if (getdata) getdata();
      } else {
        setError("An error occurred.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`${url}user/delete-account`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setShowDeleteModal(false);
        window.location.href = "/";
      } else {
        const result = await res.json().catch(() => ({}));
        setDeleteError("An error occurred.");
      }
    } catch (err) {
      setDeleteError("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordMessage, setPasswordMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleUpdatePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch(`${url}user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        setPasswordMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setPasswordError("An error occurred.");
      }
    } catch (err) {
      setPasswordError("An error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const formattedLimit = formatBytes(storageLimitBytes);

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-10">

        {/* Header */}
        <div className="mb-1 shrink-0">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-bold">
            Manage your account preferences, profile details, and storage security.
          </p>
        </div>

        {/* ROW 1: Profile pic (30%) & Storage plan (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch">
          {/* Profile Avatar Card (30%) */}
          <div className="lg:col-span-3 flex">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center w-full">
              <div className="relative">
                <img
                  src={data?.profilepic || "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"}
                  className="w-20 h-20 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-gray-50 object-cover"
                  alt="Profile"
                  onError={(e) => { e.target.src = "https://www.gravatar.com/avatar/?d=mp"; }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
              </div>
              <h2 className="mt-3 text-base font-black text-gray-900 uppercase leading-none">{data?.username || "User"}</h2>
              <p className="text-xs text-gray-500 font-bold mt-1.5 uppercase">
                {data?.useremail || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Storage Usage Card (70%) */}
          <div className="lg:col-span-7 flex">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] w-full flex flex-col justify-between gap-5">
              <div>
                <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-3">
                  Storage Usage
                </h2>
                <div className="w-full h-3.5 bg-gray-100 border-2 border-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2B7FFF] rounded-full transition-all duration-300"
                    style={{ width: `${storageper}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2.5 text-xs text-gray-900 font-black uppercase leading-none">
                  <span>{formatBytes(totalSize)} used</span>
                  <span>{formattedLimit} Total</span>
                </div>

                {/* Billing and Subscription Details Grid */}
                <div className="mt-5 pt-4 border-t-2 border-gray-900 flex flex-col gap-3">
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                    Subscription Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-900">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-gray-500 font-black uppercase">Plan Tier</span>
                      <span className="text-gray-900 font-black uppercase">{currentPlan === "Basic" ? "Basic (Free Tier)" : `${currentPlan} Plan`}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-gray-500 font-black uppercase">Billing Cycle</span>
                      <span className="text-gray-900 font-black uppercase">{currentPlan === "Basic" ? "Free Forever" : "Monthly"}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-gray-500 font-black uppercase">Purchased Date</span>
                      <span className="text-gray-900 font-black uppercase">
                        {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-gray-500 font-black uppercase">Next Renewal</span>
                      <span className="text-gray-900 font-black uppercase">
                        {currentPlan === "Basic" ? "N/A" : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full mt-4 h-9.5 rounded-xl bg-[#CCFF00] hover:bg-[#b5e000] border-2 border-gray-900 text-gray-900 font-black text-xs shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2.5px] hover:translate-y-[2.5px] transition-all cursor-pointer"
              >
                ✨ Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* ROW 2: Profile Info (Left) & Security + Delete Account (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* Profile Information */}
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-5 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase mb-3">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    className="w-full h-9.5 border-2 border-gray-900 bg-white rounded-xl px-3 outline-none text-xs font-bold text-gray-900 focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    className="w-full h-9.5 border-2 border-gray-900 bg-gray-100 rounded-xl px-3 outline-none text-xs font-bold text-gray-400 cursor-not-allowed select-none"
                    value={email}
                    disabled
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3 pb-3.5 border-b-2 border-gray-900">
                {message && <p className="text-xs text-green-600 font-black">{message}</p>}
                {error && <p className="text-xs text-red-650 font-black">{error}</p>}
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] disabled:opacity-50 border-2 border-gray-900 text-gray-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer self-start"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>            {/* Change Password Trigger */}
            <div className="flex justify-between items-center pt-2">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase">
                  Change Password
                </h3>
                <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                  Update your account login security credentials.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPasswordForm(true);
                  setPasswordMessage("");
                  setPasswordError("");
                }}
                className="px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 rounded-xl text-xs font-black text-gray-900 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>

          {/* Right Column: Danger Zone */}
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-red-100/10 border-2 border-gray-900 rounded-2xl p-5 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚨</span>
                  <h2 className="text-sm font-black text-red-750 uppercase">
                    Danger Zone
                  </h2>
                </div>

                <h3 className="text-xs font-black text-red-800 uppercase mb-1">
                  Delete Account Permanently
                </h3>
                <p className="text-[11.5px] text-red-700 font-bold leading-relaxed">
                  Permanently delete your account, cancel premium subscriptions, and purge all your stored database files. This action is irreversible.
                </p>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full mt-4 py-2.5 bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-700 rounded-xl text-xs font-black transition shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer text-center"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-md w-full flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 border-2 border-gray-900 flex items-center justify-center text-red-650 shrink-0 text-xl shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                ⚠️
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-gray-900 uppercase">
                  Delete Account Permanently?
                </h3>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-wider mt-0.5">
                  This action is irreversible
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              Your account will be completely deleted, and all of your stored files will be permanently deleted from the database.
            </p>

            {deleteError && (
              <p className="text-xs text-red-650 font-black bg-red-50 p-2.5 rounded-lg border-2 border-red-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-700 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-md w-full flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#CCFF00] border-2 border-gray-900 flex items-center justify-center text-gray-900 shrink-0 text-xl shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                🔑
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-gray-900 uppercase">
                  Change Password
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-0.5">
                  Update account credentials
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full h-9.5 border-2 border-gray-900 bg-white focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] rounded-xl pl-3 pr-10 outline-none text-xs font-bold text-gray-900 transition-all"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="w-full h-9.5 border-2 border-gray-900 bg-white focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] rounded-xl pl-3 pr-10 outline-none text-xs font-bold text-gray-900 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-555 hover:text-gray-900 focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full h-9.5 border-2 border-gray-900 bg-white focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] rounded-xl pl-3 pr-10 outline-none text-xs font-bold text-gray-900 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-555 hover:text-gray-900 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {passwordMessage && <p className="text-xs text-green-650 font-black bg-green-50 p-2.5 rounded-lg border-2 border-green-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{passwordMessage}</p>}
            {passwordError && <p className="text-xs text-red-650 font-black bg-red-50 p-2.5 rounded-lg border-2 border-red-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{passwordError}</p>}

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordMessage("");
                  setPasswordError("");
                }}
                disabled={isUpdatingPassword}
                className="px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] disabled:opacity-50 border-2 border-gray-900 text-gray-900 rounded-xl text-xs font-black transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50 min-w-[120px] flex items-center justify-center"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
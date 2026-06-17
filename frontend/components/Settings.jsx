import React from "react";

const Settings = () => {
  return (
    <div className="w-full h-[calc(100vh-72px)] overflow-y-auto scrollbar-hide p-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-[#2E302E]">
            Settings
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account, security and storage preferences.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* LEFT COLUMN */}
          <div className="col-span-1 flex flex-col gap-5">
            {/* Profile Card */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-5">
              <div className="flex flex-col items-center">
                <img
                  src="https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                  className="w-28 h-28 rounded-full border-2 border-white shadow"
                  alt="Profile"
                />

                <h2 className="mt-3 text-lg font-semibold">User</h2>

                <p className="text-sm text-gray-500">
                  user@example.com
                </p>

                <button className="mt-4 px-4 py-2 bg-[#707270] text-white rounded-lg hover:bg-[#2E302E] transition">
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Storage */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-5">
              <h2 className="font-semibold mb-4">
                Storage Usage
              </h2>

              <div className="w-full h-3 bg-[#E0DFDF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4CA4E6]"
                  style={{ width: "42%" }}
                />
              </div>

              <div className="flex justify-between mt-3 text-sm">
                <span className="text-gray-500">
                  4.2 GB used
                </span>

                <span className="font-medium">
                  10 GB Total
                </span>
              </div>

              <button className="w-full mt-4 h-10 rounded-xl bg-[#707270] text-white hover:bg-[#2E302E] transition">
                ✨ Upgrade to Pro
              </button>
            </div>

            {/* Connected Accounts */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-5">
              <h2 className="font-semibold mb-4">
                Connected Accounts
              </h2>

              <div className="flex items-center justify-between bg-white border border-[#dedede] rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/google-drive.png"
                    className="w-10 h-10"
                    alt="Google Drive"
                  />

                  <div>
                    <h3 className="font-medium">
                      Google Drive
                    </h3>

                    <p className="text-xs text-green-600">
                      ● Connected
                    </p>
                  </div>
                </div>

                <button className="px-3 py-2 text-sm border border-[#bcbcbc] rounded-lg hover:bg-[#F4F3F3]">
                  Disconnect
                </button>
              </div>
            </div>

            {/* Current Plan */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-5">
              <h2 className="font-semibold mb-4">
                Current Plan
              </h2>

              <div className="bg-white border border-[#dedede] rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      Free Plan
                    </h3>

                    <p className="text-sm text-gray-500">
                      10 GB Storage
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-[#DFF0F8] text-[#4CA4E6] rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>

                <button className="w-full mt-4 h-10 rounded-xl bg-[#707270] text-white hover:bg-[#2E302E] transition">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-2 flex flex-col gap-5">
            {/* Profile Information */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-5">
                Profile Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">
                    Full Name
                  </label>

                  <input
                    className="w-full mt-1 h-11 border border-[#cdcccc] bg-white rounded-xl px-3 outline-none focus:border-[#707270]"
                    defaultValue="User"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">
                    Email Address
                  </label>

                  <input
                    className="w-full mt-1 h-11 border border-[#cdcccc] bg-white rounded-xl px-3 outline-none focus:border-[#707270]"
                    defaultValue="user@example.com"
                  />
                </div>
              </div>

              <button className="mt-5 px-5 py-2 bg-[#707270] text-white rounded-xl hover:bg-[#2E302E] transition">
                Save Changes
              </button>
            </div>

            {/* Security */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-5">
                Security
              </h2>

              <div className="flex justify-between items-center border-b border-[#ddd] pb-4">
                <div>
                  <h3 className="font-medium">
                    Change Password
                  </h3>

                  <p className="text-sm text-gray-500">
                    Update your account password.
                  </p>
                </div>

                <button className="px-4 py-2 border border-[#bcbcbc] rounded-xl hover:bg-white transition">
                  Change
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <h3 className="font-medium">
                    Two Factor Authentication
                  </h3>

                  <p className="text-sm text-gray-500">
                    Add an extra layer of security.
                  </p>
                </div>

                <button className="px-4 py-2 border border-[#bcbcbc] rounded-xl hover:bg-white transition">
                  Enable
                </button>
              </div>
            </div>

            {/* Session Management */}
            <div className="bg-[#F4F3F3] border border-[#cdcccc] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-5">
                Session Management
              </h2>

              <div className="flex justify-between items-center border-b border-[#ddd] pb-4">
                <div>
                  <h3 className="font-medium">
                    Current Device
                  </h3>

                  <p className="text-sm text-gray-500">
                    Windows • Chrome • Active Now
                  </p>
                </div>

                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <h3 className="font-medium">
                    Logout
                  </h3>

                  <p className="text-sm text-gray-500">
                    Sign out from your current device.
                  </p>
                </div>

                <button className="px-5 py-2 bg-[#707270] text-white rounded-xl hover:bg-[#2E302E] transition">
                  Logout
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-red-600 mb-5">
                Danger Zone
              </h2>

              {/* <div className="flex justify-between items-center border-b border-red-200 pb-5">
                <div>
                  <h3 className="font-medium">
                    Disable Account
                  </h3>

                  <p className="text-sm text-gray-500">
                    Temporarily disable your account and hide all files.
                  </p>
                </div>

                <button className="px-5 py-2 border border-red-400 text-red-600 rounded-xl hover:bg-red-100 transition">
                  Disable
                </button>
              </div> */}

              <div className="flex justify-between items-center pt-5">
                <div>
                  <h3 className="font-medium">
                    Delete Account
                  </h3>

                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all stored files.
                  </p>
                </div>

                <button className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
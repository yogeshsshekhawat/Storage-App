import MyFiles from "../components/MyFiles.jsx";
import Recent from "../components/Recent.jsx";
import Favorites from "../components/Favorites.jsx";
import Shared from "../components/Shared.jsx";
import Trash from "../components/Trash.jsx";
import Settings from "../components/Settings.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { FiX, FiUploadCloud, FiCheck } from "react-icons/fi";

import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

const pricingPlans = [
  {
    key: "Basic",
    name: "Basic (Free)",
    titleClass: "text-gray-855",
    tagline: "Personal use",
    taglineClass: "text-gray-400 font-semibold",
    price: "₹0",
    billing: " / month",
    features: [
      { text: "200 MB Storage Limit", bold: true, included: true },
      { text: "Priority upload speeds", bold: false, included: false },
      { text: "Google Picker API access", bold: false, included: false },
      { text: "30-day trash auto-cleanup", bold: false, included: true },
    ],
    isRecommended: false,
    buttonText: {
      active: "Active Plan",
      inactive: "Downgrade to Free"
    },
    bgClass: "bg-white",
    currentBorderClass: "border-blue-500 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12)] bg-blue-50/5",
    defaultBorderClass: "border-gray-200/80 hover:border-gray-300 hover:shadow-md",
    activeButtonClass: "bg-blue-100 text-blue-700 cursor-default",
    inactiveButtonClass: "border border-gray-200 hover:bg-[#F4F3F3] text-gray-700 active:scale-[0.98] cursor-pointer",
    currentBadgeClass: "bg-blue-100 text-blue-600",
    dividerClass: "border-gray-100",
    checkIconClass: "text-green-500"
  },
  {
    key: "Pro",
    name: "Pro Plan",
    titleClass: "text-gray-808",
    tagline: "SaaS 2.0 Power",
    taglineClass: "text-blue-650 font-bold",
    price: "₹299",
    billing: " / month",
    planid: import.meta.env.VITE_RAZORPAY_PLAN_ID_PRO || "plan_TCXwQpOloC1vD4",
    features: [
      { text: "200 GB Storage Limit", bold: true, included: true },
      { text: "Priority upload speeds", bold: false, included: true },
      { text: "Google Picker API access", bold: false, included: true },
      { text: "Star favorites & folder sharing", bold: false, included: true },
    ],
    isRecommended: true,
    buttonText: {
      active: "Active Plan",
      inactive: "Upgrade to Pro"
    },
    bgClass: "bg-[#FAFAFA]/40 relative",
    currentBorderClass: "border-blue-600 shadow-[0_4px_25px_-4px_rgba(37,99,235,0.18)] bg-blue-50/10",
    defaultBorderClass: "border-gray-200/80 hover:border-gray-300 hover:shadow-md",
    activeButtonClass: "bg-blue-600 text-white cursor-default",
    inactiveButtonClass: "bg-[#4A4D4A] hover:bg-[#2E302E] text-white shadow-sm hover:shadow active:scale-[0.98]",
    currentBadgeClass: "bg-blue-600 text-white",
    dividerClass: "border-gray-200",
    checkIconClass: "text-green-600"
  },
  {
    key: "Enterprise",
    name: "Enterprise",
    titleClass: "text-gray-808",
    tagline: "Organizations",
    taglineClass: "text-gray-400 font-semibold",
    price: "₹599",
    planid: import.meta.env.VITE_RAZORPAY_PLAN_ID_ENTERPRISE || "plan_TCYLxVw656Df4w",
    billing: " / month",
    features: [
      { text: "1 TB Storage Limit", bold: true, included: true },
      { text: "Dedicated picker credentials", bold: false, included: true },
      { text: "SLA Uptime Guarantee", bold: false, included: true },
      { text: "24/7 dedicated representative", bold: false, included: true },
    ],
    isRecommended: false,
    buttonText: {
      active: "Active Plan",
      inactive: "Choose Enterprise"
    },
    bgClass: "bg-white",
    currentBorderClass: "border-blue-500 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12)] bg-blue-50/5",
    defaultBorderClass: "border-gray-200/80 hover:border-gray-300 hover:shadow-md",
    activeButtonClass: "bg-blue-100 text-blue-700 cursor-default",
    inactiveButtonClass: "border border-gray-200 hover:bg-[#F4F3F3] text-gray-700 active:scale-[0.98]",
    currentBadgeClass: "bg-blue-100 text-blue-600",
    dividerClass: "border-gray-100",
    checkIconClass: "text-green-500"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const clientId = import.meta.env.VITE_FRONTNED_CLIENT_ID;
  const [active, setActive] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const url = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "") + "/";
  const [data, setdata] = useState();
  const { dirId } = useParams();
  const [login, setlogin] = useState(false);
  const [uploadfile, setuploadfile] = useState([]);
  const [uploading, setuploading] = useState(false);
  const [foldercdiv, setfoldercdiv] = useState(false);
  const [foldername, setfoldername] = useState("");
  const plans = {
    Basic: { name: "Basic (Free)", limit: 200 * 1024 * 1024, label: "200 MB" },
    Pro: { name: "Pro Plan", limit: 200 * 1024 * 1024 * 1024, label: "200 GB" },
    Enterprise: { name: "Enterprise Plan", limit: 1024 * 1024 * 1024 * 1024, label: "1 TB" },
  };

  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem("currentPlan") || "Basic";
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState("");
  const [errorPopup, setErrorPopup] = useState({ show: false, title: "", message: "", buttonText: "Close", action: null });


  const activePlanInfo = plans[currentPlan] || plans.Basic;
  const storageLimitBytes = data?.storageLimit || activePlanInfo.limit;
  const storageper = data?.totalSize ? Math.min((data.totalSize / storageLimitBytes) * 100, 100) : 0;

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

  const getUpgradeButtonText = () => {
    if (currentPlan === "Basic") return "✨ Upgrade to Pro";
    if (currentPlan === "Pro") return "✨ Upgrade to Enterprise";
    return "✨ Manage Subscription";
  };

  const handleLogout = async () => {
    try {
      await fetch(`${url}user/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    if (data?.plan) {
      setCurrentPlan(data.plan);
      localStorage.setItem("currentPlan", data.plan);
    }
  }, [data]);

  const handleSelectPlan = async (planKey, planId) => {
    if (!planId) {
      // Downgrade to free plan
      try {
        const res = await fetch(`${url}subscription/downgrade-free`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        if (res.ok) {
          setCurrentPlan(planKey);
          localStorage.setItem("currentPlan", planKey);
          setSuccessPlanName(plans[planKey].name);
          setShowUpgradeModal(false);
          setShowUpgradeSuccess(true);
          getdata(active);
          setTimeout(() => {
            setShowUpgradeSuccess(false);
          }, 3000);
        } else {
          const errorData = await res.json();
          const isStorageError = errorData.error && errorData.error.includes("storage usage exceeds");
          setErrorPopup({
            show: true,
            title: isStorageError ? "Storage Limit Exceeded" : "Downgrade Failed",
            message: errorData.error || "Failed to downgrade plan.",
            buttonText: isStorageError ? "Manage Storage" : "Close",
            action: isStorageError ? () => { setActive("My Files"); setShowUpgradeModal(false); } : null
          });
        }
      } catch (err) {
        console.error("Downgrade error:", err);
        setErrorPopup({
          show: true,
          title: "Downgrade Error",
          message: "Failed to downgrade plan due to a network error. Please try again.",
          buttonText: "Close",
          action: null
        });
      }
      return;
    }

    // Load Razorpay script
    const scriptLoaded = await new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!scriptLoaded) {
      setErrorPopup({
        show: true,
        title: "SDK Load Failed",
        message: "Failed to load Razorpay SDK. Please check your internet connection.",
        buttonText: "Close",
        action: null
      });
      return;
    }

    try {
      // 1. Create Razorpay Subscription object from backend
      const res = await fetch(`${url}subscription/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
        credentials: "include"
      });

      const subData = await res.json();
      if (!res.ok) {
        throw new Error(subData.error || "Failed to initiate subscription");
      }

      // If subscription was downgraded / scheduled at cycle end
      if (subData.type === "downgrade-scheduled") {
        setErrorPopup({
          show: true,
          title: "Downgrade Scheduled",
          message: subData.message,
          buttonText: "Close",
          action: null
        });
        setShowUpgradeModal(false);
        getdata(active);
        return;
      }


      // If this is an upgrade, handle the prorated Subscription flow
      if (subData.type === "upgrade") {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_yourKeyId",
          subscription_id: subData.subscriptionId,
          name: "Storage App",
          description: `Upgrade to ${planKey} (Prorated)`,
          handler: async (response) => {
            try {
              const verifyRes = await fetch(`${url}subscription/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                  planName: planKey
                }),
                credentials: "include"
              });
              if (verifyRes.ok) {
                const verifyData = await verifyRes.json();
                setCurrentPlan(verifyData.plan);
                localStorage.setItem("currentPlan", verifyData.plan);
                setSuccessPlanName(plans[verifyData.plan].name);
              }
            } catch (err) {
              console.error("Verification failed:", err);
            }
            setShowUpgradeModal(false);
            setShowUpgradeSuccess(true);
            setTimeout(() => {
              setShowUpgradeSuccess(false);
              getdata(active);
            }, 1500);
          },
          prefill: {
            name: subData.user?.name || "",
            email: subData.user?.email || "",
          },

          theme: {
            color: "#155DFC",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // 2. Open Standard Razorpay Checkout popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_yourKeyId",
        subscription_id: subData.subscriptionId,
        name: "Storage App",
        description: `Monthly Subscription for ${planKey}`,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${url}subscription/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                planName: planKey
              }),
              credentials: "include"
            });
            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              setCurrentPlan(verifyData.plan);
              localStorage.setItem("currentPlan", verifyData.plan);
              setSuccessPlanName(plans[verifyData.plan].name);
            }
          } catch (err) {
            console.error("Verification failed:", err);
          }
          setShowUpgradeModal(false);
          setShowUpgradeSuccess(true);
          setTimeout(() => {
            setShowUpgradeSuccess(false);
            getdata(active);
          }, 1500);
        },
        prefill: {
          name: subData.user?.name || "",
          email: subData.user?.email || "",
        },

        theme: {
          color: "#155DFC",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Subscription initiation error:", error);
      const isStorageError = error.message && error.message.includes("storage usage exceeds");
      setErrorPopup({
        show: true,
        title: isStorageError ? "Storage Limit Exceeded" : "Subscription Error",
        message: error.message || "Failed to process plan change request.",
        buttonText: isStorageError ? "Manage Storage" : "Close",
        action: isStorageError ? () => { setActive("My Files"); setShowUpgradeModal(false); } : null
      });
    }
  };

  const xhrRef = useRef(null);

  async function getdata(value) {
    const res = await fetch(`${url}directory/${dirId || "root"}`, {
      credentials: "include",
      headers: {
        type: value ? value : "null",
      },
    });
    const data = await res.json();
    setdata(data);
    if (!res.ok) {
      navigate("/");
      return;
    }
  }
  async function handleupload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Clear input value so same file can be selected again
    e.target.value = "";

    // Check space limit before starting upload process
    const currentTotalSize = data?.totalSize || 0;
    if (currentTotalSize + file.size > storageLimitBytes) {
      setErrorPopup({
        show: true,
        title: "Storage Limit Reached",
        message: `Uploading this file (${(file.size / (1024 * 1024)).toFixed(2)} MB) would exceed your storage limit of ${plans[currentPlan]?.label || activePlanInfo.label}. Upgrade your plan to get more space!`,
        buttonText: "Upgrade Plan",
        action: () => setShowUpgradeModal(true)
      });
      return;
    }

    setuploading(true);
    const id = Date.now() + file.name;

    setuploadfile([
      {
        id,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        progress: 0,
        done: false,
      },
    ]);

    try {
      // 1. Get S3 presigned URL and create DB record
      const presignedRes = await fetch(`${url}file/${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: {
          "dirid": dirId || "root",
          "size": file.size.toString(),
          "contenttype": file.type || "application/octet-stream",
          "plan": currentPlan
        },
        credentials: "include"
      });

      if (!presignedRes.ok) {
        const errorData = await presignedRes.json().catch(() => ({}));
        if (presignedRes.status === 400 && errorData.message === "insufficient_space") {
          setErrorPopup({
            show: true,
            title: "Storage Limit Reached",
            message: "You don't have enough space to upload this file. Please upgrade your plan.",
            buttonText: "Upgrade Plan",
            action: () => setShowUpgradeModal(true)
          });
          setuploading(false);
          setuploadfile([]);
          return;
        }
        throw new Error(errorData.message || "Failed to get presigned upload URL from backend");
      }

      const { uploadUrl } = await presignedRes.json();

      // 2. Perform direct S3 PUT upload via XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setuploadfile((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: percent } : f)),
          );
        }
      };

      xhr.onloadend = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setuploadfile((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, progress: 100, done: true } : f,
            ),
          );
          getdata(active);

          setTimeout(() => {
            setuploading(false);
            setuploadfile([]);
            xhrRef.current = null;
          }, 2000);
        } else {
          console.error("S3 upload failed", xhr.statusText);
          setuploading(false);
          setuploadfile([]);
          xhrRef.current = null;
          setErrorPopup({
            show: true,
            title: "Upload Failed",
            message: "Upload to S3 failed. Please check your storage bucket configuration and CORS policy.",
            buttonText: "Close",
            action: null
          });
        }
      };

      xhr.onerror = () => {
        console.error("S3 Upload network error");
        setuploading(false);
        setuploadfile([]);
        xhrRef.current = null;
        setErrorPopup({
          show: true,
          title: "Network Error",
          message: "Upload to S3 failed due to a network error. Ensure CORS is enabled on the S3 bucket.",
          buttonText: "Close",
          action: null
        });
      };

      xhr.send(file);
    } catch (error) {
      console.error("Initialization error:", error);
      setuploading(false);
      setuploadfile([]);
      setErrorPopup({
        show: true,
        title: "Upload Error",
        message: "Failed to initialize upload: " + error.message,
        buttonText: "Close",
        action: null
      });
    }
  }

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setuploading(false);
    setuploadfile([]);
  };
  async function createfolder() {
    const res = await fetch(`${url}directory/${dirId || "root"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        foldername: foldername,
      }),
    });
    setfoldername("");
    getdata(active);
    setfoldercdiv(false);
  }
  async function handledriveimport() {
    if (!tokenClientRef.current) {
      console.log("Google not loaded");
      return;
    }

    tokenClientRef.current.requestAccessToken();
  }
  function createPicker() {
    if (!accessTokenRef.current) return;

    window.gapi.load("picker", () => {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .addView(window.google.picker.ViewId.FOLDERS)
        .setOAuthToken(accessTokenRef.current)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback(pickerCallback)
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .build();

      picker.setVisible(true);
    });
  }
  async function pickerCallback(data) {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = [];

      for (const doc of data.docs) {
        const file = await importFile(doc);
        if (file) files.push(file);
      }

      if (files.length > 0) {
        const fakeEvent = {
          target: { files },
        };

        handleupload(fakeEvent); // ✅ only once
      }
    }
  }
  async function importFile(doc) {
    try {
      const fileId = doc.id;
      let fileName = doc.name;
      const mimeType = doc.mimeType;

      let url;

      if (mimeType.includes("google-apps")) {
        url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
      } else {
        url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
        },
      });

      const blob = await res.blob();

      // 🔥 EXTENSION FIX (expanded)
      if (!fileName.includes(".")) {
        const type = blob.type;

        // 📄 Documents
        if (type === "application/pdf") fileName += ".pdf";
        else if (type === "text/plain") fileName += ".txt";

        // 🖼️ Images
        else if (type === "image/png") fileName += ".png";
        else if (type === "image/jpeg") fileName += ".jpg";
        else if (type === "image/webp") fileName += ".webp";
        else if (type === "image/gif") fileName += ".gif";

        // 🎬 Videos
        else if (type === "video/mp4") fileName += ".mp4";
        else if (type === "video/webm") fileName += ".webm";
        else if (type === "video/x-matroska") fileName += ".mkv";
        else if (type === "video/quicktime") fileName += ".mov";
        else if (type === "video/x-msvideo") fileName += ".avi";

        // 🎵 Audio
        else if (type === "audio/mpeg") fileName += ".mp3";
        else if (type === "audio/wav") fileName += ".wav";
        else if (type === "audio/ogg") fileName += ".ogg";
        else if (type === "audio/aac") fileName += ".aac";
        else if (type === "audio/flac") fileName += ".flac";

        // 🗜️ Archives
        else if (type === "application/zip") fileName += ".zip";
        else if (type === "application/x-rar-compressed") fileName += ".rar";
        else if (type === "application/x-7z-compressed") fileName += ".7z";

        // 💻 Code / JSON
        else if (type === "application/json") fileName += ".json";
        else if (type === "text/html") fileName += ".html";
        else if (type === "text/css") fileName += ".css";
        else if (type === "application/javascript") fileName += ".js";

        // ❓ Fallback
        else fileName += ".bin";
      }

      const file = new File([blob], fileName, {
        type: blob.type,
      });

      return file;

    } catch (err) {
      console.log("Import error:", err);
      return null;
    }
  }
  useEffect(() => {
    if (window.google) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        callback: (response) => {
          accessTokenRef.current = response.access_token;
          createPicker(); // open picker after auth
        },
      });
    }
  }, []);
  useEffect(() => {
    getdata(active);
  }, [dirId, active]);
  useEffect(() => {
    localStorage.setItem("activeTab", active);
  }, [active]);
  return (
    <>
      <div className="w-screen h-screen bg-[#FAFAFA] flex relative overflow-hidden font-sans antialiased text-[#1A1C1A]">
        {/* Subtle background glow orbs for landing page visual sync */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full filter blur-[100px] opacity-[0.05] bg-gradient-to-tr from-blue-300 via-indigo-200 to-purple-300"></div>
          <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-[0.04] bg-gradient-to-tr from-emerald-200 to-teal-300"></div>
        </div>

        {/* Left Sidebar - Polished Glassmorphism */}
        <div className="left w-[240px] h-screen border-r border-[#EBEAEA] bg-white/80 backdrop-blur-md p-4 flex flex-col shrink-0 relative z-10">
          {/* Logo Block */}
          <div className="logo flex gap-2 h-14 items-center font-extrabold pl-2 text-gray-800 text-[15px]">
            <img src="/logo.png" className="w-5.5 h-5.5" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
            CloudVault
          </div>

          {/* Action Buttons */}
          <div className="btn flex flex-col gap-2 mb-6">
            <button className="w-full hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer h-9.5 bg-[#4A4D4A] hover:bg-[#2E302E] text-white rounded-xl flex items-center justify-center gap-2.5 text-[12px] font-bold shadow-[0_2px_8px_rgba(74,77,74,0.15)]">
              <label
                htmlFor="uploadinput"
                className="w-full h-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Upload Files
              </label>
            </button>
            <input
              type="file"
              hidden
              id="uploadinput"
              onChange={(e) => {
                handleupload(e);
              }}
            ></input>
            <button
              className="cursor-pointer w-full h-9.5 border border-[#CECECE] hover:bg-gray-50 hover:border-gray-400 rounded-xl flex items-center justify-center gap-2.5 text-[12px] text-gray-700 font-semibold transition-all duration-150"
              onClick={() => {
                setfoldercdiv(true);
              }}
            >
              <img src="/folderwithfile.png" className="w-4 h-4" alt="" />
              New Folder
            </button>
            <button
              className="cursor-pointer w-full h-9.5 border border-[#CECECE] hover:bg-gray-50 hover:border-gray-400 rounded-xl flex items-center justify-center gap-2.5 text-[12px] text-gray-700 font-semibold transition-all duration-150"
              onClick={() => {
                handledriveimport();
              }}
            >
              <img src="/google-drive.png" className="w-4 h-4" alt="" />
              Import From Drive
            </button>
          </div>

          {/* Navigation Title */}
          <h6 className="text-[9px] text-gray-400 tracking-[1.8px] font-bold mt-2 mb-1.5 pl-2">
            NAVIGATION
          </h6>

          {/* Navigation Items */}
          <div className="navigation flex flex-col gap-0.5">
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "dashboard"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("dashboard");
                getdata("dashboard");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "dashboard" ? "#2563EB" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <path d="M9 22V12h6v10"></path>
              </svg>
              Dashboard
            </button>
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "My Files"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("My Files");
                getdata();
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "My Files" ? "#2563EB" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              My Files
            </button>
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "Recent"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("Recent");
                getdata("Recent");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "Recent" ? "#2563EB" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Recent
            </button>
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "Favorites"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("Favorites");
                getdata("Favorites");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "Favorites" ? "orange" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Favorites
            </button>
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "Shared"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("Shared");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "Shared" ? "#2563EB" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <path d="M16 6l-4-4-4 4"></path>
                <path d="M12 2v13"></path>
              </svg>
              Shared
            </button>
          </div>

          {/* System Title */}
          <h6 className="text-[9px] text-gray-400 tracking-[1.8px] font-bold mt-5 mb-1.5 pl-2">
            SYSTEM
          </h6>

          {/* System Items */}
          <div className="navigation2 flex flex-col gap-0.5">
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "Trash"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("Trash");
                getdata("Trash");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={active === "Trash" ? "red" : "currentColor"}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Trash
            </button>
            <button
              className={`w-full h-9 transition-all cursor-pointer rounded-xl flex items-center gap-3 text-[12px] pl-3 ${active === "Settings"
                ? "bg-gray-100/80 border border-gray-250 font-bold text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-50/50 hover:text-gray-900 font-semibold"
                }`}
              onClick={() => {
                setActive("Settings");
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </button>
          </div>

          {/* Storage Capacity Widget - Repositioned mt-auto */}
          <div className="storagecapacity w-full bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2 mt-auto">
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <h1>Storage</h1>
              <h6 className="text-[11px] text-gray-700 font-extrabold">
                {storageper.toFixed(2)}%
              </h6>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="progress h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${storageper}%` }}
              ></div>
            </div>
            <div className="text-[9.5px] text-gray-400 font-semibold leading-none">
              <h1>
                {formatBytes(data?.totalSize || 0)} of {activePlanInfo.label} used
              </h1>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full h-8 bg-[#4A4D4A] hover:bg-[#2E302E] transition-all rounded-lg flex items-center justify-center text-white cursor-pointer mt-1 hover:shadow-sm border-none"
            >
              <h1 className="text-[10px] font-bold">{getUpgradeButtonText()}</h1>
            </button>
          </div>
        </div>

        {/* Right Area - Flex-1 wrapper */}
        <div className="right flex-1 flex flex-col h-screen min-w-0 relative z-10">
          <Navbar data={data} getdata={getdata} url={url} setShowUpgradeModal={setShowUpgradeModal} setActive={setActive} />

          {/* Content Pane */}
          <div className="flex-1 overflow-hidden bg-gray-50/30 p-6">
            {active === "dashboard" && (
              <Dashboard
                url={url}
                data={data}
                getdata={getdata}
                active={active}
                setActive={setActive}
              />
            )}
            {active === "My Files" && (
              <MyFiles
                url={url}
                data={data}
                getdata={getdata}
                active={active}
              />
            )}
            {active === "Recent" && (
              <Recent
                url={url}
                data={data}
                getdata={getdata}
                active={active}
                setActive={setActive}
              />
            )}
            {active === "Favorites" && (
              <Favorites
                url={url}
                data={data}
                getdata={getdata}
                active={active}
              />
            )}
            {active === "Shared" && <Shared />}
            {active === "Trash" && (
              <Trash url={url} data={data} getdata={getdata} active={active} />
            )}
            {active === "Settings" && (
              <Settings
                data={data}
                currentPlan={currentPlan}
                setShowUpgradeModal={setShowUpgradeModal}
                url={url}
                getdata={getdata}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </div>

        {/* Uploading progress widget */}
        {uploading && (
          <div className="uploading fixed bottom-5 right-5 z-[9999] w-[320px] bg-white/90 backdrop-blur-md border border-gray-100 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden animate-slide-up transition-all duration-300">
            <div className="w-full h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FiUploadCloud className="text-blue-500 text-lg animate-pulse-glow" />
                <h1 className="text-[13px] font-semibold text-gray-700">Uploading File</h1>
              </div>
              {uploadfile[0]?.done ? (
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">
                  <FiCheck />
                </div>
              ) : (
                <button
                  onClick={handleCancelUpload}
                  className="px-2.5 py-1 text-[11px] text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors rounded-lg font-medium cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="p-4">
              {uploadfile.map((file) => {
                return (
                  <div key={file.id} className="w-full flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-lg flex-shrink-0">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-[12px] font-medium text-gray-700 truncate leading-none mb-1">
                          {file.name}
                        </h1>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {file.size}
                        </span>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-200"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <div className="w-full text-[11px] text-gray-500 flex justify-between font-medium">
                        <span>{file.progress}%</span>
                        <span className={file.done ? "text-green-500" : "text-blue-500"}>
                          {file.done ? "Upload complete" : "Uploading..."}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Folder Modal - Upgraded to glassmorphic centered overlay */}
        {foldercdiv && (
          <div
            className="foldercreate fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => {
              setfoldername("");
              setfoldercdiv(false);
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createfolder();
              }}
              className="w-full max-w-[360px]"
            >
              <div
                className="bg-white border border-gray-200/80 rounded-2xl flex flex-col gap-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.18)] p-6 animate-slide-up"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                      📁
                    </div>
                    <h1 className="text-sm font-bold text-gray-800">Create Folder</h1>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                    onClick={() => {
                      setfoldername("");
                      setfoldercdiv(false);
                    }}
                  >
                    <FiX className="text-gray-400" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foldername" className="text-xs font-bold text-gray-500">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    id="foldername"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 focus:ring-[#4A4D4A]/10 rounded-xl text-xs outline-none focus:border-[#4A4D4A] focus:ring-[3px] transition-all"
                    value={foldername}
                    placeholder="Enter folder name..."
                    onChange={(e) => {
                      setfoldername(e.target.value);
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 mt-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    onClick={() => {
                      setfoldername("");
                      setfoldercdiv(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-all rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer shadow-sm hover:shadow"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Upgrade to Pro Modal */}
        {showUpgradeModal && (
          <div
            className="upgrade-modal fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowUpgradeModal(false)}
          >
            <div
              className="bg-white border border-gray-250/80 rounded-3xl flex flex-col gap-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.22)] w-full max-w-[920px] p-8 animate-slide-up relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full filter blur-[100px] opacity-10 bg-gradient-to-tr from-blue-400 to-indigo-500 pointer-events-none"></div>

              <div className="flex items-center justify-between shrink-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shadow-sm">
                    ✨
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-gray-800 leading-none mb-1">Upgrade Storage Plan</h1>
                    <p className="text-[11px] font-semibold text-gray-400">Choose the perfect capacity and speed for your workflow.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-150 flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  <FiX className="text-gray-450" />
                </button>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2">
                {pricingPlans.map((plan) => {
                  const isCurrent = currentPlan === plan.key;
                  return (
                    <div
                      key={plan.key}
                      className={`p-6 rounded-2xl border-2 flex flex-col justify-between transition-all ${plan.bgClass} ${isCurrent ? plan.currentBorderClass : plan.defaultBorderClass
                        }`}
                    >
                      {plan.isRecommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#4A4D4A] text-white text-[8px] uppercase tracking-widest font-extrabold rounded-full">
                          Recommended
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-xs font-bold ${plan.titleClass}`}>{plan.name}</h3>
                          {isCurrent && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${plan.currentBadgeClass}`}>
                              Current
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] uppercase block mt-1 ${plan.taglineClass}`}>
                          {plan.tagline}
                        </span>
                        <div className="my-5">
                          <span className="text-3xl font-extrabold text-[#1A1C1A]">{plan.price}</span>
                          <span className="text-xs text-gray-400 font-semibold">{plan.billing}</span>
                        </div>
                        <ul className={`flex flex-col gap-2.5 text-[11px] text-gray-500 font-semibold border-t pt-5 ${plan.dividerClass}`}>
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className={`flex items-center gap-2 ${!feature.included ? "text-gray-400/80 line-through" : ""
                                }`}
                            >
                              <FiCheck
                                className={`${feature.included ? plan.checkIconClass : "text-gray-300"
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
                      <button
                        onClick={() => handleSelectPlan(plan.key, plan.planid)}
                        className={`w-full mt-6 py-2.5 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${isCurrent ? plan.activeButtonClass : plan.inactiveButtonClass
                          }`}
                      >
                        {isCurrent ? plan.buttonText.active : plan.buttonText.inactive}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Status footer message */}
              <div className="text-[10px] text-center text-gray-400 font-medium">
                Billing processed securely. Cancel or adjust subscription tiers at any time.
              </div>
            </div>
          </div>
        )}

        {/* Custom Error Popup Modal */}
        {errorPopup.show && (
          <div
            className="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setErrorPopup((prev) => ({ ...prev, show: false }))}
          >
            <div
              className="bg-white border border-gray-250/80 rounded-2xl flex flex-col gap-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.18)] max-w-[400px] w-full p-6 animate-slide-up relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-lg animate-pulse-glow">
                  ⚠️
                </div>
                <h1 className="text-sm font-bold text-gray-800">{errorPopup.title || "Notification"}</h1>
              </div>
              <p className="text-xs font-semibold text-gray-500 leading-normal">
                {errorPopup.message}
              </p>
              <div className="flex gap-3 mt-2 justify-end">
                <button
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer border-none outline-none"
                  onClick={() => setErrorPopup((prev) => ({ ...prev, show: false }))}
                >
                  Close
                </button>
                {errorPopup.action && (
                  <button
                    className="px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-all rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer shadow-sm hover:shadow border-none outline-none"
                    onClick={() => {
                      errorPopup.action();
                      setErrorPopup((prev) => ({ ...prev, show: false }));
                    }}
                  >
                    {errorPopup.buttonText || "Proceed"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showUpgradeSuccess && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] bg-gray-900 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] animate-slide-down">
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
            <span className="text-xs font-bold">
              Success! Plan updated to {successPlanName}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

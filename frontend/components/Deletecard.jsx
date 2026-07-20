import React from "react";
import { useState } from "react";

const Deletecard = ({ el, getdata, active }) => {
  const url = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "") + "/";
  const [deletemenu, setdeletemenu] = useState(false);
  const [restoremenu, setrestoremenu] = useState(false);
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      h: 3600,
      Min: 60,
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value > 0) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }
  function formatSize(size) {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
  const fileIcons = {
  // Images
  ".jpg": <img src='/img-banner.png'></img>,
  ".jpeg": <img src='/img-banner.png'></img>,
  ".png": <img src='/img-banner.png'></img>,
  ".gif": <img src='/img-banner.png'></img>,
  ".webp": <img src='/img-banner.png'></img>,
  ".svg": <img src='/img-banner.png'></img>,
  ".avif": <img src='/img-banner.png'></img>,

  // Documents
  ".pdf": <img src='/pdf-banner.png'></img>,
  ".doc": <img src='/doc-banner.png'></img>,
  ".docx": <img src='/doc-banner.png'></img>,
  ".txt": <img src='/txt-banner.png'></img>,
  ".rtf": "📄",

  // Spreadsheets
  ".xls": "📊",
  ".xlsx": "📊",
  ".csv": "📊",

  // Presentations
  ".ppt": "📽️",
  ".pptx": "📽️",

  // Videos
  ".mp4": "🎬",
  ".mkv": "🎬",
  ".avi": "🎬",
  ".mov": "🎬",
  ".webm": "🎬",

  // Audio
  ".mp3": "🎵",
  ".wav": "🎵",
  ".aac": "🎵",
  ".ogg": "🎵",

  // Archives
  ".zip": "🗜️",
  ".rar": "🗜️",
  ".7z": "🗜️",
  ".tar": "🗜️",
  ".gz": "🗜️",

  // Code files
  ".js": <img src='/code-banner.png'></img>,
  ".jsx": <img src='/code-banner.png'></img>,
  ".ts": <img src='/code-banner.png'></img>,
  ".html": <img src='/code-banner.png'></img>,
  ".css":<img src='/code-banner.png'></img>,
  ".json": <img src='/code-banner.png'></img>,
  ".py":<img src='/code-banner.png'></img>,
  ".java": <img src='/code-banner.png'></img>,

  // Default
  "default": "📁"
};
  async function handledelete(fileid, name, value) {
    const res = await fetch(`${url}file/${fileid}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        name: name,
        type: value ? value : "null",
      },
    });
    const data = await res.json();
    getdata(active);
  }
  async function handlerestore(fileid,value) {
    const responce = await fetch(`${url}file/${fileid}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        type: value ? value : "null",
      },
    });
    setrestoremenu(false)
    getdata(active);
  }
  return (
    <div className="w-full h-12.5 flex items-center hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-b-0">
      {/* File Name */}
      <div className="w-[32%] pl-6 flex items-center gap-3 text-xs font-semibold text-gray-700 truncate">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-150 flex-shrink-0 text-base shadow-sm">
          {fileIcons[el.ext] || "📁"}
        </div>
        <span className="truncate" title={el.name}>
          {el.name}
        </span>
      </div>

      {/* Original Location */}
      <div className="w-[25%] flex items-center justify-center text-[11px] font-semibold text-gray-400 capitalize truncate px-2">
        <span className="truncate">
          📁 &nbsp;/&nbsp;
          {Array.isArray(el?.path) ? el.path.join(" / ") : ""}
        </span>
      </div>

      {/* Deleted Time */}
      <div className="w-[18%] flex items-center justify-center text-xs text-gray-500 font-medium">
        {timeAgo(el.updatedAt)}
      </div>

      {/* File Size */}
      <div className="w-[12%] flex items-center justify-center text-xs text-gray-500 font-medium">
        {formatSize(el.size)}
      </div>

      {/* Actions */}
      <div className="w-[13%] flex items-center justify-end pr-6 gap-3">
        {/* Restore Action */}
        <button
          className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 text-blue-600 transition-colors shadow-sm"
          onClick={() => setrestoremenu(true)}
          title="Restore File"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        {/* Permanent Delete Action */}
        <button
          className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center bg-red-50 border border-red-100 hover:bg-red-100 hover:text-red-700 text-red-500 transition-colors shadow-sm"
          onClick={() => setdeletemenu(true)}
          title="Delete Forever"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {/* Delete Forever Modal */}
      {deletemenu && (
        <div
          className="deletemenu fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setdeletemenu(false)}
        >
          <div
            className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 text-base shadow-sm">
                  ⚠️
                </div>
                <h1 className="font-bold text-sm text-gray-800">Delete Forever?</h1>
              </div>
              <button
                className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                onClick={() => setdeletemenu(false)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Are you sure you want to permanently delete this file?
              </p>
              <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-lg text-xs font-bold text-gray-700 truncate max-w-full">
                {el.name}
              </div>
              <p className="text-[11px] font-extrabold text-red-500 tracking-wide uppercase mt-1">
                This action is destructive and cannot be undone!
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                onClick={() => setdeletemenu(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
                onClick={() => handledelete(el._id, el.name, "permanentdelete")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore File Modal */}
      {restoremenu && (
        <div
          className="restoremenu fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setrestoremenu(false)}
        >
          <div
            className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-base shadow-sm">
                  🔄
                </div>
                <h1 className="font-bold text-sm text-gray-800">Restore File?</h1>
              </div>
              <button
                className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                onClick={() => setrestoremenu(false)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Restore this file back to its original directory path?
              </p>
              <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-lg text-xs font-bold text-gray-700 truncate max-w-full">
                {el.name}
              </div>
              <div className="text-[11px] font-semibold text-gray-450 flex items-center gap-1">
                <span>Location:</span>
                <span className="font-extrabold text-gray-700 capitalize">
                  📁 / {Array.isArray(el?.path) ? el.path.join(" / ") : ""}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                onClick={() => setrestoremenu(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
                onClick={() => handlerestore(el._id, "restore")}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deletecard;

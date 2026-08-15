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
    setrestoremenu(false);
    getdata(active);
  }
  return (
    <div className="w-full h-13 flex items-center hover:bg-gray-50 bg-white transition-colors border-b-2 border-gray-900 last:border-b-0 select-none">
      {/* File Name */}
      <div className="w-[32%] pl-6 flex items-center gap-3 text-xs font-black text-gray-900 truncate uppercase">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border-2 border-gray-900 flex-shrink-0 text-base shadow-[1px_1px_0px_rgba(0,0,0,1)] [&>img]:w-full [&>img]:h-full [&>img]:object-contain">
          {fileIcons[el.ext] || "📁"}
        </div>
        <span className="truncate" title={el.name}>
          {el.name}
        </span>
      </div>

      {/* Original Location */}
      <div className="w-[25%] flex items-center justify-center text-[10px] font-black text-gray-550 capitalize truncate px-2">
        <span className="truncate">
          📁 &nbsp;/&nbsp;
          {Array.isArray(el?.path) ? el.path.map((p) => p.name).join(" / ") : ""}
        </span>
      </div>

      {/* Deleted Time */}
      <div className="w-[18%] flex items-center justify-center text-xs text-gray-900 font-bold">
        {timeAgo(el.updatedAt)}
      </div>

      {/* File Size */}
      <div className="w-[12%] flex items-center justify-center text-xs text-gray-900 font-bold">
        {formatSize(el.size)}
      </div>

      {/* Actions */}
      <div className="w-[13%] flex items-center justify-end pr-6 gap-3">
        {/* Restore Action */}
        <button
          className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center bg-white border-2 border-gray-900 hover:bg-gray-50 text-gray-900 transition-colors shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px]"
          onClick={() => setrestoremenu(true)}
          title="Restore File"
        >
          <svg
            className="w-4 h-4 stroke-[2.5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center bg-red-100 border-2 border-red-500 text-red-700 hover:bg-red-200 transition-colors shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px]"
          onClick={() => setdeletemenu(true)}
          title="Delete Forever"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
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
            className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-red-100 border-2 border-gray-900 flex items-center justify-center text-red-650 text-base shadow-[1px_1px_0px_rgba(0,0,0,1)] font-black">
                  ⚠️
                </div>
                <h1 className="font-black text-sm text-gray-900 uppercase">Delete Forever?</h1>
              </div>
              <button
                className="w-7 h-7 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-900 font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                onClick={() => setdeletemenu(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                Are you sure you want to permanently delete this file?
              </p>
              <div className="bg-[#FAFAFA] border-2 border-gray-900 p-2.5 rounded-lg text-xs font-black text-gray-950 truncate max-w-full">
                {el.name}
              </div>
              <p className="text-[11px] font-extrabold text-red-600 tracking-wide uppercase mt-1">
                This action is destructive and cannot be undone!
              </p>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={() => setdeletemenu(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-700 transition-colors flex items-center justify-center rounded-xl cursor-pointer font-extrabold gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
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
            className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#CCFF00] border-2 border-gray-900 flex items-center justify-center text-gray-900 text-base shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  🔄
                </div>
                <h1 className="font-black text-sm text-gray-900 uppercase">Restore File?</h1>
              </div>
              <button
                className="w-7 h-7 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-900 font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                onClick={() => setrestoremenu(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                Restore this file back to its original directory path?
              </p>
              <div className="bg-[#FAFAFA] border-2 border-gray-900 p-2.5 rounded-lg text-xs font-black text-gray-950 truncate max-w-full">
                {el.name}
              </div>
              <div className="text-[11px] font-bold text-gray-550 flex items-center gap-1">
                <span>Location:</span>
                <span className="font-black text-gray-900 uppercase">
                  📁 / {Array.isArray(el?.path) ? el.path.map((p) => p.name).join(" / ") : ""}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={() => setrestoremenu(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] border-2 border-gray-900 transition-colors flex items-center justify-center text-gray-900 rounded-xl cursor-pointer font-black gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
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

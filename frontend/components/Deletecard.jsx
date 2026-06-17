import React from "react";
import { useState } from "react";

const Deletecard = ({ el, getdata, active }) => {
  const url = "http://localhost:3000/";
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
    <div className="w-full h-12  border-t border-[#a3a3a3] flex ">
      <div className="w-[25vw] h-full   text-[14px] flex items-center pl-4 gap-2">
        <div className="w-7 h-7  flex items-center justify-center rounded ">
          {fileIcons[el.ext]}
        </div>
        {el.name}
      </div>
      <div className="w-[18vw] h-full   text-[12px] flex items-center justify-center capitalize ">
        📁 &nbsp; /
        {Array.isArray(el?.path) ? el.path.map((word) => word).join(" / ") : ""}
      </div>
      <div className="w-[15vw] h-full   text-[14px] flex items-center justify-center">
        {timeAgo(el.updatedAt)}
      </div>
      <div className="w-[10vw] h-full   text-[14px] flex items-center justify-center">
        {formatSize(el.size)}
      </div>
      <div className="w-[15vw] h-full   text-[14px] flex items-center justify-center gap-3">
        <div
          className="w-9 h-9 rounded  cursor-pointer flex items-center justify-center"
          onClick={() => {
            setrestoremenu(true);
          }}
        >
          <svg
            className="w-6 h-6 text-[#4A90E2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div
          className="w-9 h-9 rounded  cursor-pointer flex items-center justify-center"
          onClick={() => {
            setdeletemenu(true);
          }}
        >
          {" "}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="red"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>{" "}
        </div>
      </div>
      <div
        className={`deletemenu w-screen h-screen z-100 bg-[#1010104e] backdrop-blur-[2px] absolute top-0 left-0 ${deletemenu ? "flex" : "hidden"} items-center justify-center`}
        onClick={() => {
          setdeletemenu(false);
        }}
      >
        <div
          className="w-[30vw] h-50 bg-white rounded-xl p-5 border border-[#c0bdbd] "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <svg
                className="w-8 h-8 text-[#FF6B6B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="font-bold text-[#FF6B6B]">Delete Forever?</h1>
            </div>

            <div
              className="w-9 h-9 bg-[#dbdada] rounded-xl flex items-center justify-center cursor-pointer"
              onClick={() => {
                setdeletemenu(false);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <p className="text-[13px] mt-4  ">
            Are you sure you want to permanently delete
          </p>
          <span className="font-bold text-[12px] max-w-96   h-4 text-ellipsis  inline-block   overflow-hidden">
            {" "}
            {el.name}
          </span>
          <p className="text-[12px] font-semibold text-[#FF6B6B]">
            This action cannot be undone!
          </p>

          <div className="w-full h-16  flex items-center justify-end gap-4">
            <div
              className="text-[12px] w-16 h-10 border border-[#c0bdbd] hover:bg-[#bebdbd] transition-colors font-semibold flex items-center justify-center rounded-xl cursor-pointer"
              onClick={(e) => {
                setdeletemenu(false);
              }}
            >
              Cancel
            </div>
            <div
              className="text-[12px] w-24 h-10 border border-[#e6a5a5]  bg-rose-50  hover:bg-rose-100 transition-colors flex items-center justify-center text-[red] rounded-xl cursor-pointer font-semibold gap-2"
              onClick={() => {
                handledelete(el._id, el.name, "permanentdelete");
              }}
            >
              {" "}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </div>
          </div>
        </div>
      </div>
      <div
        className={`restoremenu w-screen h-screen z-100 bg-[#1010104e] backdrop-blur-[2px] absolute top-0 left-0 ${restoremenu ? "flex" : "hidden"} items-center justify-center`}
        onClick={() => {
          setrestoremenu(false);
        }}
      >
        <div
          className="w-[30vw] h-50 bg-white rounded-xl p-5 border border-[#c0bdbd] "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <svg
                className="w-6 h-6 text-[#4A90E2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <h1 className="font-bold text-[#3466c3]">Restore File</h1>
            </div>

            <div
              className="w-9 h-9 bg-[#dbdada] rounded-xl flex items-center justify-center cursor-pointer"
              onClick={() => {
                setrestoremenu(false);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <p className="text-[13px] mt-4  ">
            Are you sure you want to restore
            <span className="font-bold text-[12px] w-96  h-4 text-ellipsis  inline-block   overflow-hidden">
              {" "}
              {el.name}
            </span>
          </p>
          <p className="text-[13px] capitalize ">
            It will be restored to:📁{" "}
            <p className="inline-block font-bold ">
              /
              {Array.isArray(el?.path)
                ? el.path.map((word) => word).join(" / ")
                : ""}
            </p>
          </p>

          <div className="w-full h-16  flex items-center justify-end gap-4">
            <div
              className="text-[12px] w-16 h-10 border border-[#c0bdbd] hover:bg-[#bebdbd] transition-colors font-semibold flex items-center justify-center rounded-xl cursor-pointer"
              onClick={(e) => {
                setrestoremenu(false);
              }}
            >
              Cancel
            </div>
            <div
              className="text-[12px] w-24 h-10 border border-[#8abfcf]  bg-blue-50  hover:bg-blue-100 transition-colors flex items-center justify-center text-[#3b64e0] rounded-xl cursor-pointer font-semibold gap-2"
              onClick={() => {
                handlerestore(el._id,'restore');
              }}
            >
              <svg
                className="w-4 h-4 text-[#3466c3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Restore
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deletecard;

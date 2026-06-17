import React from "react";

const Dashfcard = ({
  name,
  id,
  getdata,
  ext,
  modifed,
  size,
  favorites,
  active,
}) => {
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
    ".mp4": <img src="/video-banner.png"></img>,
    ".mkv": <img src="/video-banner.png"></img>,
    ".avi": <img src="/video-banner.png"></img>,
    ".mov": <img src="/video-banner.png"></img>,
    ".webm": <img src="/video-banner.png"></img>,

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
  function handleopen(name) {
    window.location.href = `http://localhost:3000/file/${id}${ext}?name=${name}`;
  }
  return (
    <div className="w-full h-12  border-b border-[#b1b1b1]  select-none hover:bg-[#EBEAEA]" onDoubleClick={() => {
            handleopen(name);
          }}>
      <div className="  w-full h-full flex items-center p-2  gap-2 ">
        <div className="w-7 h-7  flex items-center  justify-center rounded">
          {fileIcons[ext]}
        </div>
        <div className="w-[9vw]  h-5 text-[12px] text-ellipsis overflow-hidden">
          {name}
        </div>
          
        <h1 className="text-[11px] ml-9 text-[#767575]">{timeAgo(modifed)}</h1>
      </div>
    </div>
  );
};

export default Dashfcard;

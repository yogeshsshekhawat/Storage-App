import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CiUser } from "react-icons/ci";
import { CiMenuBurger } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import { IoOpenOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { Link } from "react-router";
import { FiClock } from "react-icons/fi";

const Filecard = ({
  name,
  id,
  getdata,
  ext,
  modifed,
  size,
  favorites,
  active,
  compact = false,
  layout = "list",
  ownerName = "User",
}) => {
  const ownerInitials = ownerName
    ? ownerName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  const url = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "") + "/";
  const [newname, setnewname] = useState(name);
  const [optionmenu, setoptionmenu] = useState(false);
  const [deletemenu, setdeletemenu] = useState(false);
  const [sharemenu, setsharemenu] = useState(false);
  const [rename, setrename] = useState(false);
  const [x, setx] = useState();
  const [y, sety] = useState();
  const [sharetype, setsharetype] = useState("link");
  const [enabled, setEnabled] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [permissionInput, setPermissionInput] = useState("view");
  const [sharedWithList, setSharedWithList] = useState([]);
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");

  useEffect(() => {
    if (sharemenu) {
      const fetchShareInfo = async () => {
        try {
          const res = await fetch(`${url}file/share-info/${id}`, {
            method: "GET",
            credentials: "include"
          });
          const data = await res.json();
          if (res.ok) {
            setEnabled(data.isShared);
            if (data.isShared) {
              setShareLink(`${url}share/${data.shareId}`);
            } else {
              setShareLink("");
            }
            setSharedWithList(data.sharedWith || []);
          }
        } catch (err) {
          console.error("fetchShareInfo error:", err);
        }
      };
      fetchShareInfo();
      setShareError("");
      setShareSuccess("");
      setEmailInput("");
      setPermissionInput("view");
    }
  }, [sharemenu, id]);

  const handleOpenMenu = (e) => {
    setoptionmenu(true);
    setx(e.clientX - 150 + "px");
    const menuHeight = 210; // options menu height
    const spaceBelow = window.innerHeight - e.clientY;
    if (spaceBelow < menuHeight) {
      sety(e.clientY - menuHeight - 12 + "px");
    } else {
      sety(e.clientY + 12 + "px");
    }
  };

  function handleopen(name) {
    window.location.href = `${url}file/${id}${ext}?name=${name}`;
  }

  const fileIcons = {
    // Images
    ".jpg": <img src="/img-banner.png" alt="jpg"></img>,
    ".jpeg": <img src="/img-banner.png" alt="jpeg"></img>,
    ".png": <img src="/img-banner.png" alt="png"></img>,
    ".gif": <img src="/img-banner.png" alt="gif"></img>,
    ".webp": <img src="/img-banner.png" alt="webp"></img>,
    ".svg": <img src="/img-banner.png" alt="svg"></img>,
    ".avif": <img src="/img-banner.png" alt="avif"></img>,

    // Documents
    ".pdf": <img src="/pdf-banner.png" alt="pdf"></img>,
    ".doc": <img src="/doc-banner.png" alt="doc"></img>,
    ".docx": <img src="/doc-banner.png" alt="docx"></img>,
    ".txt": <img src="/txt-banner.png" alt="txt"></img>,
    ".rtf": "📄",

    // Spreadsheets
    ".xls": "📊",
    ".xlsx": "📊",
    ".csv": "📊",

    // Presentations
    ".ppt": "📽️",
    ".pptx": "📽️",

    // Videos
    ".mp4": <img src="/video-banner.png" alt="mp4"></img>,
    ".mkv": <img src="/video-banner.png" alt="mkv"></img>,
    ".avi": <img src="/video-banner.png" alt="avi"></img>,
    ".mov": <img src="/video-banner.png" alt="mov"></img>,
    ".webm": <img src="/video-banner.png" alt="webm"></img>,

    // Audio
    ".mp3": <img src="/audio-banner.png" alt="mp3"></img>,
    ".wav": <img src="/audio-banner.png" alt="wav"></img>,
    ".aac": <img src="/audio-banner.png" alt="aac"></img>,
    ".ogg": <img src="/audio-banner.png" alt="ogg"></img>,

    // Archives
    ".zip": "🗜️",
    ".rar": "🗜️",
    ".7z": "🗜️",
    ".tar": "🗜️",
    ".gz": "🗜️",

    // Code files
    ".js": <img src="/code-banner.png" alt="js"></img>,
    ".jsx": <img src="/code-banner.png" alt="jsx"></img>,
    ".ts": <img src="/code-banner.png" alt="ts"></img>,
    ".html": <img src="/code-banner.png" alt="html"></img>,
    ".css": <img src="/code-banner.png" alt="css"></img>,
    ".json": <img src="/code-banner.png" alt="json"></img>,
    ".py": <img src="/code-banner.png" alt="py"></img>,
    ".java": <img src="/code-banner.png" alt="java"></img>,

    // Default
    default: "📁",
  };

  function formatSize(size) {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }

  async function handledelete(fileid, value) {
    await fetch(`${url}file/${fileid}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        name: name,
        type: value ? value : "null",
      },
    });
    setdeletemenu(false);
    getdata(active);
  }

  async function handlerename(value) {
    await fetch(`${url}file/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        newname: newname,
        type: value ? value : "null",
      },
    });
    setrename(false);
    setoptionmenu(false);
    getdata(active);
    setnewname(newname);
  }

  async function handlefavorite(value) {
    await fetch(`${url}file/favorite`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        favorite: value,
        fileId: id,
      }),
    });
    if (active === "Favorites") {
      getdata("Favorites");
    } else {
      getdata(active);
    }
  }

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

  const badgeColors = {
    // Images
    ".jpg": "bg-amber-50 text-amber-600 border-amber-250",
    ".jpeg": "bg-amber-50 text-amber-600 border-amber-250",
    ".png": "bg-amber-50 text-amber-600 border-amber-250",
    ".gif": "bg-amber-50 text-amber-600 border-amber-250",
    ".webp": "bg-amber-50 text-amber-600 border-amber-250",
    ".svg": "bg-amber-50 text-amber-600 border-amber-250",

    // Docs
    ".pdf": "bg-red-50 text-red-600 border-red-250",
    ".doc": "bg-blue-50 text-blue-600 border-blue-250",
    ".docx": "bg-blue-50 text-blue-600 border-blue-250",
    ".txt": "bg-gray-100 text-gray-600 border-gray-250",

    // Code
    ".js": "bg-yellow-50 text-yellow-600 border-yellow-250",
    ".jsx": "bg-yellow-50 text-yellow-600 border-yellow-250",
    ".ts": "bg-blue-50 text-blue-600 border-blue-250",
    ".html": "bg-orange-50 text-orange-600 border-orange-250",
    ".css": "bg-teal-50 text-teal-600 border-teal-250",

    // Video
    ".mp4": "bg-purple-50 text-purple-600 border-purple-250",
    ".mkv": "bg-purple-50 text-purple-600 border-purple-250",
    ".avi": "bg-purple-50 text-purple-600 border-purple-250",

    // Spreadsheets
    ".xls": "bg-emerald-50 text-emerald-600 border-emerald-250",
    ".xlsx": "bg-emerald-50 text-emerald-600 border-emerald-250",
    ".csv": "bg-emerald-50 text-emerald-600 border-emerald-250",

    default: "bg-gray-50 text-gray-500 border-gray-250"
  };

  return (
    <>
      <div className={layout === "grid" ? "group w-full h-full" : "group w-full"}>
        {layout === "grid" ? (
          <div
            className="filecard flex flex-col items-center justify-between rounded-2xl p-4 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all h-36 select-none relative cursor-pointer"
            onDoubleClick={() => {
              handleopen(name);
            }}
          >
            {/* Top Row: Favorite star & Context Menu */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              {favorites && <span className="text-amber-500 text-xs">⭐</span>}
            </div>

            <div className="absolute top-2.5 right-2.5">
              <button
                className="option cursor-pointer w-6 h-6 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                }}
                onClick={handleOpenMenu}
              >
                <CiMenuBurger className="stroke-[1.5]" />
              </button>
            </div>

            {/* Icon representation */}
            <div className="w-12 h-12 flex items-center justify-center text-4xl mt-3 group-hover:scale-105 transition-transform duration-200 [&>img]:w-full [&>img]:h-full [&>img]:object-contain">
              {fileIcons[ext] || "📁"}
            </div>

            {/* File Info */}
            <div className="w-full text-center flex flex-col items-center gap-0.5 mt-2">
              <span className="text-xs font-bold text-gray-700 truncate w-full px-1" title={name}>
                {name}
              </span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                {ext ? ext.replace(".", "") : "file"} • {formatSize(size)}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`filecard select-none transition-all duration-200 ${compact
              ? "w-full relative border-b border-gray-100 h-11 bg-white flex items-center text-[12px] hover:bg-gray-50/70 justify-between px-3 cursor-pointer"
              : "w-full flex items-center h-13 bg-white hover:bg-slate-50/30 shadow-[0_2px_6px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] rounded-xl px-4 mb-2 relative group/row text-[12px] cursor-pointer"
              }`}
            onDoubleClick={() => {
              handleopen(name);
            }}
          >
            {compact ? (
              <>
                <div className="flex items-center gap-2 max-w-[85%] pl-1">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-lg [&>img]:w-full [&>img]:h-full [&>img]:object-contain">
                    {fileIcons[ext] || "📁"}
                  </div>
                  <div className="truncate font-semibold text-gray-700 w-44" title={name}>
                    {name}
                  </div>
                  {favorites && <div className="ml-1 text-amber-500 text-[10px]">⭐</div>}
                </div>
                <button
                  className="option cursor-pointer w-7 h-7 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={handleOpenMenu}
                >
                  <CiMenuBurger className="stroke-[1.5]" />
                </button>
              </>
            ) : (
              <>
                {/* Name (34%) */}
                <div className="w-[34%] h-full flex items-center pl-2 gap-3 text-xs font-semibold text-gray-700 truncate">
                  <div className="w-8 h-8 flex items-center justify-center text-xl flex-shrink-0 group-hover/row:scale-105 transition-transform duration-200 [&>img]:w-full [&>img]:h-full [&>img]:object-contain">
                    {fileIcons[ext] || "📁"}
                  </div>
                  <span className="truncate max-w-[80%]" title={name}>
                    {name}
                  </span>
                  {favorites && <span className="ml-1 text-amber-500 text-[10px] shrink-0">⭐</span>}
                </div>

                {/* Modified (18%) */}
                <div className="w-[18%] h-full flex items-center justify-center text-xs text-gray-500 font-semibold gap-1.5">
                  <FiClock className="text-gray-300 text-[10px] shrink-0" />
                  <span>{timeAgo(modifed)}</span>
                </div>

                {/* Owner (16%) */}
                <div className="w-[16%] h-full flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
                  <div className="w-5.5 h-5.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-[9px] font-bold shadow-sm uppercase shrink-0">
                    {ownerInitials}
                  </div>
                  <span className="capitalize truncate">{ownerName}</span>
                </div>

                {/* Type (8%) */}
                <div className="w-[8%] h-full flex items-center justify-center">
                  <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold tracking-wide uppercase shrink-0 ${badgeColors[ext] || badgeColors.default}`}>
                    {ext ? ext.replace(".", "") : "file"}
                  </span>
                </div>

                {/* Size (10%) */}
                <div className="w-[10%] h-full flex items-center justify-center text-xs text-gray-500 font-semibold">
                  {formatSize(size)}
                </div>

                {/* Actions & Hover controls (14%) */}
                <div className="w-[14%] h-full flex items-center justify-end gap-1.5 pr-2">
                  <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlefavorite(favorites ? 1 : 0);
                      }}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer shrink-0 ${favorites
                        ? "bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100/50"
                        : "bg-white text-gray-400 border-gray-200 hover:text-amber-500 hover:border-amber-200"
                        }`}
                      title={favorites ? "Unfavorite" : "Favorite"}
                    >
                      <FaRegHeart className={`text-[10px] ${favorites ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setsharemenu(true);
                      }}
                      className="w-7 h-7 bg-white text-gray-400 border border-gray-200 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0"
                      title="Share File"
                    >
                      <IoShareSocialOutline className="text-xs" />
                    </button>
                  </div>

                  <button
                    className="option cursor-pointer w-7 h-7 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border-none bg-transparent shrink-0"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={handleOpenMenu}
                  >
                    <CiMenuBurger className="stroke-[1.5]" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Options Context Menu */}
        {optionmenu && createPortal(
          <div
            className="fixed inset-0 z-[9998] bg-transparent card-portal"
            onClick={() => {
              setoptionmenu(false);
            }}
          >
            <div
              className="menuoption w-[150px] bg-white border border-gray-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[9999] fixed flex flex-col rounded-xl p-1 cursor-pointer text-gray-700 font-semibold text-xs animate-fade-in"
              style={{
                left: x,
                top: y,
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg text-red-500 transition-colors hover:bg-red-50"
                onClick={() => {
                  setdeletemenu(true);
                  setoptionmenu(false);
                }}
              >
                <span>Delete</span>
                <MdOutlineDelete className="text-red-500 text-sm" />
              </div>

              <Link
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-750"
                to={`${url}file/${id}${ext}?action=download&name=${name}`}
                onClick={() => setoptionmenu(false)}
              >
                <span>Download</span>
                <BsDownload className="text-gray-450 text-[10px]" />
              </Link>

              <div
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-755"
                onClick={() => {
                  handleopen(name);
                  setoptionmenu(false);
                }}
              >
                <span>Open</span>
                <IoOpenOutline className="text-gray-450 text-sm" />
              </div>

              <div
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-755"
                onClick={() => {
                  setrename(true);
                  setoptionmenu(false);
                }}
              >
                <span>Rename</span>
                <MdDriveFileRenameOutline className="text-gray-450 text-sm" />
              </div>

              <div
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-755"
                onClick={() => {
                  handlefavorite(favorites ? 1 : 0);
                  setoptionmenu(false);
                }}
              >
                <span className="truncate pr-1">
                  {favorites ? "Unfavorite" : "Favorite"}
                </span>
                <FaRegHeart className={`text-sm ${favorites ? "text-amber-500 fill-amber-500" : "text-gray-450"}`} />
              </div>

              <div
                className="w-full h-8 flex items-center justify-between px-3 rounded-lg transition-colors hover:bg-gray-50 text-gray-755"
                onClick={() => {
                  setsharemenu(true);
                  setoptionmenu(false);
                }}
              >
                <span>Share</span>
                <IoShareSocialOutline className="text-gray-450 text-sm" />
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Rename Modal */}
        {rename && createPortal(
          <div
            className="rename card-portal fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => {
              setrename(false);
              setnewname(name);
            }}
          >
            <div
              className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-base shadow-sm">
                    ✏️
                  </div>
                  <h1 className="font-bold text-sm text-gray-800">Rename File</h1>
                </div>
                <button
                  className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                  onClick={() => {
                    setrename(false);
                    setnewname(name);
                  }}
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
                <div className="text-[10px] font-semibold text-gray-450 flex items-center gap-1">
                  <span>Current:</span>
                  <span className="font-bold text-gray-700 truncate max-w-[240px]" title={name}>{name}</span>
                </div>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 border border-gray-250 focus:ring-[#4A4D4A]/10 rounded-xl outline-none text-xs font-semibold text-gray-700 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#4A4D4A] focus:ring-[3.5px] transition-all"
                  value={newname}
                  onChange={(e) => {
                    setnewname(e.target.value);
                  }}
                  autoFocus
                />
                <p className="text-[10px] text-gray-400 font-semibold">
                  Avoid using special characters like / \ : * ? " &lt; &gt; |
                </p>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                  onClick={() => {
                    setrename(false);
                    setnewname(name);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="text-xs px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
                  onClick={() => {
                    handlerename();
                  }}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Move to Trash Modal */}
        {deletemenu && createPortal(
          <div
            className="deletemenu card-portal fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => {
              setdeletemenu(false);
            }}
          >
            <div
              className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 text-base shadow-sm">
                    ⚠️
                  </div>
                  <h1 className="font-bold text-sm text-gray-800">Move To Trash</h1>
                </div>
                <button
                  className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                  onClick={() => {
                    setdeletemenu(false);
                  }}
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

              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Are you sure you want to move this file to the trash?
                </p>
                <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-lg text-xs font-bold text-gray-700 truncate max-w-full">
                  {name}
                </div>
                <p className="text-[10.5px] font-semibold text-gray-400">
                  You will still be able to restore it from your Trash container within 30 days.
                </p>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                  onClick={() => {
                    setdeletemenu(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="text-xs px-5 py-2 bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
                  onClick={() => {
                    handledelete(id);
                  }}
                >
                  Move to Trash
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Share Modal (Share Card) */}
        {sharemenu && createPortal(
          <div
            className="sharemenu card-portal fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => {
              setsharemenu(false);
            }}
          >
            <div
              className="w-full max-w-[400px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500 shadow-sm text-base">
                    🔗
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-sm text-gray-800">Share File</h1>
                    <p className="text-[10px] text-gray-400 font-semibold truncate max-w-[200px]" title={name}>
                      {name}
                    </p>
                  </div>
                </div>
                <button
                  className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                  onClick={() => {
                    setsharemenu(false);
                  }}
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

              {/* Tab Pills */}
              <div className="w-full h-9 bg-gray-100 p-0.5 flex gap-1 rounded-xl shrink-0 mt-1 select-none">
                <button
                  className={`flex-1 h-full rounded-lg flex items-center justify-center text-[11px] font-bold transition-all border-none ${sharetype === "link"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "bg-transparent text-gray-450 hover:text-gray-700"
                    }`}
                  onClick={() => {
                    setsharetype("link");
                  }}
                >
                  Share Link
                </button>
                <button
                  className={`flex-1 h-full rounded-lg flex items-center justify-center text-[11px] font-bold transition-all border-none ${sharetype === "email"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "bg-transparent text-gray-455 hover:text-gray-700"
                    }`}
                  onClick={() => {
                    setsharetype("email");
                  }}
                >
                  Share with People
                </button>
              </div>

              {/* Share Content */}
              {sharetype === "link" ? (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="w-full bg-blue-50/40 border border-blue-100/70 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base shadow-sm">
                        🔗
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-blue-900 leading-none mb-0.5">Public Link</span>
                        <p className="text-[10px] text-blue-600 font-semibold">
                          Enable anyone to view/download this file.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`linkcheck-${id}`}
                        className="hidden"
                        checked={enabled}
                        onChange={async (e) => {
                          const value = e.target.checked;
                          setEnabled(value);

                          try {
                            const res = await fetch(`${url}file/share/${id}`, {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                              body: JSON.stringify({ enable: value }),
                            });

                            const data = await res.json();

                            if (value) {
                              setShareLink(data.link);
                            } else {
                              setShareLink("");
                            }
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                      />

                      <label
                        htmlFor={`linkcheck-${id}`}
                        className={`w-10 h-5 flex items-center px-0.5 rounded-full cursor-pointer transition-colors ${enabled ? "bg-blue-500" : "bg-gray-300"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${enabled ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                      </label>
                    </div>
                  </div>

                  {enabled && (
                    <div className="w-full flex flex-col gap-2 animate-slide-up">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider pl-0.5">
                        Shareable Link
                      </label>
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-250 bg-gray-50/50 rounded-xl text-xs font-semibold outline-none text-gray-700 truncate"
                          readOnly
                          value={shareLink}
                        />
                        <button
                          className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow shrink-0 active:scale-[0.98]"
                          onClick={() => {
                            navigator.clipboard.writeText(shareLink);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      className="text-xs px-5 h-9 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl font-bold shadow-sm"
                      onClick={() => {
                        setsharemenu(false);
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2 text-left">
                  {/* Share form */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider pl-0.5 animate-fade-in">
                      Share with email
                    </label>
                    <div className="flex gap-2 w-full">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        className="flex-1 px-3 py-2 border border-gray-250 bg-gray-50/50 rounded-xl text-xs font-semibold outline-none text-gray-700 focus:border-blue-400 focus:bg-white transition-colors"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          setShareError("");
                          setShareSuccess("");
                        }}
                      />
                      <select
                        className="px-2 border border-gray-250 bg-gray-50/50 rounded-xl text-xs font-bold outline-none text-gray-700 cursor-pointer"
                        value={permissionInput}
                        onChange={(e) => setPermissionInput(e.target.value)}
                      >
                        <option value="view">Can View</option>
                        <option value="edit">Can Edit</option>
                      </select>
                      <button
                        className="px-4 bg-[#4A4D4A] hover:bg-[#2E302E] text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow shrink-0 active:scale-[0.98]"
                        onClick={async () => {
                          if (!emailInput.trim()) {
                            setShareError("Please enter an email address");
                            return;
                          }
                          try {
                            const res = await fetch(`${url}file/share-email/${id}`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              credentials: "include",
                              body: JSON.stringify({
                                email: emailInput,
                                permission: permissionInput
                              })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setSharedWithList(data.sharedWith || []);
                              setShareSuccess(`Shared with ${emailInput}`);
                              setEmailInput("");
                            } else {
                              setShareError(data || "Failed to share file");
                            }
                          } catch (err) {
                            console.error(err);
                            setShareError("Server error. Please try again.");
                          }
                        }}
                      >
                        Share
                      </button>
                    </div>
                    {shareError && <p className="text-[10px] text-red-500 font-bold pl-0.5 mt-0.5 animate-slide-up">{shareError}</p>}
                    {shareSuccess && <p className="text-[10px] text-emerald-600 font-bold pl-0.5 mt-0.5 animate-slide-up">{shareSuccess}</p>}
                  </div>

                  {/* List of shared users */}
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider pl-0.5">
                      People with access
                    </label>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 pr-1 divide-y divide-gray-100">
                      {sharedWithList.length === 0 ? (
                        <div className="text-[10.5px] text-gray-400 font-semibold italic pl-0.5 py-1">
                          Not shared with anyone yet
                        </div>
                      ) : (
                        sharedWithList.map((item) => (
                          <div key={item.email} className="flex items-center justify-between py-2 pl-0.5 first:pt-1">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-700 leading-none mb-0.5">{item.email}</span>
                              <span className="text-[9px] text-gray-400 font-semibold capitalize">{item.permission}er</span>
                            </div>
                            <button
                              className="text-[9.5px] text-red-500 hover:text-red-700 font-bold bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-red-50/50 transition-colors"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`${url}file/share-email/${id}`, {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    credentials: "include",
                                    body: JSON.stringify({ email: item.email })
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setSharedWithList(data.sharedWith || []);
                                    setShareSuccess("Access revoked successfully");
                                    setShareError("");
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-2 border-t border-gray-100">
                    <button
                      className="text-xs px-5 h-9 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl font-bold shadow-sm"
                      onClick={() => {
                        setsharemenu(false);
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
};

export default Filecard;

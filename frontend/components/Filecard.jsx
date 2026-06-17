import React, { useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiMenuBurger } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import { IoOpenOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { Link } from "react-router";

const Filecard = ({
  name,
  id,
  getdata,
  ext,
  modifed,
  size,
  favorites,
  active,
}) => {
  const url = "http://localhost:3000/";
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

  function handleopen(name) {
    window.location.href = `http://localhost:3000/file/${id}${ext}?name=${name}`;
  }
  const fileIcons = {
    // Images
    ".jpg": <img src="/img-banner.png"></img>,
    ".jpeg": <img src="/img-banner.png"></img>,
    ".png": <img src="/img-banner.png"></img>,
    ".gif": <img src="/img-banner.png"></img>,
    ".webp": <img src="/img-banner.png"></img>,
    ".svg": <img src="/img-banner.png"></img>,
    ".avif": <img src="/img-banner.png"></img>,

    // Documents
    ".pdf": <img src="/pdf-banner.png"></img>,
    ".doc": <img src="/doc-banner.png"></img>,
    ".docx": <img src="/doc-banner.png"></img>,
    ".txt": <img src="/txt-banner.png"></img>,
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
    ".mp3": <img src="/audio-banner.png"></img>,
    ".wav": <img src="/audio-banner.png"></img>,
    ".aac": <img src="/audio-banner.png"></img>,
    ".ogg": <img src="/audio-banner.png"></img>,

    // Archives
    ".zip": "🗜️",
    ".rar": "🗜️",
    ".7z": "🗜️",
    ".tar": "🗜️",
    ".gz": "🗜️",

    // Code files
    ".js": <img src="/code-banner.png"></img>,
    ".jsx": <img src="/code-banner.png"></img>,
    ".ts": <img src="/code-banner.png"></img>,
    ".html": <img src="/code-banner.png"></img>,
    ".css": <img src="/code-banner.png"></img>,
    ".json": <img src="/code-banner.png"></img>,
    ".py": <img src="/code-banner.png"></img>,
    ".java": <img src="/code-banner.png"></img>,

    // Default
    default: "📁",
  };
  function formatSize(size) {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
  async function handledelete(fileid, value) {
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
  async function handlerename(value) {
    const res = await fetch(`${url}file/${id}`, {
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
    const response = await fetch(`${url}file/favorite`, {
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
    if (active == "Favorites") {
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

  return (
    <>
      <div className="group ">
        <div
          className="filecard w-full relative border-t border-[#c6c6c6] h-[5vh] bg-white flex items-center text-[12.5px] group-hover:bg-[#EBEAEA]      select-none transition-colors"
          onDoubleClick={() => {
            handleopen(name);
          }}
        >
          <div className="  w-[36%] h-full flex items-center p-2  gap-2">
            <div className="w-7 h-7  flex items-center justify-center rounded">
              {fileIcons[ext]}
            </div>
            <div className=" w-56 h-5  overflow-hidden text-ellipsis">
              {name}
            </div>

            <div className="ml-1">{favorites ? "⭐" : ""}</div>
          </div>
          <div className=" w-[20%] h-full flex items-center p-2 opacity-80 ">
            <p>{timeAgo(modifed)}</p>
          </div>
          <div className=" w-[20%] h-full flex items-center p-2 gap-2 opacity-80">
            <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <CiUser />
            </div>
            yogesh
          </div>
          <div className=" w-[10%] h-full flex items-center p-2 opacity-80">
            {ext}
          </div>
          <div className=" w-[10%] h-full flex items-center p-2 opacity-80">
            <p>{formatSize(size)}</p>
          </div>
          <div
            className="option cursor-pointer "
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              setoptionmenu(true);
              setx(e.clientX - 190 + "px");
              sety(e.clientY - 180 + "px");
            }}
          >
            <CiMenuBurger />
          </div>
        </div>
        <div
          className={`w-screen h-screen ${optionmenu ? "block" : "hidden"}  absolute top-0 left-0 z-50`}
          onClick={() => {
            setoptionmenu(false);
          }}
        >
          <div
            className={`menuoption w-[12vw] h-[25vh] p-2 bg-white text-[12px] border border-[#c6c6c6] z-50 absolute  shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col rounded overflow-hidden cursor-pointer text-[#030303]`}
            style={{
              left: x,
              top: y,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="w-full h-[20%] flex items-center justify-between pl-3 pr-3 border-b border-[#e0dcdc] text-[red] transition-colors hover:bg-[#f3dede]  "
              onClick={(e) => {
                setdeletemenu(true);
              }}
            >
              Delete
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <div className="w-full h-[20%] flex items-center justify-between pl-3 pr-3 border-b border-[#e0dcdc] transition-colors hover:bg-[#EBEAEA] hover:text-black  ">
              <Link
                className="flex  items-center justify-between w-full"
                to={`${url}file/${id}${ext}?action=download&name=${name}`}
              >
                Download
                <BsDownload />
              </Link>
            </div>
            <div
              className="w-full h-[20%] flex items-center justify-between pl-3 pr-3 border-b border-[#e0dcdc] transition-colors hover:bg-[#EBEAEA] hover:text-black  "
              onClick={() => {
                handleopen(name);
              }}
            >
              Open
              <IoOpenOutline />
            </div>
            <div
              className="w-full h-[20%] flex items-center justify-between pl-3 pr-3 border-b border-[#e0dcdc] transition-colors hover:bg-[#EBEAEA] hover:text-black  "
              onClick={() => {
                setrename(true);
              }}
            >
              Rename
              <MdDriveFileRenameOutline />
            </div>
            <div
              className="w-full h-[20%] flex items-center justify-between pl-3 pr-3 border-b border-[#e0dcdc] transition-colors hover:bg-[#EBEAEA] hover:text-black  "
              onClick={() => {
                handlefavorite(favorites ? 1 : 0);
              }}
            >
              {favorites ? "Remove From Favourite" : "Add to favourite"}

              <FaRegHeart />
            </div>
            <div
              className="w-full h-[20%] flex items-center justify-between pl-3 pr-3  transition-colors hover:bg-[#EBEAEA] hover:text-black  "
              onClick={() => {
                setsharemenu(true);
              }}
            >
              Share
              <IoShareSocialOutline />
            </div>
          </div>
        </div>
        <div
          className={`rename w-screen h-screen bg-[#46454654] backdrop-blur-[2px] absolute top-0 left-0 z-50 ${rename ? "flex" : "hidden"}  items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}
          onClick={() => {
            setrename(false);
            setnewname(name);
          }}
        >
          <div
            className="w-[30vw] h-[40vh] bg-white rounded-2xl p-5"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="w-full h-[20%] text-2xl flex items-center">
              <h1>Rename</h1>
            </div>
            <div className="w-full h-[60%] flex flex-col justify-between p-3 text-[13px]">
              <p className="text-[#7e7e7e]">Rename This item.</p>
              <div className="w-[23vw] h-6   flex items-center gap-2 text-[#7e7e7e]">
                {fileIcons[ext]}
                <div className="w-[23vw] overflow-hidden text-ellipsis">
                  {name}
                </div>
              </div>
              <input
                type="text"
                className="w-full h-14 border-2 rounded-xl focus:outline-none border-[#E0E0E0] p-4 text-xl"
                value={newname}
                onChange={(e) => {
                  setnewname(e.target.value);
                }}
              />
              <p className="text-sm text-[#7e7e7e]">
                Avoid using special characters.
              </p>
            </div>
            <div className="btn w-full h-[20%]  pl-60 flex items-center gap-5">
              <button
                className="w-26 h-[70%] bg-[#c7c4c4] text-black rounded  shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                onClick={() => {
                  setrename(false);
                  setnewname(name);
                }}
              >
                Cancel
              </button>
              <button
                className="w-26 h-[70%] bg-[#444442] text-white rounded  cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                onClick={() => {
                  handlerename();
                }}
              >
                Rename
              </button>
            </div>
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
              <h1 className="font-bold">Move To Trash</h1>
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
              Are you sure you want to move{" "}
              <span className="font-bold text-[15px] max-w-46 h-5 text-ellipsis  inline-block  overflow-hidden  ">
                {" "}
                "{name}"
              </span>{" "}
              to trash? You can restore it within 30 days.
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
                className="text-[12px] w-32 h-10 border border-[#e6a5a5]  bg-rose-50  hover:bg-rose-100 transition-colors flex items-center justify-center text-[red] rounded-xl cursor-pointer font-semibold gap-2"
                onClick={(e) => {
                  handledelete(id);
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
                Move To Trash
              </div>
            </div>
          </div>
        </div>
        <div
          className={`sharemenu w-screen h-screen z-100 bg-[#1010104e] backdrop-blur-[2px] absolute top-0 left-0 ${sharemenu ? "flex" : "hidden"} items-center justify-center`}
          onClick={() => {
            setsharemenu(false);
          }}
        >
          <div
            className="w-[40vw]  bg-white rounded-xl p-5 border border-[#c0bdbd] "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between  h-16 border-[#a4a3a3] ">
              <div className="flex items-center gap-2 h-full w-96">
                <div className="w-11 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </div>
                <div className="  w-full h-full flex flex-col p-2 ">
                  <h1 className="font-bold text-[18px] ">Share file</h1>
                  <div className="  w-full h-10 flex items-center  gap-2 ">
                    <div className="w-4 h-4  flex items-center justify-center rounded">
                      {fileIcons[ext]}
                    </div>
                    <div className=" w-56 h-7 flex items-center overflow-hidden text-ellipsis text-[10px]">
                      {name}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-9 h-9 bg-[#dbdada] rounded-xl flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setsharemenu(false);
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
            <div className="option w-full h-12 bg-[#e5e5e6] mt-3 p-1 flex gap-1 rounded">
              <div
                className={`sharelink w-[50%] h-full ${sharetype == "link" ? "bg-[#FFFFFF]" : "bg-[#e5e5e6]"} rounded  flex items-center justify-center text-[13px] cursor-pointer transition-colors`}
                onClick={() => {
                  setsharetype("link");
                }}
              >
                <h1>Share Link</h1>
              </div>
              <div
                className={`sharewithepeople w-[50%] h-full ${sharetype == "email" ? "bg-[#FFFFFF]" : "bg-[#e5e5e6]"} rounded flex items-center justify-center text-[13px] cursor-pointer transition-colors`}
                onClick={() => {
                  setsharetype("email");
                }}
              >
                <h1>Share with People</h1>
              </div>
            </div>
            {sharetype == "link" ? (
              <>
                <div className="link w-full h-22 mt-6  rounded-xl bg-[#EFF6FF] flex items-center justify-between">
                  <div className="w-96 h-full  flex items-center gap-3 p-2">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div className="text-[16px]">
                      <h1>Share via Public Link</h1>
                    </div>
                  </div>
                  <div className="w-24 h-full flex items-center justify-center">
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
                            setShareLink(data.link); // 🔥 store link
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
                      className={`w-12 h-6 flex items-center px-1 rounded-full cursor-pointer transition-colors
          ${enabled ? "bg-blue-500" : "bg-gray-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform
            ${enabled ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </label>
                  </div>
                </div>
                {enabled && (
                  <div className="w-full mt-6">
                    <h1 className="text-[13px]">Shareable Link</h1>
                    <div className="w-full h-12  flex justify-between">
                      <div className="w-[80%] h-full border-[#a4a3a3] border  rounded-sm cursor-pointer">
                        <input
                          type="text"
                          className="w-full h-full outline-none p-2 text-[]"
                          readOnly
                          value={shareLink}
                        ></input>
                      </div>
                      <div
                        className="w-[19%] h-full bg-[#2563EB] text-white cursor-pointer rounded-sm flex items-center justify-center"
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink);
                        }}
                      >
                        <h1>Copy Link</h1>
                      </div>
                    </div>
                    <div className="btn w-full h-16  mt-6 flex items-center justify-center">
                      <button
                        className="w-[40%] h-[80%] bg-[#5083ef] hover:bg-[#2563EB] text-white rounded-full cursor-pointer transition-colors"
                        onClick={() => {
                          setsharemenu(false);
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className=""></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Filecard;



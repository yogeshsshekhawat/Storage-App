import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CiMenuBurger } from "react-icons/ci";
import { Link, useNavigate } from "react-router";
import { MdOutlineDelete } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import { IoOpenOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const Foldercard = ({
  name,
  id,
  folderrename,
  setoldfoldername,
  setfolderid,
  getdata,
  compact = false,
}) => {
  const navigate = useNavigate();
  const url = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "") + "/";
  const [optionmenu, setoptionmenu] = useState(false);
  const [deletemenu, setdeletemenu] = useState(false);
  const [rename, setrename] = useState(false);
  const [newfoldername, setnewfoldername] = useState(name);
  const [x, setx] = useState();
  const [y, sety] = useState();

  async function handledelete() {
    console.log(id);
    const res = await fetch(`${url}directory/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (getdata) getdata();
    console.log(data);
  }

  async function handleinternaldelete() {
    const res = await fetch(`${url}directory/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    setdeletemenu(false);
    if (getdata) getdata();
  }

  async function handleinternalrename() {
    const res = await fetch(`${url}directory/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newfoldername: newfoldername,
      }),
    });
    setrename(false);
    if (getdata) getdata();
  }

  const handleFolderClick = () => {
    localStorage.setItem("activeTab", "My Files");
    window.location.href = `/directory/${id}`;
  };

  return (
    <>
      {compact ? (
        <div className="group">
          <div
            className="filecard w-full relative border-t border-[#c6c6c6] h-[5vh] bg-white flex items-center text-[12.5px] group-hover:bg-[#EBEAEA] select-none transition-colors justify-between px-3 cursor-pointer"
            onClick={handleFolderClick}
          >
            <div className="flex items-center gap-2 max-w-[85%]">
              <div className="w-7 h-7 flex items-center justify-center rounded text-[16px]">
                📁
              </div>
              <div className="truncate font-medium text-[13px] text-gray-700 w-44">
                {name}
              </div>
            </div>
            <div
              className="option cursor-pointer p-1 rounded hover:bg-gray-200 transition-colors"
              onDoubleClick={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setoptionmenu(!optionmenu);
                setx(e.clientX - 120 + "px");
                sety(e.clientY + 10 + "px");
              }}
            >
              <CiMenuBurger />
            </div>
          </div>
          {optionmenu && createPortal(
            <div
              className="w-screen h-screen fixed top-0 left-0 z-50 card-portal"
              onClick={() => {
                setoptionmenu(false);
              }}
            >
              <div
                className="menuoption w-[130px] bg-white text-gray-700 border border-gray-100 z-50 absolute shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col rounded-lg py-1 cursor-pointer"
                style={{
                  left: x,
                  top: y,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="w-full h-8 px-3 flex items-center justify-between transition-colors hover:bg-rose-50 hover:text-rose-600 text-[12px] font-medium"
                  onClick={() => {
                    setdeletemenu(true);
                    setoptionmenu(false);
                  }}
                >
                  Delete
                  <MdOutlineDelete />
                </div>
                <div
                  className="w-full h-8 px-3 flex items-center justify-between transition-colors hover:bg-gray-50 hover:text-gray-900 text-[12px] font-medium"
                  onClick={() => {
                    setrename(true);
                    setoptionmenu(false);
                  }}
                >
                  Rename
                  <MdDriveFileRenameOutline />
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Rename Modal */}
          {rename && createPortal(
            <div
              className="rename card-portal w-screen h-screen bg-[#46454654] backdrop-blur-[2px] fixed top-0 left-0 z-50 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              onClick={() => {
                setrename(false);
                setnewfoldername(name);
              }}
            >
              <div
                className="w-[30vw] h-[40vh] bg-white rounded-2xl p-5"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="w-full h-[20%] text-2xl flex items-center">
                  <h1>Rename Folder</h1>
                </div>
                <div className="w-full h-[60%] flex flex-col justify-between p-3 text-[13px]">
                  <p className="text-[#7e7e7e]">Rename this folder.</p>
                  <input
                    type="text"
                    className="w-full h-14 border-2 rounded-xl focus:outline-none border-[#E0E0E0] p-4 text-xl"
                    value={newfoldername}
                    onChange={(e) => {
                      setnewfoldername(e.target.value);
                    }}
                  />
                </div>
                <div className="btn w-full h-[20%] pl-60 flex items-center gap-5">
                  <button
                    className="w-26 h-[70%] bg-[#c7c4c4] text-black rounded cursor-pointer"
                    onClick={() => {
                      setrename(false);
                      setnewfoldername(name);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-26 h-[70%] bg-[#444442] text-white rounded cursor-pointer"
                    onClick={handleinternalrename}
                  >
                    Rename
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Delete Modal */}
          {deletemenu && createPortal(
            <div
              className="deletemenu card-portal w-screen h-screen z-100 bg-[#1010104e] backdrop-blur-[2px] fixed top-0 left-0 flex items-center justify-center"
              onClick={() => {
                setdeletemenu(false);
              }}
            >
              <div
                className="w-[30vw] h-50 bg-white rounded-xl p-5 border border-[#c0bdbd]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-bold">Delete Folder</h1>
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
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[13px] mt-4">
                  Are you sure you want to delete folder <span className="font-bold">"{name}"</span>? This will permanently delete the folder.
                </p>
                <div className="w-full h-16 flex items-center justify-end gap-4">
                  <div
                    className="text-[12px] w-16 h-10 border border-[#c0bdbd] hover:bg-[#bebdbd] transition-colors font-semibold flex items-center justify-center rounded-xl cursor-pointer"
                    onClick={() => {
                      setdeletemenu(false);
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className="text-[12px] w-32 h-10 border border-[#e6a5a5] bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center text-[red] rounded-xl cursor-pointer font-semibold gap-2"
                    onClick={handleinternaldelete}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      ) : (
        <div
          className="group w-44 h-40 bg-white rounded-2xl flex items-center justify-between flex-col cursor-pointer relative p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-out select-none shrink-0"
          onDoubleClick={() => {
            window.location.href = `/directory/${id}`;
          }}
        >
          {/* Glowing Folder SVG & Name */}
          <div className="flex-1 flex flex-col items-center justify-center w-full mt-1">
            <svg
              viewBox="0 0 64 64"
              className="w-24 h-24 transition-transform duration-300 group-hover:scale-105 shrink-0"
            >
              <defs>
                <linearGradient id="folderBack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#3B82F6" />
                  <stop offset="100%" stop-color="#1D4ED8" />
                </linearGradient>
                <linearGradient id="folderFront" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#60A5FA" />
                  <stop offset="100%" stop-color="#2563EB" />
                </linearGradient>
                <filter id="folderGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2563EB" flood-opacity="0.12" />
                </filter>
              </defs>
              {/* Back Panel */}
              <path
                d="M4 12C4 9.79086 5.79086 8 8 8H20.6834C21.8483 8 22.9547 8.50428 23.7126 9.38851L27.6709 14H56C58.2091 14 60 15.7909 60 18V50C60 52.2091 58.2091 54 56 54H8C5.79086 54 4 52.2091 4 50V12Z"
                fill="url(#folderBack)"
              />
              {/* Inner Page detail popping out slightly */}
              <path
                d="M14 13H50V26H14V13Z"
                fill="#FFFFFF"
                opacity="0.9"
              />
              <rect x="18" y="16" width="28" height="1.8" rx="0.9" fill="#93C5FD" />
              <rect x="18" y="20" width="16" height="1.8" rx="0.9" fill="#93C5FD" />
              {/* Front Panel */}
              <path
                d="M4 22C4 19.7909 5.79086 18 8 18H56C58.2091 18 60 19.7909 60 22V50C60 52.2091 58.2091 54 56 54H8C5.79086 54 4 52.2091 4 50V22Z"
                fill="url(#folderFront)"
                filter="url(#folderGlow)"
              />
            </svg>
            
            <div className="w-full text-center mt-2.5 shrink-0">
              <p className="text-[12px] font-bold text-gray-700 truncate px-1" title={name}>
                {name}
              </p>
            </div>
          </div>

          {/* Option Menu Button (Fades in on hover) */}
          <div
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 active:bg-gray-200 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setoptionmenu(optionmenu ? false : true);
            }}
          >
            {optionmenu ? <IoMdClose className="text-base" /> : <CiMenuBurger className="text-sm stroke-[0.8]" />}
          </div>
          <div
            className={`w-[120px] bg-white text-gray-700 border border-gray-150 absolute right-2.5 top-9.5 ${optionmenu ? "block" : "hidden"} rounded-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] z-50 flex flex-col p-1 gap-0.5`}
          >
            <div
              className="w-full h-8 px-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-rose-50 hover:text-rose-600 text-[11px] font-bold rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                handledelete();
                setoptionmenu(false);
              }}
            >
              <span>Delete</span>
              <MdOutlineDelete className="text-rose-500 text-sm" />
            </div>
            <div
              className="w-full h-8 px-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 hover:text-gray-900 text-[11px] font-bold rounded-lg text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                folderrename(true);
                setoldfoldername(name);
                setfolderid(id);
                setoptionmenu(false);
              }}
            >
              <span>Rename</span>
              <MdDriveFileRenameOutline className="text-gray-400 text-sm" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Foldercard;

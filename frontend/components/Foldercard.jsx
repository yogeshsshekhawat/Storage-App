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
            className="filecard w-full relative border-b-2 border-gray-900 h-12 bg-white flex items-center text-[12.5px] hover:bg-gray-50 select-none transition-colors justify-between px-3 cursor-pointer"
            onClick={handleFolderClick}
          >
            <div className="flex items-center gap-2 max-w-[85%]">
              <div className="w-7 h-7 flex items-center justify-center rounded text-[16px]">
                📁
              </div>
              <div className="truncate font-black text-[13px] text-gray-900 w-44">
                {name}
              </div>
            </div>
            <div
              className="option cursor-pointer p-1.5 rounded-lg border-2 border-gray-900 bg-white hover:bg-gray-150 transition-colors text-gray-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px]"
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
              <CiMenuBurger className="stroke-[2.5]" />
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
                className="menuoption w-[130px] bg-white text-gray-900 border-2 border-gray-900 z-50 absolute shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col rounded-xl py-1 cursor-pointer font-bold text-xs"
                style={{
                  left: x,
                  top: y,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  className="w-full h-8 px-3 flex items-center justify-between transition-colors hover:bg-rose-50 hover:text-rose-600 font-extrabold"
                  onClick={() => {
                    setdeletemenu(true);
                    setoptionmenu(false);
                  }}
                >
                  Delete
                  <MdOutlineDelete className="text-rose-600" />
                </div>
                <div
                  className="w-full h-8 px-3 flex items-center justify-between transition-colors hover:bg-gray-50 hover:text-gray-900 font-extrabold"
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
                className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="w-full text-base font-black text-gray-900 uppercase">
                  <h1>Rename Folder</h1>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 font-bold">Rename this folder.</p>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-900 rounded-xl text-xs font-bold outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all"
                    value={newfoldername}
                    onChange={(e) => {
                      setnewfoldername(e.target.value);
                    }}
                  />
                </div>
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    className="px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    onClick={() => {
                      setrename(false);
                      setnewfoldername(name);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] border-2 border-gray-900 transition-all rounded-xl flex items-center justify-center gap-2 text-gray-900 font-extrabold text-xs cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
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
                className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-black text-gray-900 uppercase text-sm">Delete Folder</h1>
                  <div
                    className="w-7 h-7 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-900 font-bold"
                    onClick={() => {
                      setdeletemenu(false);
                    }}
                  >
                    ✕
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-600 mt-2">
                  Are you sure you want to delete folder <span className="font-black text-gray-900">"{name}"</span>? This will permanently delete the folder.
                </p>
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    className="px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    onClick={() => {
                      setdeletemenu(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-700 transition-all rounded-xl flex items-center justify-center font-extrabold text-xs cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    onClick={handleinternaldelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      ) : (
        <div
          className="group w-44 h-40 bg-white border-2 border-gray-900 rounded-2xl flex items-center justify-between flex-col cursor-pointer relative p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 ease-out select-none shrink-0"
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
              {/* Back Panel */}
              <path
                d="M4 12C4 9.79086 5.79086 8 8 8H20.6834C21.8483 8 22.9547 8.50428 23.7126 9.38851L27.6709 14H56C58.2091 14 60 15.7909 60 18V50C60 52.2091 58.2091 54 56 54H8C5.79086 54 4 52.2091 4 50V12Z"
                fill="#2B7FFF"
                stroke="#000000"
                strokeWidth="2.5"
              />
              {/* Inner Page detail popping out slightly */}
              <path
                d="M14 13H50V26H14V13Z"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="2.5"
              />
              {/* Front Panel */}
              <path
                d="M4 22C4 19.7909 5.79086 18 8 18H56C58.2091 18 60 19.7909 60 22V50C60 52.2091 58.2091 54 56 54H8C5.79086 54 4 52.2091 4 50V22Z"
                fill="#85B5FF"
                stroke="#000000"
                strokeWidth="2.5"
              />
            </svg>
            
            <div className="w-full text-center mt-2.5 shrink-0">
              <p className="text-[12px] font-black text-gray-900 truncate px-1 uppercase" title={name}>
                {name}
              </p>
            </div>
          </div>

          {/* Option Menu Button (Fades in on hover) */}
          <div
            className="absolute top-2.5 right-2.5 w-7 h-7 border-2 border-gray-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] bg-white rounded-lg flex items-center justify-center text-gray-900 hover:bg-gray-150 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setoptionmenu(optionmenu ? false : true);
            }}
          >
            {optionmenu ? <IoMdClose className="text-base font-bold" /> : <CiMenuBurger className="text-xs stroke-[2]" />}
          </div>
          <div
            className={`w-[120px] bg-white text-gray-900 border-2 border-gray-900 absolute right-2.5 top-9.5 ${optionmenu ? "block" : "hidden"} rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)] z-50 flex flex-col p-1 gap-0.5`}
          >
            <div
              className="w-full h-8 px-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-rose-50 hover:text-rose-600 text-[11px] font-black rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                handledelete();
                setoptionmenu(false);
              }}
            >
              <span>Delete</span>
              <MdOutlineDelete className="text-rose-600 text-sm" />
            </div>
            <div
              className="w-full h-8 px-2.5 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-900 text-[11px] font-black rounded-lg text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                folderrename(true);
                setoldfoldername(name);
                setfolderid(id);
                setoptionmenu(false);
              }}
            >
              <span>Rename</span>
              <MdDriveFileRenameOutline className="text-gray-900 text-sm" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Foldercard;

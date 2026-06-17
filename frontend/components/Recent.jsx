import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import Foldercard from "./Foldercard";
import { FaFolder } from "react-icons/fa6";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { CiFileOn } from "react-icons/ci";

import { IoTrashBinOutline } from "react-icons/io5";

import { FaRegStar } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { IoImagesOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TfiAgenda } from "react-icons/tfi";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Filecard from "./Filecard";
import { Link, useParams } from "react-router";

const Recent = ({ url, data, getdata ,active,setActive}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [folderoptionmenu, setfolderoptionmenu] = useState(false);
  const [folderrename, setfolderrename] = useState(false);
  const [newfolder, setnewfolder] = useState(true);
  const [screen, setscreen] = useState(true);
  const [foldername, setfoldername] = useState("");
  const [oldfoldername, setoldfoldername] = useState();
  const [newfoldername, setnewfoldername] = useState(oldfoldername);
  const [folderid, setfolderid] = useState();
  const folders = data?.folder || [];
  const files = data?.files || [];
  const { dirId } = useParams();
  useEffect(() => {
    setnewfoldername(oldfoldername);
  }, [oldfoldername]);

  let enableSwipe = folders.length >= 5;
  async function handleupload(file) {
    const res = await fetch(`${url}file/${file.name}`, {
      method: "POST",
      body: file,
      credentials: "include",
      headers: { dirid: dirId || "root", size: file.size },
    });
    const data = await res.json();

    getdata();
  }
  async function handlecreate() {
    const res = await fetch(`${url}directory/${dirId || "root"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        foldername: foldername,
      }),
    });
    setfoldername("");
    getdata();
    setnewfolder(true);
  }

  useEffect(() => {
    if (folders.length === 0) {
      setscreen(false);
    } else {
      setscreen(true);
    }
  }, [folders]);

  async function handlefolderrename() {
    const res = await fetch(`${url}directory/${folderid}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newfoldername: newfoldername,
      }),
    });
    setfolderrename(false);
    getdata();
  }
  return (
    <div className="w-[85vw] h-[82.5vh]   flex bg-[#F9F9F9] ">
      <div className="right  w-full bg-[#FAFAFA] p-4">
        <h1 className="text-[15px] text-[#898a89] tracking-[1.6px] font-semibold  mb-6">
          Recent  files
        </h1>
        <div
          className={`file w-full h-[83vh] bg-[#FFFFFF] border border-[#c6c6c6] rounded-[7px]  overflow-hidden `}
        >
          <div className="heading w-full h-9 bg-[#EBEAEA] flex items-center ">
            <div className="  w-[34%] h-full flex items-center p-2  pl-7 opacity-70 text-[14px]">
              Name
            </div>
            <div className=" w-[20%] h-full flex items-center p-2 opacity-70 text-[14px] ">
               Modified
            </div>
            <div className=" w-[20%] h-full flex items-center p-2 pl-9 opacity-70 text-[14px] ">
              Owner
            </div>
            <div className=" w-[10%] h-full flex items-center  pl-4  opacity-70 text-[14px] ">
              Type
            </div>
            <div className=" w-[10%] h-full flex items-center justify-center opacity-70 text-[14px]  ">
              Size
            </div>
          </div>
          {files.length == 0 ? (
             <div
                className={`w-full h-full text-[2vw] text-[#7e7e7e] flex items-center flex-col justify-center gap-5 pb-15`}
              >
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <img
                    src="/empty-box.png"
                    className="w-28 h-28 mb-4 opacity-70"
                  />

                  <h2 className="text-lg font-semibold">No recent activity</h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Files you open or edit will appear here.
                  </p>

                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white text-[14px] rounded-lg cursor-pointer"
                    onClick={() => {
                      setActive("My Files");
                      getdata();
                    }}
                  >
                    Open Files
                  </button>
                </div>
              </div>
          ) : (
            <div className="data w-full h-[93%]  border-t border-[#c6c6c6] hide-scrollbar">
              {files
                
                .map((el) => (
                  <Filecard
                    name={el.name}
                    id={el._id}
                    key={el._id}
                    getdata={getdata}
                    ext={el.ext}
                    modifed={el.updatedAt}
                    size={el.size}
                    favorites={el.favorites}
                    active={active}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`createfolder z-10 w-screen h-screen bg-[#47474748] absolute top-0 ${newfolder ? "hidden" : "block"} flex items-center justify-center`}
        onClick={() => {
          setnewfolder(true);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlecreate();
          }}
        >
          <div
            className="w-[34vw] h-[50vh] p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl flex flex-col gap-4"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Button clicked");
            }}
          >
            <h1 className="text-2xl text-[#474747]">Create New Folder</h1>
            <div className="inputs w-full h-46  text-[#474747] flex flex-col gap-4">
              <div className="">
                <label htmlFor="folderinput">
                  <h1 className="text-xl ">Folder Name</h1>
                </label>

                <div className="input w-full h-12 border-[#696969] rounded-xl flex overflow-hidden border-3">
                  <div className="w-[10%] h-full bg-[#E9EAE7]  border-[#696969] text-xl flex items-center justify-center border-r-3">
                    <FaFolder />
                  </div>
                  <input
                    type="text"
                    id="folderinput"
                    className="p-4 text-xl focus:outline-none w-[90%] h-full  "
                    placeholder="e.g., Q3 Marketing Assets"
                    value={foldername}
                    onChange={(e) => {
                      setfoldername(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="">
                <label htmlFor="folderlocation" className="mt-5">
                  <h1 className="text-xl ">Location</h1>
                </label>
                <div className="input w-full h-12 border-[#696969] rounded-xl flex overflow-hidden border-3">
                  <div className="w-[10%] h-full bg-[#E9EAE7]  border-[#696969] text-xl flex items-center justify-center border-r-3">
                    <img
                      src="/subfolder.png"
                      className="w-[80%] opacity-80"
                    ></img>
                  </div>
                  <select className="w-[90%] h-full focus:outline-none rounded-full text-xl ">
                    <option value="root">Root Folder</option>
                    <option value="folder1">Folder One</option>
                    <option value="folder2">Folder Two</option>
                    <option value="folder3">Folder Three</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="btns flex gap-10 justify-center mt-5">
              <div
                className=" flex items-center justify-center w-26 h-12  rounded-xl cursor-pointer text-xl text-[#7e7e7e] bg-[#cfcfcd] shadow-[0_8px_30px_rgb(0,0,0,0.12)] "
                onClick={() => {
                  setnewfolder(true);
                  setfoldername(" ");
                }}
              >
                Cancel
              </div>
              <button
                type="submit"
                className="w-26 h-12  rounded-xl cursor-pointer text-xl text-white bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
      <div
        className={`w-screen h-screen  ${folderrename ? "block" : "hidden"} absolute bg-[#46454654] top-0 left-0 z-50`}
        onClick={() => {
          setfolderrename(false);
          setnewfoldername(oldfoldername);
        }}
      >
        <div
          className={`rename w-screen h-screen bg-[#46454654] absolute top-0 left-0 z-50 ${folderrename ? "flex" : "hidden"}  items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}
          onClick={() => {
            // setrename(false)
            // setnewname(name)
          }}
        >
          <div
            className="w-[34vw] h-[50vh] bg-white rounded-2xl p-5"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="w-full h-[20%] text-4xl flex items-center">
              <h1>Rename</h1>
            </div>
            <div className="w-full h-[60%] flex flex-col justify-between p-3">
              <p className="text-[#7e7e7e]">Rename This item.</p>
              <div className="w-full  flex items-center gap-2 text-[#7e7e7e]">
                <CiFileOn />
                {oldfoldername}
              </div>
              <input
                type="text"
                className="w-full h-14 border-2 rounded-xl focus:outline-none border-[#E0E0E0] p-4 text-xl"
                value={newfoldername}
                onChange={(e) => {
                  setnewfoldername(e.target.value);
                }}
              />
              <p className="text-sm text-[#7e7e7e]">
                Avoid using special characters.
              </p>
            </div>
            <div className="btn w-full h-[20%]  pl-60 flex items-center gap-5">
              <button
                className="w-26 h-[70%] bg-[#c7c4c4] text-black rounded text-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                onClick={() => {
                  setfolderrename(false);
                  setnewfoldername(oldfoldername);
                }}
              >
                Cancel
              </button>
              <button
                className="w-26 h-[70%] bg-[#444442] text-white rounded text-xl cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                onClick={handlefolderrename}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;

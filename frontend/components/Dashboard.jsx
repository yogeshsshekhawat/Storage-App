import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import Foldercard from "./Foldercard";
import { FaFolder } from "react-icons/fa6";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { CiFileOn } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Filecard from "./Filecard";
import { Link, useParams } from "react-router";
import Dashfcard from "./Dashfcard";

const Dashboard = ({ url, data, getdata, active, setActive }) => {
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
  const favorite = data?.favorites || [];
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
    <div className="w-full h-[91vh] flex flex-col items-center bg-[#FAFAFA]">
      <div className="dash w-[98%] h-76 rounded-2xl  bg-bottom text-white bg-no-repeat inset-0 bg-linear-to-r  bg-cover pl-5 pr-5 flex flex-col gap-4 justify-center">
        <div className="w-full h-23 bg-[#555755] p-3 mt-2 rounded-xl relative">
          <h1 className=" text-[12px] text-[#898a89] tracking-[1.6px] font-semibold">
            Good Afternoon 👋🏻
          </h1>
          <h1 className="text-[22px] font-bold">
            {/* Welcome Back,<span className="text-[#64c0fa]">{data?.username}</span> */}
            Welcome Back,<span className="text-[#64c0fa]">User</span>
          </h1>
          <p className="text-[13px]">
            3 files shared with you . {(data?.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB of 10 GB used{" "}
          </p>
          <img
            src="/cloud.png"
            className="w-16 h-16 absolute top-5 right-6 opacity-60"
          ></img>
        </div>
        <div className="w-full h-28 flex justify-between ">
          <div className="w-74 rounded-2xl h-full border text-black  border-[#cccccc]  flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img src="/file.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[16px] font-bold">{data?.totalFiles}</h1>
                <h1 className="text-[10px] ">Total files</h1>
              </div>
            </div>
            <img src="/database.webp" className="w-18 h-20"></img>
          </div>
          <div className="w-74 rounded-2xl h-full border text-black  border-[#cccccc]  flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d3d3d3] p-2">
                <img src="/logo.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[16px] font-bold">{(data?.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB</h1>
                <h1 className="text-[10px] ">Storage used</h1>
              </div>
            </div>
            <img src="/progress.png" className="w-16 h-20"></img>
          </div>
          <div className="w-74 rounded-2xl h-full border text-black  border-[#cccccc]  flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img src="/link.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[16px] font-bold">6</h1>
                <h1 className="text-[10px] ">Shared Files</h1>
              </div>
            </div>
            <img src="/link1.png" className="w-18 h-18"></img>
          </div>
          <div className="w-74 rounded-2xl h-full border text-black  border-[#cccccc]  flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2 text-2xl">
                ⭐
              </div>
              <div className="">
                <h1 className="text-[16px] font-bold">{data?.favorites?.length}</h1>
                <h1 className="text-[10px] ">Favorites</h1>
              </div>
            </div>
            <img src="/star.png" className="w-16 h-16 "></img>
          </div>
        </div>
      </div>
      <div className="w-full h-[75vh] flex  ">
        <div className="right  p-4">
          <h1 className="text-[12px] text-[#898a89] tracking-[1.6px] font-semibold  mb-2">
            RECENT FILES
          </h1>
          <div
            className={`file w-[62vw] h-[57vh] bg-[#FFFFFF] border border-[#c6c6c6] rounded-[7px]  overflow-hidden `}
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
                {files.map((el) => {
                  return (
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="w-[27vw] h-full ">
          <h1 className="text-[12px] text-[#898a89] tracking-[1.6px] font-semibold  mt-4 mb-2">
            STORAGE BREAKDOWN
          </h1>
          <div className="w-[95%] h-48 bg-white border border-[#b1b1b1] rounded-xl pl-5 pr-5">
            <div className="h-9  flex flex-col gap-1 mt-2">
              <div className="w-full  flex items-center justify-between">
                <h1 className="text-[13px]">Documents</h1>
                <h6 className="text-[12px] font-bold">24.8 GB</h6>
              </div>
              <div className="w-full h-2 bg-[#E0DFDF] rounded-3xl overflow-hidden">
                <div className="progress w-[24.8%] h-full bg-[#4CA4E6] rounded-2xl"></div>
              </div>
            </div>
            <div className="h-9  flex flex-col gap-1 mt-2">
              <div className="w-full  flex items-center justify-between">
                <h1 className="text-[13px]">Images</h1>
                <h6 className="text-[12px] font-bold">31.8 GB</h6>
              </div>
              <div className="w-full h-2 bg-[#E0DFDF] rounded-3xl overflow-hidden">
                <div className="progress w-[31.8%] h-full bg-[#f4cc7b] rounded-2xl"></div>
              </div>
            </div>
            <div className="h-9  flex flex-col gap-1 mt-2">
              <div className="w-full  flex items-center justify-between">
                <h1 className="text-[13px]">Videos</h1>
                <h6 className="text-[12px] font-bold">12.4 GB</h6>
              </div>
              <div className="w-full h-2 bg-[#E0DFDF] rounded-3xl overflow-hidden">
                <div className="progress w-[12.4%] h-full bg-[#80eb65] rounded-2xl"></div>
              </div>
            </div>
            <div className="w-full h-0.5 bg-gray-200 mt-3"></div>
            <div className="w-full h-10  flex items-center justify-between  ">
              <h1 className="text-[12px] text-[#898a89]  font-semibold ">
                Total
              </h1>
              <h6 className="text-[12px] font-bold">{(data?.totalSize / (1024 * 1024 * 1024)).toFixed(2)}/10 GB</h6>
            </div>
          </div>
          <h1 className="text-[12px] text-[#898a89] tracking-[1.6px] font-semibold  mt-2 mb-2">
            FAVORITES
          </h1>
          <div className="  w-[19.8vw]  h-60 border border-[#b1b1b1] rounded-xl overflow-auto hide-scrollbar">
            {favorite.length == 0 ? (
              <div
                className={`w-full h-full text-[2vw] text-[#7e7e7e] flex items-center flex-col justify-center gap-5 pb-15 p-5`}
              >
                <h2 className="text-lg font-semibold">No favorites yet !!!</h2>

                <p className="text-gray-500 text-sm mt-1 flex flex-col items-center">
                  Tap the ⭐ icon on any file{" "}
                  <div className=""> to add it here</div>
                </p>
              </div>
            ) : (
              <div className="hide-scrollbar">
                {favorite
                  .filter((el) => el.favorites)
                  .map((el) => (
                    <Dashfcard
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
      </div>
    </div>
  );
};

export default Dashboard;

{
  /* <div className="dash w-[98%] h-76 rounded-2xl bg-[url(/dashbg.png)] bg-bottom  bg-no-repeat inset-0 bg-linear-to-r  bg-cover pl-10 pr-10 flex flex-col gap-4 justify-center">
        <div className="w-[30vw] h-24 ">
          <h1 className="text-[18px]">Good Afternoon</h1>
          <h1 className="text-[28px] font-bold">
            Welcome Back,<span className="text-[#ff8000]">Alex</span>
          </h1>
          <p className="text-[13px]">
            3 files shared with you . 68.4 GB of 100 used{" "}
          </p>
        </div>
        <div className="w-full h-32 flex justify-evenly text-white">
          <div className="w-72 rounded-2xl h-full border backdrop-blur-xs flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img src="/file.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[18px] font-bold">10</h1>
                <h1 className="text-[12px] ">Total files</h1>
              </div>
            </div>
            <img src="/database.webp" className="w-22 h-22"></img>
          </div>
          <div className="w-72 rounded-2xl h-full border backdrop-blur-xs flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img src="/logo.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[18px] font-bold">68.4 GB</h1>
                <h1 className="text-[12px] ">Storage used</h1>
              </div>
            </div>
            <img src="/progress.png" className="w-22 h-22"></img>
          </div>
          <div className="w-72 rounded-2xl h-full border backdrop-blur-xs flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img src="/link.png" className="w-full h-full bg-cover"></img>
              </div>
              <div className="">
                <h1 className="text-[18px] font-bold">6</h1>
                <h1 className="text-[12px] ">Shared Files</h1>
              </div>
            </div>
            <img src="/link1.png" className="w-22 h-22"></img>
          </div>
          <div className="w-72 rounded-2xl h-full border backdrop-blur-xs flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d9d6d6] p-2">
                <img
                  src="/favourite.png"
                  className="w-full h-full bg-cover"
                ></img>
              </div>
              <div className="">
                <h1 className="text-[18px] font-bold">4</h1>
                <h1 className="text-[12px] ">Favorites</h1>
              </div>
            </div>
            <img src="/star.png" className="w-20 h-20"></img>
          </div>
        </div>
      </div> */
}

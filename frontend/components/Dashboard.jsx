import React, { useEffect, useState } from "react";
import { FiFolder, FiStar, FiFileText, FiLink, FiFolderPlus, FiDatabase } from "react-icons/fi";
import Filecard from "./Filecard";
import { useParams } from "react-router";
import Dashfcard from "./Dashfcard";

const Dashboard = ({ url, data, getdata, active, setActive }) => {
  const [foldername, setfoldername] = useState("");
  const folders = data?.folder || [];
  const files = data?.files || [];
  const favorite = data?.favorites || [];
  const { dirId } = useParams();

  const totalFilesCount = data?.totalFiles || 0;
  const totalFoldersCount = data?.totalFolders || 0;
  const totalSize = data?.totalSize || 0;
  const storageLimitBytes = data?.storageLimit || (200 * 1024 * 1024);

  const formatBytes = (bytes) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) bytes = 0;
    if (bytes >= 1024 * 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1) + " TB";
    }
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    }
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (bytes / 1024).toFixed(1) + " KB";
  };

  let docSize = 0;
  let imgSize = 0;
  let vidSize = 0;
  let otherSize = 0;

  const docExtensions = ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "txt", "csv", "md", "json", "rtf"];
  const imgExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"];
  const vidExtensions = ["mp4", "webm", "mkv", "avi", "mov", "wmv"];

  files.forEach((f) => {
    const extension = f.ext ? f.ext.toLowerCase().replace(".", "") : "";
    if (docExtensions.includes(extension)) {
      docSize += f.size || 0;
    } else if (imgExtensions.includes(extension)) {
      imgSize += f.size || 0;
    } else if (vidExtensions.includes(extension)) {
      vidSize += f.size || 0;
    } else {
      otherSize += f.size || 0;
    }
  });

  const docPercentage = storageLimitBytes ? (docSize / storageLimitBytes) * 100 : 0;
  const imgPercentage = storageLimitBytes ? (imgSize / storageLimitBytes) * 100 : 0;
  const vidPercentage = storageLimitBytes ? (vidSize / storageLimitBytes) * 100 : 0;
  const otherPercentage = storageLimitBytes ? (otherSize / storageLimitBytes) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-[#FAFAFA]/10 overflow-y-auto md:overflow-hidden pb-6 md:pb-0">

      {/* Upgraded Premium Greeting Banner */}
      <div className="hidden md:flex w-full bg-[#2E302E] border-2 border-gray-900 rounded-2xl p-4 md:py-5 md:px-6 relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] items-center justify-between text-white shrink-0">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-[0.05] select-none pointer-events-none">
          ☁️
        </div>

        <div className="relative z-10">
          <span className="text-[9px] text-[#CCFF00] tracking-[2px] uppercase font-black mb-1 block">
            Secure Storage Portal
          </span>
          <h1 className="text-xl md:text-[22px] font-black tracking-tight mb-1 text-white uppercase">
            Welcome Back, <span className="text-[#CCFF00]">{data?.username || "User"}</span>
          </h1>
          <p className="text-[11px] text-gray-300 font-bold">
            {totalFoldersCount} folders • {totalFilesCount} files • {formatBytes(totalSize)} of {formatBytes(storageLimitBytes)} used
          </p>
        </div>

        {/* Sync System Status Badge */}
        <div className="relative z-10 hidden sm:flex items-center gap-2 bg-white/10 border-2 border-gray-900 rounded-xl py-1.5 px-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[10px] text-[#CCFF00] font-black uppercase tracking-wider">
            Secure & Synced
          </span>
        </div>
      </div>

      {/* Responsive Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full shrink-0">

        {/* Stat Card 1: Total Files */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00] border-2 border-gray-900 flex items-center justify-center text-gray-900">
              <FiFileText className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none mb-0.5">{totalFilesCount}</h3>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Total Files</span>
            </div>
          </div>
          <span className="text-5xl filter  select-none">🗃️</span>
        </div>

        {/* Stat Card 2: Storage Used */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#2B7FFF] border-2 border-gray-900 flex items-center justify-center text-white">
              <FiDatabase className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none mb-0.5">{formatBytes(totalSize)}</h3>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Storage Used</span>
            </div>
          </div>
          <span className="text-5xl filter  select-none">📊</span>
        </div>

        {/* Stat Card 3: Shared Files */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#9D5CFF] border-2 border-gray-900 flex items-center justify-center text-white">
              <FiLink className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none mb-0.5">{totalFoldersCount}</h3>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Total Folders</span>
            </div>
          </div>
          <span className="text-5xl filter  select-none">📂</span>
        </div>

        {/* Stat Card 4: Favorites */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFC700] border-2 border-gray-900 flex items-center justify-center text-gray-900">
              <FiStar className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-none mb-0.5">{favorite.length}</h3>
              <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Favorites</span>
            </div>
          </div>
          <span className="text-5xl filter  select-none">🌟</span>
        </div>
      </div>

      {/* Main Dashboard Layout section - Responsive Grid filling remaining viewport space */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">

        {/* Left Column: Recent Files List (Col Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-2 h-full min-h-0">
          <h2 className="text-[10px] text-gray-900 tracking-[1.5px] font-black pl-1 shrink-0 uppercase">
            Recent Files
          </h2>

          <div className="w-full bg-white border-2 border-gray-900 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full min-h-0 min-h-[300px]">
            {/* Table Header */}
            <div className="bg-[#FAFAFA] border-b-2 border-gray-900 flex items-center h-10 px-4 text-[10.5px] font-black text-gray-900 select-none shrink-0 uppercase">
              <div className="flex-1 md:w-[50%] pl-2">Name</div>
              <div className="hidden md:block w-[18%] text-center">Modified</div>
              <div className="hidden md:block w-[8%] text-center">Type</div>
              <div className="w-20 md:w-[10%] text-center">Size</div>
              <div className="w-16 md:w-[14%]"></div>
            </div>

            {/* Table Body */}
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center p-6 bg-[#FAFAFA]/40">
                <img
                  src="/empty-box.png"
                  className="w-20 h-20 mb-4 opacity-50 select-none pointer-events-none"
                  alt="Empty"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h2 className="text-xs font-black text-gray-900 uppercase">No recent activity</h2>
                <p className="text-gray-500 text-[11px] font-bold mt-1">
                  Files you upload or edit will appear here.
                </p>
                <button
                  className="mt-4 px-4 py-1.5 bg-[#CCFF00] hover:bg-[#b5e000] text-gray-900 border-2 border-gray-900 text-[11px] font-black rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  onClick={() => {
                    setActive("My Files");
                    getdata();
                  }}
                >
                  Open Files
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y-2 divide-gray-900 hide-scrollbar">
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

        {/* Right Column: Storage Breakdown & Favorites (Col Span 1) */}
        <div className="hidden md:flex flex-col gap-4 h-full min-h-0">

          {/* Storage Breakdown Card */}
          <div className="flex flex-col gap-2 shrink-0">
            <h2 className="text-[10px] text-gray-900 tracking-[1.5px] font-black pl-1 uppercase">
              Storage Breakdown
            </h2>

            <div className="w-full bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
              {/* Docs progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-black text-gray-900 leading-none">
                  <span>Documents</span>
                  <span className="text-gray-500 font-bold">{formatBytes(docSize)} ({docPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 border-2 border-gray-900 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#2B7FFF] rounded-full transition-all duration-300" style={{ width: `${docPercentage}%` }}></div>
                </div>
              </div>

              {/* Images progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-black text-gray-900 leading-none">
                  <span>Images</span>
                  <span className="text-gray-500 font-bold">{formatBytes(imgSize)} ({imgPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 border-2 border-gray-900 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#FFC700] rounded-full transition-all duration-300" style={{ width: `${imgPercentage}%` }}></div>
                </div>
              </div>

              {/* Videos progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-black text-gray-900 leading-none">
                  <span>Videos</span>
                  <span className="text-gray-500 font-bold">{formatBytes(vidSize)} ({vidPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 border-2 border-gray-900 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#9D5CFF] rounded-full transition-all duration-300" style={{ width: `${vidPercentage}%` }}></div>
                </div>
              </div>

              {/* Others progress bar */}
              {otherSize > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="w-full flex items-center justify-between text-[11px] font-black text-gray-900 leading-none">
                    <span>Other Files</span>
                    <span className="text-gray-500 font-bold">{formatBytes(otherSize)} ({otherPercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 border-2 border-gray-900 rounded-full overflow-hidden">
                    <div className="progress h-full bg-[#CCFF00] rounded-full transition-all duration-300" style={{ width: `${otherPercentage}%` }}></div>
                  </div>
                </div>
              )}

              <div className="h-[2px] bg-gray-900 my-0.5"></div>

              {/* Total Storage Summary */}
              <div className="w-full flex items-center justify-between text-xs font-black text-gray-900 uppercase">
                <span className="text-gray-500 font-bold tracking-wider text-[10px]">Total usage</span>
                <span>{formatBytes(totalSize)} / {formatBytes(storageLimitBytes)}</span>
              </div>
            </div>
          </div>

          {/* Favorites List Card */}
          <div className="flex-1 min-h-0 flex flex-col gap-2">
            <h2 className="text-[10px] text-gray-900 tracking-[1.5px] font-black pl-1 uppercase">
              Favorites
            </h2>

            <div className="w-full bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col h-full min-h-0 flex-1">
              {favorite.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="text-xs font-black text-gray-900 uppercase">No favorites yet</h3>
                  <p className="text-gray-500 text-[10px] font-bold mt-1">
                    Tap the ⭐ icon on any file or folder to bookmark it here.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 hide-scrollbar">
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
    </div>
  );
};

export default Dashboard;

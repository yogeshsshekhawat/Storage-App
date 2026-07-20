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
    <div className="w-full h-full flex flex-col gap-4 bg-[#FAFAFA]/10 overflow-hidden">
      
      {/* Upgraded Premium Greeting Banner */}
      <div className="w-full bg-gradient-to-r from-[#171917] via-[#242724] to-[#171917] border border-gray-800/20 rounded-2xl p-4 md:py-5 md:px-6 relative overflow-hidden shadow-sm flex items-center justify-between text-white shrink-0">
        {/* Glow orbs background decoration */}
        <div className="absolute top-0 right-1/4 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none select-none"></div>
        <div className="absolute bottom-0 right-10 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none select-none"></div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-[0.03] select-none pointer-events-none">
          ☁️
        </div>

        <div className="relative z-10">
          <span className="text-[9px] text-blue-400 tracking-[2px] uppercase font-bold mb-1 block">
            Secure Storage Portal
          </span>
          <h1 className="text-xl md:text-[22px] font-extrabold tracking-tight mb-1 text-white">
            Welcome Back, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">{data?.username || "User"}</span>
          </h1>
          <p className="text-[11px] text-gray-400 font-semibold">
            {totalFoldersCount} folders • {totalFilesCount} files • {formatBytes(totalSize)} of {formatBytes(storageLimitBytes)} used
          </p>
        </div>

        {/* Sync System Status Badge */}
        <div className="relative z-10 hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl py-1.5 px-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
            Secure & Synced
          </span>
        </div>
      </div>

      {/* Responsive Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full shrink-0">
        
        {/* Stat Card 1: Total Files */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <FiFileText className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 leading-none mb-0.5">{totalFilesCount}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Files</span>
            </div>
          </div>
          <span className="text-3xl filter opacity-30 select-none">📁</span>
        </div>

        {/* Stat Card 2: Storage Used */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <FiDatabase className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 leading-none mb-0.5">{formatBytes(totalSize)}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Storage Used</span>
            </div>
          </div>
          <span className="text-3xl filter opacity-30 select-none">📊</span>
        </div>

        {/* Stat Card 3: Shared Files */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <FiLink className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 leading-none mb-0.5">{totalFoldersCount}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Folders</span>
            </div>
          </div>
          <span className="text-3xl filter opacity-30 select-none">🔗</span>
        </div>

        {/* Stat Card 4: Favorites */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <FiStar className="text-base" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 leading-none mb-0.5">{favorite.length}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Favorites</span>
            </div>
          </div>
          <span className="text-3xl filter opacity-30 select-none">⭐</span>
        </div>
      </div>

      {/* Main Dashboard Layout section - Responsive Grid filling remaining viewport space */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
        
        {/* Left Column: Recent Files List (Col Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-2 h-full min-h-0">
          <h2 className="text-[10px] text-gray-400 tracking-[1.5px] font-bold pl-1 shrink-0 uppercase">
            Recent Files
          </h2>
          
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-0">
            {/* Table Header */}
            <div className="bg-gray-50/75 border-b border-gray-150 flex items-center h-10 px-4 text-[10.5px] font-bold text-gray-400 select-none shrink-0">
              <div className="w-[40%] pl-2">Name</div>
              <div className="w-[22%]">Modified</div>
              <div className="w-[18%]">Type</div>
              <div className="w-[10%]">Owner</div>
              <div className="w-[10%] text-right pr-2">Size</div>
            </div>

            {/* Table Body */}
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center p-6">
                <img
                  src="/empty-box.png"
                  className="w-20 h-20 mb-4 opacity-50 select-none pointer-events-none"
                  alt="Empty"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h2 className="text-xs font-bold text-gray-700">No recent activity</h2>
                <p className="text-gray-400 text-[11px] font-medium mt-1">
                  Files you upload or edit will appear here.
                </p>
                <button
                  className="mt-4 px-4 py-1.5 bg-[#4A4D4A] hover:bg-[#2E302E] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                  onClick={() => {
                    setActive("My Files");
                    getdata();
                  }}
                >
                  Open Files
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 hide-scrollbar">
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
        <div className="flex flex-col gap-4 h-full min-h-0">
          
          {/* Storage Breakdown Card */}
          <div className="flex flex-col gap-2 shrink-0">
            <h2 className="text-[10px] text-gray-400 tracking-[1.5px] font-bold pl-1 uppercase">
              Storage Breakdown
            </h2>
            
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              {/* Docs progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 leading-none">
                  <span>Documents</span>
                  <span className="text-gray-400 font-semibold">{formatBytes(docSize)} ({docPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#4CA4E6] rounded-full transition-all duration-300" style={{ width: `${docPercentage}%` }}></div>
                </div>
              </div>

              {/* Images progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 leading-none">
                  <span>Images</span>
                  <span className="text-gray-400 font-semibold">{formatBytes(imgSize)} ({imgPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#f4cc7b] rounded-full transition-all duration-300" style={{ width: `${imgPercentage}%` }}></div>
                </div>
              </div>

              {/* Videos progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 leading-none">
                  <span>Videos</span>
                  <span className="text-gray-400 font-semibold">{formatBytes(vidSize)} ({vidPercentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="progress h-full bg-[#80eb65] rounded-full transition-all duration-300" style={{ width: `${vidPercentage}%` }}></div>
                </div>
              </div>

              {/* Others progress bar */}
              {otherSize > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 leading-none">
                    <span>Other Files</span>
                    <span className="text-gray-450 font-semibold">{formatBytes(otherSize)} ({otherPercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="progress h-full bg-[#a78bfa] rounded-full transition-all duration-300" style={{ width: `${otherPercentage}%` }}></div>
                  </div>
                </div>
              )}

              <div className="h-px bg-gray-150 my-0.5"></div>

              {/* Total Storage Summary */}
              <div className="w-full flex items-center justify-between text-xs font-extrabold text-gray-800">
                <span className="text-gray-450 font-bold uppercase tracking-wider text-[10px]">Total usage</span>
                <span>{formatBytes(totalSize)} / {formatBytes(storageLimitBytes)}</span>
              </div>
            </div>
          </div>

          {/* Favorites List Card */}
          <div className="flex-1 min-h-0 flex flex-col gap-2">
            <h2 className="text-[10px] text-gray-400 tracking-[1.5px] font-bold pl-1 uppercase">
              Favorites
            </h2>
            
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col h-full min-h-0 flex-1">
              {favorite.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="text-xs font-bold text-gray-600">No favorites yet</h3>
                  <p className="text-gray-400 text-[10px] font-semibold mt-1">
                    Tap the ⭐ icon on any file or folder to bookmark it here.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 hide-scrollbar">
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

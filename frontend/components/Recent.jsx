import React, { useState } from "react";
import Filecard from "./Filecard";
import { FiGrid, FiList } from "react-icons/fi";

const Recent = ({ url, data, getdata, active, setActive }) => {
  const files = data?.files || [];
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden bg-transparent">
      {/* Files Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-2.5">
        <div className="flex items-center justify-between shrink-0 pl-1">
          <h2 className="text-[11px] text-gray-900 tracking-[1.5px] font-black uppercase">
            Recently Modified Files
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`w-8 h-8 rounded-lg border-2 border-gray-900 transition-all cursor-pointer flex items-center justify-center ${
                viewMode === "list"
                  ? "bg-[#CCFF00] text-gray-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-400 hover:text-gray-900"
              }`}
              title="List View"
            >
              <FiList className="text-sm stroke-[2.5]" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-8 rounded-lg border-2 border-gray-900 transition-all cursor-pointer flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-[#CCFF00] text-gray-900 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-400 hover:text-gray-900"
              }`}
              title="Grid View"
            >
              <FiGrid className="text-sm stroke-[2.5]" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            {files.length === 0 ? (
              <div className="w-full h-full bg-[#FAFAFA]/40 border-2 border-gray-900 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center py-16 text-center p-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
                {files.map((el) => (
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
                    layout="grid"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex-1 min-h-0 flex flex-col bg-transparent">
            {/* Table Header */}
            <div className="flex items-center h-10 px-4 text-[10.5px] font-black tracking-wider text-gray-900 select-none shrink-0 uppercase border-b-2 border-gray-900">
              <div className="w-[50%] pl-2">Name</div>
              <div className="w-[18%] text-center">Modified</div>
              <div className="w-[8%] text-center">Type</div>
              <div className="w-[10%] text-center">Size</div>
              <div className="w-[14%]"></div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-1">
              {files.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center p-6 bg-[#FAFAFA]/40 border-2 border-gray-900 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
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
                files.map((el) => (
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
                    layout="list"
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;

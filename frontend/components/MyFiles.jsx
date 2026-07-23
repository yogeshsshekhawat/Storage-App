import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import Foldercard from "./Foldercard";
import { FaFolder } from "react-icons/fa6";
import { Scrollbar } from "swiper/modules";
import { CiFileOn } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import Filecard from "./Filecard";
import { useParams } from "react-router";
import { FiGrid, FiList } from "react-icons/fi";

const MyFiles = ({ url, data, getdata, active }) => {
  const ownerName = data?.username || "User";
  const [folderrename, setfolderrename] = useState(false);
  const [newfolder, setnewfolder] = useState(true);
  const [foldername, setfoldername] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [oldfoldername, setoldfoldername] = useState();
  const [newfoldername, setnewfoldername] = useState(oldfoldername);
  const [folderid, setfolderid] = useState();
  
  const folders = data?.folder || [];
  const files = data?.files || [];
  const { dirId } = useParams();

  useEffect(() => {
    setnewfoldername(oldfoldername);
  }, [oldfoldername]);

  async function handlecreate() {
    await fetch(`${url}directory/${dirId || "root"}`, {
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

  async function handlefolderrename() {
    await fetch(`${url}directory/${folderid}`, {
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
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden bg-transparent">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between shrink-0 pl-1">
        <div className="flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-white border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none">
          {Array.isArray(data?.path) ? (
            data.path.map((item, index) => {
              const isLast = index === data.path.length - 1;
              const name = typeof item === "object" && item !== null ? item.name : item;
              const id = typeof item === "object" && item !== null ? item.id : null;
              const displayName = name === "root" ? "Home" : name;

              return (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <svg
                      className="w-3 h-3 text-gray-900 shrink-0 mx-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}

                  {isLast ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-gray-900 tracking-wide truncate max-w-[160px] uppercase">
                      {index === 0 && <FaFolder className="text-[#2B7FFF] text-[11px] shrink-0" />}
                      {displayName}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (id) {
                          window.location.href = `/directory/${id}`;
                        } else if (name === "root") {
                          window.location.href = `/directory/root`;
                        }
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer hover:bg-gray-100 px-1.5 py-0.5 rounded-md uppercase"
                    >
                      {index === 0 && <FaFolder className="text-[#2B7FFF]/80 text-[11px] shrink-0" />}
                      {displayName}
                    </button>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-black text-gray-900 tracking-wide uppercase">
              <FaFolder className="text-[#2B7FFF] text-[11px] shrink-0" />
              Home
            </span>
          )}
        </div>
      </div>

      {/* Folders Row */}
      {folders.length === 0 ? (
        <div></div>
      ) : (
        <div className="folder w-full h-48 flex gap-5 text-[#474747] select-none shrink-0">
          <Swiper
            key={folders.length} // forces re-init when folders change
            modules={[Scrollbar]}
            spaceBetween={16}
            slidesPerView="auto"
            scrollbar={{ draggable: true }}
            className="folderSwiper justify-start flex w-full"
          >
            {folders.map((el, i) => {
              return (
                <SwiperSlide className="w-auto!" key={i}>
                  <Foldercard
                    name={el.name}
                    id={el._id}
                    folderrename={setfolderrename}
                    setoldfoldername={setoldfoldername}
                    setfolderid={setfolderid}
                    getdata={getdata}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Files Section */}
      <div className="flex-1 min-h-0 flex flex-col gap-2.5">
        <div className="flex items-center justify-between shrink-0 pl-1 text-[#2E302E]">
          <h2 className="text-[11px] text-gray-900 tracking-[1.5px] font-black uppercase">
            Files
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
                <h2 className="text-xs font-black text-gray-900 uppercase">This folder is empty</h2>
                <p className="text-gray-550 text-[11px] font-bold mt-1">
                  Upload files or create directories to get started.
                </p>
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
                    ownerName={ownerName}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex-1 min-h-0 flex flex-col bg-transparent">
            {/* Table Header */}
            <div className="flex items-center h-10 px-4 text-[10.5px] font-black tracking-wider text-gray-900 select-none shrink-0 uppercase border-b-2 border-gray-900">
              <div className="flex-1 md:w-[50%] pl-2">Name</div>
              <div className="hidden md:block w-[18%] text-center">Modified</div>
              <div className="hidden md:block w-[8%] text-center">Type</div>
              <div className="w-20 md:w-[10%] text-center">Size</div>
              <div className="w-16 md:w-[14%]"></div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-1">
              {files.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center p-6 bg-[#FAFAFA]/40 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <img
                    src="/empty-box.png"
                    className="w-20 h-20 mb-4 opacity-50 select-none pointer-events-none"
                    alt="Empty"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <h2 className="text-xs font-black text-gray-900 uppercase">This folder is empty</h2>
                  <p className="text-gray-550 text-[11px] font-bold mt-1">
                    Upload files or create directories to get started.
                  </p>
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
                    ownerName={ownerName}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {!newfolder && (
        <div
          className="createfolder fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setnewfolder(true);
            setfoldername("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlecreate();
            }}
            className="w-full max-w-[360px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#CCFF00] border-2 border-gray-900 flex items-center justify-center text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    📁
                  </div>
                  <h1 className="text-sm font-black text-gray-900 uppercase">Create Folder</h1>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-gray-50 border-2 border-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                  onClick={() => {
                    setnewfolder(true);
                    setfoldername("");
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="folderinput" className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                  Folder Name
                </label>
                <input
                  type="text"
                  id="folderinput"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-900 bg-white rounded-xl outline-none text-xs font-bold text-gray-900 focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all"
                  placeholder="e.g., Marketing Assets"
                  value={foldername}
                  onChange={(e) => setfoldername(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  className="text-xs px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  onClick={() => {
                    setnewfolder(true);
                    setfoldername("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] border-2 border-gray-900 transition-colors flex items-center justify-center text-gray-900 rounded-xl cursor-pointer font-black gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* Rename Folder Modal */}
      {folderrename && (
        <div
          className="renamefolder fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setfolderrename(false);
            setnewfoldername(oldfoldername);
          }}
        >
          <div
            className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#CCFF00] border-2 border-gray-900 flex items-center justify-center text-gray-900 text-base shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  📁
                </div>
                <h1 className="font-black text-sm text-gray-900 uppercase">Rename Folder</h1>
              </div>
              <button
                className="w-7 h-7 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-900 font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                onClick={() => {
                  setfolderrename(false);
                  setnewfoldername(oldfoldername);
                }}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                <span>Original:</span>
                <span className="font-black text-gray-700 truncate">{oldfoldername}</span>
              </div>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border-2 border-gray-900 rounded-xl outline-none text-xs font-bold text-gray-955 bg-white focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all"
                value={newfoldername}
                onChange={(e) => setnewfoldername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={() => {
                  setfolderrename(false);
                  setnewfoldername(oldfoldername);
                }}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-[#CCFF00] hover:bg-[#b5e000] border-2 border-gray-900 transition-colors flex items-center justify-center text-gray-900 rounded-xl cursor-pointer font-black gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={handlefolderrename}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFiles;

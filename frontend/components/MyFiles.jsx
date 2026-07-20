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
        <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-slate-50 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] select-none">
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
                      className="w-3 h-3 text-gray-300 shrink-0 mx-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}

                  {isLast ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 tracking-wide truncate max-w-[160px]">
                      {index === 0 && <FaFolder className="text-blue-500/80 text-[11px] shrink-0" />}
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
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hover:bg-gray-200/50 px-1.5 py-0.5 rounded-md"
                    >
                      {index === 0 && <FaFolder className="text-blue-400/80 text-[11px] shrink-0" />}
                      {displayName}
                    </button>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 tracking-wide">
              <FaFolder className="text-blue-500/80 text-[11px] shrink-0" />
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
        <div className="flex items-center justify-between shrink-0 pl-1">
          <h2 className="text-[11px] text-gray-400 tracking-[1.5px] font-bold uppercase">
            Files
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`w-8 h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                viewMode === "list"
                  ? "bg-white text-[#4A4D4A] border-[#4A4D4A]/30 ring-2 ring-[#4A4D4A]/5"
                  : "bg-white/70 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="List View"
            >
              <FiList className="text-sm stroke-[2]" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-8 h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                viewMode === "grid"
                  ? "bg-white text-[#4A4D4A] border-[#4A4D4A]/30 ring-2 ring-[#4A4D4A]/5"
                  : "bg-white/70 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title="Grid View"
            >
              <FiGrid className="text-sm stroke-[2]" />
            </button>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            {files.length === 0 ? (
              <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-16 text-center p-6">
                <img
                  src="/empty-box.png"
                  className="w-20 h-20 mb-4 opacity-50 select-none pointer-events-none"
                  alt="Empty"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h2 className="text-xs font-bold text-gray-700">This folder is empty</h2>
                <p className="text-gray-400 text-[11px] font-medium mt-1">
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
            <div className="flex items-center h-10 px-4 text-[10px] font-extrabold tracking-wider text-gray-400 select-none shrink-0 uppercase">
              <div className="w-[34%] pl-2">Name</div>
              <div className="w-[18%] text-center">Modified</div>
              <div className="w-[16%] text-center">Owner</div>
              <div className="w-[8%] text-center">Type</div>
              <div className="w-[10%] text-center">Size</div>
              <div className="w-[14%]"></div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-1">
              {files.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-16 text-center p-6">
                  <img
                    src="/empty-box.png"
                    className="w-20 h-20 mb-4 opacity-50 select-none pointer-events-none"
                    alt="Empty"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <h2 className="text-xs font-bold text-gray-700">This folder is empty</h2>
                  <p className="text-gray-400 text-[11px] font-medium mt-1">
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
            <div className="bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                    📁
                  </div>
                  <h1 className="text-sm font-bold text-gray-800">Create Folder</h1>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                  onClick={() => {
                    setnewfolder(true);
                    setfoldername("");
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
                <label htmlFor="folderinput" className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Folder Name
                </label>
                <input
                  type="text"
                  id="folderinput"
                  className="w-full px-3.5 py-2.5 border border-gray-250 focus:ring-[#4A4D4A]/10 rounded-xl outline-none text-xs font-semibold text-gray-700 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#4A4D4A] focus:ring-[3.5px] transition-all"
                  placeholder="e.g., Marketing Assets"
                  value={foldername}
                  onChange={(e) => setfoldername(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                  onClick={() => {
                    setnewfolder(true);
                    setfoldername("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
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
            className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-base shadow-sm">
                  📁
                </div>
                <h1 className="font-bold text-sm text-gray-800">Rename Folder</h1>
              </div>
              <button
                className="w-7 h-7 bg-gray-50 border border-gray-150 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 text-gray-400 transition-all"
                onClick={() => {
                  setfolderrename(false);
                  setnewfoldername(oldfoldername);
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
                <span>Original:</span>
                <span className="font-bold text-gray-700 truncate">{oldfoldername}</span>
              </div>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border border-gray-250 focus:ring-[#4A4D4A]/10 rounded-xl outline-none text-xs font-semibold text-gray-700 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#4A4D4A] focus:ring-[3.5px] transition-all"
                value={newfoldername}
                onChange={(e) => setnewfoldername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                className="text-xs px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-600 rounded-xl cursor-pointer"
                onClick={() => {
                  setfolderrename(false);
                  setnewfoldername(oldfoldername);
                }}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-[#4A4D4A] hover:bg-[#2E302E] transition-colors flex items-center justify-center text-white rounded-xl cursor-pointer font-bold gap-2 shadow-sm"
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

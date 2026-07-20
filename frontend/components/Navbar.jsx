import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPieChart
} from "react-icons/fi";
import Filecard from "./Filecard";
import Foldercard from "./Foldercard";

const Navbar = ({ data, getdata, url, setActive }) => {
  const [profilemenu, setprofiloemenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  async function handlelogout() {
    try {
      await fetch(`${url}user/logout`, {
        method: "POST",
        credentials: "include",
      });
      getdata();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const performSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${url}file/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      if (res.ok) {
        const searchData = await res.json();
        setResults(searchData);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error searching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".card-portal")) {
        return;
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResultAction = (activeTab) => {
    if (getdata) getdata(activeTab);
    performSearch(searchQuery);
  };

  return (
    <>
      <div className="w-full h-16  border-b border-[#EBEAEA] bg-white/70 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-20">
        {/* Responsive Search Input Container */}
        <div ref={searchContainerRef} className="relative w-full max-w-2xl flex items-center">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <FiSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search files, folders..."
            className="w-full h-9.5 pl-10 pr-4 py-2 border border-gray-250 focus:ring-[#4A4D4A]/10 rounded-xl outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-xs font-semibold text-gray-700 transition-all focus:border-[#4A4D4A] focus:ring-[3.5px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) {
                setShowDropdown(true);
              }
            }}
          />
          {showDropdown && (
            <div className="absolute top-11 left-0 w-full max-h-[320px] overflow-y-auto bg-white border border-gray-200/80 rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] backdrop-blur-md z-50 flex flex-col hide-scrollbar p-1.5 gap-0.5">
              {loading ? (
                <div className="p-4 text-center text-gray-400 text-xs font-semibold">Searching...</div>
              ) : results.length > 0 ? (
                results.map((item) => {
                  if (item.type === "directory") {
                    return (
                      <Foldercard
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        getdata={handleResultAction}
                        compact={true}
                      />
                    );
                  } else {
                    return (
                      <Filecard
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        ext={item.ext}
                        modifed={item.updatedAt}
                        size={item.size}
                        favorites={item.favorites}
                        getdata={handleResultAction}
                        active="search"
                        compact={true}
                      />
                    );
                  }
                })
              ) : (
                <div className="p-4 text-center text-gray-400 text-xs font-semibold">No files found</div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Avatar Icon */}
        <div className="relative">
          <div
            className="profile w-8.5 h-8.5 rounded-full bg-gray-500 cursor-pointer flex items-center justify-center text-xs text-white overflow-hidden border border-gray-200 hover:border-gray-400 transition-all shadow-sm"
            onClick={() => setprofiloemenu(!profilemenu)}
          >
            <img
              src={data?.profilepic}
              className="w-full h-full object-cover"
              alt="profile"
              onError={(e) => { e.target.src = "https://www.gravatar.com/avatar/?d=mp"; }}
            />
          </div>

          {/* Upgraded Profile Settings Card */}
          {profilemenu && (
            <>
              {/* Overlay click catcher */}
              <div className="fixed inset-0 z-30" onClick={() => setprofiloemenu(false)}></div>

              <div
                className="menu w-56 absolute top-11 right-0 bg-white border border-gray-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl p-1.5 flex flex-col gap-0.5 z-40 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* User metadata header */}
                <div className="userdata w-full p-3 flex items-center gap-3 bg-gray-50 border border-gray-150 rounded-xl shrink-0">
                  <div className="profile w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white overflow-hidden shrink-0">
                    <img
                      src={data?.profilepic}
                      className="w-full h-full object-cover"
                      alt="profile"
                      onError={(e) => { e.target.src = "https://www.gravatar.com/avatar/?d=mp"; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-[11px] font-extrabold text-gray-800 truncate leading-none mb-0.5">{data?.username}</h1>
                    <h1 className="text-[9px] text-gray-400 font-semibold truncate leading-none">{data?.useremail}</h1>
                  </div>
                </div>

                {/* Option links */}
                <div className="flex flex-col gap-0.5 py-1">
                  <div
                    onClick={() => {
                      if (setActive) setActive("Settings");
                      setprofiloemenu(false);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-[11px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    <FiUser className="text-gray-400 text-xs shrink-0" />
                    My profile
                  </div>
                  <div
                    onClick={() => {
                      if (setActive) setActive("Settings");
                      setprofiloemenu(false);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-[11px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    <FiSettings className="text-gray-400 text-xs shrink-0" />
                    Settings
                  </div>
                  <div
                    onClick={() => {
                      if (setActive) setActive("Settings");
                      setprofiloemenu(false);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-[11px] font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    <FiPieChart className="text-gray-400 text-xs shrink-0" />
                    Storage plan
                  </div>
                </div>

                {/* Sign Out Action Button */}
                <button
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-[11px] font-extrabold text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                  onClick={handlelogout}
                >
                  <FiLogOut className="text-red-400 text-xs shrink-0" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

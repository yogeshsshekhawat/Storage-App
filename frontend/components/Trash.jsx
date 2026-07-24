import React, { useState } from "react";
import Deletecard from "./Deletecard";

const Trash = ({ url, data, getdata, active }) => {
  const hasItems = data?.files && data.files.length > 0;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleEmptyTrash = async () => {
    if (!hasItems) return;
    setIsPending(true);
    try {
      const res = await fetch(`${url}file/trash/empty`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        getdata(active);
        setShowConfirmModal(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert("An error occurred.");
      }
    } catch (err) {
      console.error("Empty trash error:", err);
      alert("An error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Upgraded Alert Warning Banner */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-red-100/10 border-2 border-gray-900 rounded-2xl p-4 shrink-0 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border-2 border-gray-900 flex items-center justify-center text-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            ⚠️
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-red-650 uppercase tracking-wider mb-0.5">
              Warning
            </span>
            <p className="text-[11.5px] text-gray-900 font-bold leading-relaxed">
              Items in the Trash are automatically deleted after 30 days and cannot be recovered.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (hasItems) setShowConfirmModal(true);
          }}
          disabled={!hasItems}
          className={`text-[11px] px-4 py-2 border-2 flex items-center justify-center rounded-xl font-black gap-2 shrink-0 transition-all ${
            hasItems
              ? "border-gray-900 bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              : "border-gray-900/40 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Empty Trash
        </button>
      </div>

      {/* Upgraded Trash Files Table */}
      <div className="w-full flex-1 min-h-0 border-2 border-gray-900 bg-white rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="bg-[#FAFAFA] border-b-2 border-gray-900 flex items-center h-11 text-[10.5px] font-black text-gray-900 select-none shrink-0 uppercase">
          <div className="w-[32%] pl-6">Name</div>
          <div className="w-[25%] text-center">Original Location</div>
          <div className="w-[18%] text-center">Deleted</div>
          <div className="w-[12%] text-center">Size</div>
          <div className="w-[13%] text-right pr-6">Action</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto divide-y-2 divide-gray-900 hide-scrollbar">
          {!data?.files || data.files.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center p-6 bg-[#FAFAFA]/40">
              <img
                src="/empty-box.png"
                className="w-16 h-16 mb-3 opacity-50 select-none pointer-events-none"
                alt="Empty"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h2 className="text-xs font-black text-gray-900 uppercase">Trash is empty</h2>
              <p className="text-gray-550 text-[10.5px] font-bold mt-1">
                No items have been moved to the trash.
              </p>
            </div>
          ) : (
            data.files.map((el) => {
              return <Deletecard el={el} getdata={getdata} active={active} key={el._id} />;
            })
          )}
        </div>
      </div>

      {/* Custom Warning Modal Overlay */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="w-full max-w-[360px] bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-red-100 border-2 border-gray-900 flex items-center justify-center text-lg shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  🚨
                </div>
                <h1 className="text-sm font-black text-gray-900 uppercase">Empty Trash</h1>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-white border-2 border-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-950 font-bold shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-gray-600 leading-normal">
              Are you sure you want to permanently delete all items in the Trash? This action is irreversible and files cannot be recovered.
            </p>
            <div className="flex gap-3 mt-2 justify-end">
              <button
                className="text-xs px-4 py-2 border-2 border-gray-900 bg-white hover:bg-gray-50 transition-colors font-bold text-gray-900 rounded-xl cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="text-xs px-5 py-2 bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-700 transition-colors flex items-center justify-center rounded-xl cursor-pointer font-extrabold gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50"
                onClick={handleEmptyTrash}
                disabled={isPending}
              >
                {isPending ? "Emptying..." : "Empty"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;

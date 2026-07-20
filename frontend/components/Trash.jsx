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
        alert(errData.error || "Failed to empty trash.");
      }
    } catch (err) {
      console.error("Empty trash error:", err);
      alert("Network error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Upgraded Alert Warning Banner */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-red-50/60 border border-red-100 rounded-2xl p-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100/80 flex items-center justify-center text-lg shadow-sm">
            ⚠️
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-wider mb-0.5">
              Warning
            </span>
            <p className="text-[11.5px] text-red-650 font-semibold leading-relaxed">
              Items in the Trash are automatically deleted after 30 days and cannot be recovered.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (hasItems) setShowConfirmModal(true);
          }}
          disabled={!hasItems}
          className={`text-[11px] px-4 py-2 border flex items-center justify-center rounded-xl font-bold gap-2 shrink-0 shadow-sm transition-all ${
            hasItems
              ? "border-red-200 bg-white hover:bg-red-50 text-red-600 cursor-pointer hover:shadow active:scale-[0.98]"
              : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
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
      <div className="w-full flex-1 min-h-0 border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="bg-gray-50/75 border-b border-gray-150 flex items-center h-11 text-[10.5px] font-bold text-gray-400 select-none shrink-0">
          <div className="w-[32%] pl-6">Name</div>
          <div className="w-[25%] text-center">Original Location</div>
          <div className="w-[18%] text-center">Deleted</div>
          <div className="w-[12%] text-center">Size</div>
          <div className="w-[13%] text-right pr-6">Action</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 hide-scrollbar">
          {!data?.files || data.files.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center p-6">
              <img
                src="/empty-box.png"
                className="w-16 h-16 mb-3 opacity-30 select-none pointer-events-none"
                alt="Empty"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <h2 className="text-xs font-bold text-gray-650">Trash is empty</h2>
              <p className="text-gray-450 text-[10.5px] font-semibold mt-1">
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
            className="w-full max-w-[360px] bg-white border border-gray-250/80 rounded-2xl p-6 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.2)] flex flex-col gap-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-lg">
                  🚨
                </div>
                <h1 className="text-sm font-bold text-gray-800">Empty Trash</h1>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-150 flex items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors text-gray-500 border-none outline-none font-bold"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-semibold text-gray-500 leading-normal">
              Are you sure you want to permanently delete all items in the Trash? This action is irreversible and files cannot be recovered.
            </p>
            <div className="flex gap-3 mt-2 justify-end">
              <button
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-red-600 hover:bg-red-750 transition-all rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer shadow-sm hover:shadow disabled:opacity-50 border-none outline-none"
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

import MyFiles from "../components/MyFiles.jsx";
import Recent from "../components/Recent.jsx";
import Favorites from "../components/Favorites.jsx";
import Shared from "../components/Shared.jsx";
import Trash from "../components/Trash.jsx";
import Settings from "../components/Settings.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

const Home = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const clientId =import.meta.env.VITE_FRONTNED_CLIENT_ID;
  const [active, setActive] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const url = "http://localhost:3000/";
  const [data, setdata] = useState();
  const { dirId } = useParams();
  const [login, setlogin] = useState(false);
  const [uploadfile, setuploadfile] = useState([]);
  const [uploading, setuploading] = useState(false);
  const [foldercdiv, setfoldercdiv] = useState(false);
  const [foldername, setfoldername] = useState("");
  const storageper = (data?.totalSize / (1024 * 1024 * 1024)) * 10;

  async function getdata(value) {
    const res = await fetch(`${url}directory/${dirId || "root"}`, {
      credentials: "include",
      headers: {
        type: value ? value : "null",
      },
    });
    const data = await res.json();
    setdata(data);
    if (!res.ok) {
      navigate("/");
      return;
    }
  }
  async function handleupload(e) {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setuploading(true);

    let completed = 0;

    files.forEach((file) => {
      const id = Date.now() + file.name;

      // Add file to UI
      setuploadfile((prev) => [
        ...prev,
        {
          id,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + "MB",
          progress: 0,
          done: false,
        },
      ]);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("file", file);

      xhr.open("POST", `${url}file/${file.name}`);

      xhr.setRequestHeader("dirid", dirId || "root");
      xhr.setRequestHeader("size", file.size);
      xhr.withCredentials = true; // 🔥 test endpoint
      xhr.send(file);
      // Progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);

          setuploadfile((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: percent } : f)),
          );
        }
      };

      // Done
      xhr.onloadend = () => {
        completed++;

        setuploadfile((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, progress: 100, done: true } : f,
          ),
        );
        getdata(active);

        // ✅ If all files uploaded → close after 2 sec
        if (completed === files.length) {
          setTimeout(() => {
            setuploading(false);
            setuploadfile([]); // optional reset
          }, 2000);
        }
      };
    });
  }
  async function createfolder() {
    const res = await fetch(`${url}directory/${dirId || "root"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        foldername: foldername,
      }),
    });
    setfoldername("");
    getdata(active);
    setfoldercdiv(false);
  }
  async function handledriveimport() {
      if (!tokenClientRef.current) {
    console.log("Google not loaded");
    return;
  }

  tokenClientRef.current.requestAccessToken();
  }
  function createPicker() {
  if (!accessTokenRef.current) return;

  window.gapi.load("picker", () => {
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .addView(window.google.picker.ViewId.FOLDERS)
      .setOAuthToken(accessTokenRef.current)
      .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY) 
      .setCallback(pickerCallback)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .build();

    picker.setVisible(true);
  });
}
async function pickerCallback(data) {
  if (data.action === window.google.picker.Action.PICKED) {
    const files = [];

    for (const doc of data.docs) {
      const file = await importFile(doc);
      if (file) files.push(file);
    }

    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      };

      handleupload(fakeEvent); // ✅ only once
    }
  }
}
async function importFile(doc) {
  try {
    const fileId = doc.id;
    let fileName = doc.name;
    const mimeType = doc.mimeType;

    let url;

    if (mimeType.includes("google-apps")) {
      url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
    } else {
      url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessTokenRef.current}`,
      },
    });

    const blob = await res.blob();

    // 🔥 EXTENSION FIX (expanded)
    if (!fileName.includes(".")) {
      const type = blob.type;

      // 📄 Documents
      if (type === "application/pdf") fileName += ".pdf";
      else if (type === "text/plain") fileName += ".txt";

      // 🖼️ Images
      else if (type === "image/png") fileName += ".png";
      else if (type === "image/jpeg") fileName += ".jpg";
      else if (type === "image/webp") fileName += ".webp";
      else if (type === "image/gif") fileName += ".gif";

      // 🎬 Videos
      else if (type === "video/mp4") fileName += ".mp4";
      else if (type === "video/webm") fileName += ".webm";
      else if (type === "video/x-matroska") fileName += ".mkv";
      else if (type === "video/quicktime") fileName += ".mov";
      else if (type === "video/x-msvideo") fileName += ".avi";

      // 🎵 Audio
      else if (type === "audio/mpeg") fileName += ".mp3";
      else if (type === "audio/wav") fileName += ".wav";
      else if (type === "audio/ogg") fileName += ".ogg";
      else if (type === "audio/aac") fileName += ".aac";
      else if (type === "audio/flac") fileName += ".flac";

      // 🗜️ Archives
      else if (type === "application/zip") fileName += ".zip";
      else if (type === "application/x-rar-compressed") fileName += ".rar";
      else if (type === "application/x-7z-compressed") fileName += ".7z";

      // 💻 Code / JSON
      else if (type === "application/json") fileName += ".json";
      else if (type === "text/html") fileName += ".html";
      else if (type === "text/css") fileName += ".css";
      else if (type === "application/javascript") fileName += ".js";

      // ❓ Fallback
      else fileName += ".bin";
    }

    const file = new File([blob], fileName, {
      type: blob.type,
    });

    return file;

  } catch (err) {
    console.log("Import error:", err);
    return null;
  }
}
  useEffect(() => {
  if (window.google) {
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      callback: (response) => {
        accessTokenRef.current = response.access_token;
        createPicker(); // open picker after auth
      },
    });
  }
}, []);
  useEffect(() => {
    getdata(active);
  }, [dirId]);
  useEffect(() => {
    localStorage.setItem("activeTab", active);
  }, [active]);
  return (
    <>
      <div className=" w-screen h-screen bg-[#FFFFFF] flex">
        <div className="left w-57.5 h-screen border-r border-[#EBEAEA] p-3">
          <div className="logo flex gap-2 h-18 items-center  font-bold pl-5">
            <div className="">
              <img src="/logo.png" className="w-6 h-6"></img>
            </div>
            CloudVault
          </div>
          <div className="btn flex flex-col gap-2 ">
            <button className="w-full hover:scale-98 transition-all cursor-pointer h-9 bg-[#4A4D4A] text-white rounded-[9px] flex items-center justify-center gap-3 text-[12.5px] font-bold">
              <label
                htmlFor="uploadinput"
                className="w-full h-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>{" "}
                Upload Files
              </label>
            </button>
            <input
              type="file"
              hidden
              id="uploadinput"
              onChange={(e) => {
                handleupload(e);
              }}
              multiple
            ></input>
            <button
              className="  cursor-pointer  w-full h-9 border hover:bg-[#EBEAEA] hover:border-black  border-[#b9b7b7] rounded-[9px] flex items-center justify-center gap-3 text-[12.5px]"
              onClick={() => {
                setfoldercdiv(true);
              }}
            >
              <img src="/folderwithfile.png" className="w-5 h-5"></img>
              New Folder
            </button>
            <button
              className="  cursor-pointer   w-full h-9 border hover:bg-[#EBEAEA] hover:border-black  border-[#b9b7b7] rounded-[9px] flex items-center justify-center gap-3 text-[12.5px]"
              onClick={() => {
                handledriveimport();
              }}
            >
              <img src="/google-drive.png" className="w-5 h-5"></img>
              Import From Drive
            </button>
          </div>
          <h6 className="text-[10px] text-[#898a89] tracking-[1.6px] font-semibold mt-6 mb-1">
            NAVIGATION
          </h6>
          <div className="navigation ">
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "dashboard" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("dashboard");
                getdata("dashboard");
              }}
            >
              {" "}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="blue"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <path d="M9 22V12h6v10"></path>
              </svg>{" "}
              Dashboard
            </button>
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "My Files" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("My Files");
                getdata();
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>{" "}
              My Files
            </button>
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "Recent" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("Recent");
                getdata("Recent");
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>{" "}
              Recent
            </button>
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "Favorites" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("Favorites");
                getdata("Favorites");
              }}
            >
              {" "}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="orange"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>{" "}
              Favorites
            </button>
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "Shared" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("Shared");
              }}
            >
              {" "}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563EB"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <path d="M16 6l-4-4-4 4"></path>
                <path d="M12 2v13"></path>
              </svg>{" "}
              Shared
            </button>
          </div>
          <h6 className="text-[10px] text-[#898a89] tracking-[1.6px] font-semibold mt-6 mb-1">
            SYSTEM
          </h6>
          <div className="navigation2 ">
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "Trash" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("Trash");
                getdata("Trash");
              }}
            >
              {" "}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>{" "}
              Trash
            </button>
            <button
              className={`w-full h-9 transition-colors cursor-pointer ${active === "Settings" ? "bg-[#EBEAEA] border border-[#ababab]" : "bg-white"}  hover:bg-[#EBEAEA] rounded-[9px] flex items-center  gap-3 text-[12.5px]  pl-3`}
              onClick={() => {
                setActive("Settings");
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>{" "}
              Settings
            </button>
          </div>
          <div className="storagecapacity w-full h-28 bg-[#F4F3F3] border border-[#cdcccc] rounded-xl mt-38 p-2 flex flex-col gap-2">
            <div className="w-full  flex items-center justify-between">
              <h1 className="text-[11px]">Storage</h1>
              <h6 className="text-[12px] font-bold">
                {storageper.toFixed(2)}%
              </h6>
            </div>
            <div className="w-full h-2 bg-[#E0DFDF] rounded-3xl overflow-hidden">
              <div
                className={`progress  h-full bg-[#4CA4E6] rounded-2xl`}
                style={{ width: `${storageper}%` }}
              ></div>
            </div>
            <div className="">
              <h1 className="text-[11px] opacity-70">
                {(data?.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB of 10
                GB used
              </h1>
            </div>
            <div className="w-full h-9 bg-[#707270] hover:bg-[#2E302E] transition-colors rounded-lg flex items-center justify-center text-white cursor-pointer">
              <h1 className="text-[12px] font-bold">✨Upgrade to Pro</h1>
            </div>
          </div>
        </div>
        <div className="right w-[85vw]">
          <Navbar data={data} getdata={getdata} url={url} />

          <div className="">
            {active === "dashboard" && (
              <Dashboard
                url={url}
                data={data}
                getdata={getdata}
                active={active}
                setActive={setActive}
              />
            )}
            {active === "My Files" && (
              <MyFiles
                url={url}
                data={data}
                getdata={getdata}
                active={active}
              />
            )}
            {active === "Recent" && (
              <Recent
                url={url}
                data={data}
                getdata={getdata}
                active={active}
                setActive={setActive}
              />
            )}
            {active === "Favorites" && (
              <Favorites
                url={url}
                data={data}
                getdata={getdata}
                active={active}
              />
            )}
            {active === "Shared" && <Shared />}
            {active === "Trash" && (
              <Trash url={url} data={data} getdata={getdata} active={active} />
            )}
            {active === "Settings" && <Settings />}
          </div>
        </div>

        {uploading && (
          <div className="uploading w-[20vw] border bg-white border-[#c8c7c7]  absolute bottom-5 right-5 rounded-2xl overflow-hidden">
            <div className="w-full h-16 border-b-2 border-[#cfcfcf] flex items-center justify-between p-4">
              <h1 className="text-[14px]">Uploading Files</h1>
              <div
                className="w-9 h-9 bg-[#dbdada] rounded-xl flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setuploading(false);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <div className="p-2">
              {uploadfile.map((file) => {
                return (
                  <div
                    key={file.id}
                    className="w-full h-16 border-b border-[#b7b4b4] p-2 flex flex-col gap-1"
                  >
                    <div className="text-[12px] flex w-full justify-between">
                      <h1 className="text-[10px] ">{file.name}</h1>
                      <h1>{file.size}</h1>
                    </div>

                    <div className="w-full h-2 bg-[#EBEAEA] rounded">
                      <div
                        className="h-full bg-green-400 rounded"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>

                    <div className="w-full text-[11px] flex justify-between">
                      <h1>{file.progress}%</h1>
                      <h1>{file.done ? "✔️ done" : "Uploading..."}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div
          className={`foldercreate w-screen h-screen backdrop-blur-[2px] bg-[#0000003b] z-10 absolute top-0 left-0 ${foldercdiv ? "flex" : "hidden"} items-center justify-center`}
          onClick={() => {
            setfoldername("");
            setfoldercdiv(false);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createfolder();
            }}
          >
            <div
              className="w-[27vw] h-[35vh] bg-white border rounded-[7px] flex flex-col justify-evenly border-[#b0b0b0] shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-6"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="w-full h-16  flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded bg-[#DFF0F8] flex items-center justify-center border border-[#b0b0b0]">
                    📁
                  </div>
                  <h1 className="text-[18px]">Create New Folder</h1>
                </div>
                <div className="">
                  <div
                    className="w-9 h-9 bg-[#dbdada] rounded-[7px] flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setfoldername("");
                      setfoldercdiv(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.9"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <input
                type="text"
                className="w-full h-13 bg-[#e7ecef] border-2 border-[#b0b0b0]  outline-none p-2 rounded"
                value={foldername}
                onChange={(e) => {
                  setfoldername(e.target.value);
                }}
              ></input>
              <div className="flex gap-4 pl-23">
                <div
                  className="w-24 h-11 bg-white border hover:bg-[#a9aca9] transition-all border-[#b0b0b0] rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setfoldername("");
                    setfoldercdiv(false);
                  }}
                >
                  cancel
                </div>
                <button
                  className="w-42 h-11  bg-[#707270] hover:bg-[#2E302E]  hover:scale-99 transition-all rounded-lg flex items-center justify-center gap-3 text-white cursor-pointer"
                  type="submit"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    <path d="M12 11v6"></path>
                    <path d="M9 14h6"></path>
                  </svg>{" "}
                  Create Folder
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;

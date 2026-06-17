import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Link, useNavigate } from "react-router";
import { MdOutlineDelete } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import { IoOpenOutline } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const Foldercard = ({
  name,
  id,
  folderrename,
  setoldfoldername,
  setfolderid,
  getdata,
}) => {
  const navigate = useNavigate();
  const url = "http://localhost:3000/";
  const [optionmenu, setoptionmenu] = useState(false);
  async function handledelete() {
    console.log(id);
    const res = await fetch(`${url}directory/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    getdata();
    console.log(data);
  }
  return (
    <>
      <div
        className="w-[12vw] h-[22vh] border border-[#d8d5d5] gap-2 bg-white  rounded flex  items-center justify-center flex-col "
        onDoubleClick={() => {
          window.location.href = `http://localhost:5174/directory/${id}`;
        }}
      >
        <img src="/folderwithfile.png" className="w-[50%] "></img>
        <div className="flex items-center justify-center gap-5 h-9 w-full  ">
          <p className="text-[15px]">{name}</p>
          {/* <p className="text-[10px]">10 files</p> */}
        </div>

        <div
          className=" absolute  top-2 right-2 w-6 h-6 cursor-pointer"
          onClick={() => {
            setoptionmenu(optionmenu ? false : true);
          }}
        >
          {/* <CiMenuBurger />
        <IoMdClose /> */}
          {optionmenu ? <IoMdClose /> : <CiMenuBurger />}
        </div>
        <div
          className={`w-[9vw] h-[7vh] text-black  text-[11px] bg-white fixed left-10 top-7 ${optionmenu ? "block" : "hidden"} rounded-sm overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}
        >
          <div
            className="w-full h-7 p-2  flex items-center justify-between cursor-pointer transition-colors hover:bg-[#EBEAEA]"
            onClick={handledelete}
          >
            delete <MdOutlineDelete />
          </div>
          <div
            className="w-full h-7 p-2  flex items-center justify-between cursor-pointer transition-colors hover:bg-[#EBEAEA]"
            onClick={() => {
              folderrename(true);
              setoldfoldername(name);
              setfolderid(id);
            }}
          >
            rename <MdDriveFileRenameOutline />
          </div>
        </div>
      </div>
    </>
  );
};

export default Foldercard;

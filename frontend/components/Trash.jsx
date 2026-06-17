import React from "react";
import Deletecard from "./Deletecard";

const Trash = ({ url, data, getdata ,active}) => {
  
  return (
    <>
      <div className="w-full h-full  p-4">
        <div className="nav flex w-full items-center justify-between">
          <h1 className="flex gap-5 text-[13px]  items-center text-[#f24545] font-semibold">
           Warning: Items in the Trash are automatically deleted after 30 days and cannot be recovered.
          </h1>
          <button className="text-[12px] w-32 h-10 border border-[#e6a5a5]  bg-rose-50  hover:bg-rose-100 transition-colors flex items-center justify-center text-[red] rounded-xl cursor-pointer font-semibold gap-2"> {" "}
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
          </svg>{" "}Empty Trash</button>
          
        </div>
        <div className="w-full h-[80vh] mt-4 border border-[#a3a3a3] rounded-sm overflow-hidden">
          <div className="header w-full h-14 bg-[#EBEAEA] flex ">
            <div className="w-[25vw] h-full  opacity-70 text-[14px] flex items-center justify-center">NAME</div>
            <div className="w-[18vw] h-full  opacity-70 text-[14px] flex items-center justify-center">ORIGINAL LOCATION</div>
            <div className="w-[15vw] h-full  opacity-70 text-[14px] flex items-center justify-center">DELETED</div>
            <div className="w-[10vw] h-full  opacity-70 text-[14px] flex items-center justify-center">SIZE</div>
            <div className="w-[15vw] h-full  opacity-70 text-[14px] flex items-center justify-center">ACTION</div>
          </div>
          <div className="main w-full h-[73vh] overflow-auto hide-scrollbar ">
            {data?.files.map((el)=>{
              
              return <Deletecard el={el} getdata ={getdata} active={active}/>
            })}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Trash;

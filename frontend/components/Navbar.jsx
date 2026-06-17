import { useState } from "react";
import { FcGoogle } from "react-icons/fc";


const Navbar = ({data,getdata,url}) => {
  const [profilemenu,setprofiloemenu] = useState(false)
  async function handlelogout(){
    const response = await fetch(`${url}user/logout`,{
      method:"POST",
      credentials:"include"
    })
    getdata()
  }

  return (
    <>
      <div className="w-full h-16  border-b border-[#EBEAEA] flex items-center justify-between pl-5 pr-5">
        <div className="relative w-[40vw] h-full  flex items-center">
          <svg
            className="absolute top-5.5 left-3 "
            width="26"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            s
          >
            <path d="M11 11m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0"></path>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search Files..."
            className="w-full h-[70%] pl-10 pr-3 py-2 border border-[#acacac]  rounded-lg outline-none bg-[#F4F3F3] text-[14px]"
          />
        </div>
        
          
          <div className="profile w-10 h-10  rounded-full bg-[#606360] cursor-pointer flex items-center justify-center text-[13px] text-white overflow-hidden" onClick={()=>{
          setprofiloemenu(true)
        }}>
          
          <img src={data?.profilepic} className="w-full h-full" alt="profileimg"></img>
        </div>

        
        
      </div>
      <div className={`profilemenu ${profilemenu?"block":"hidden"} w-screen h-screen  z-2 absolute top-0 left-0`}  onClick={()=>{
          setprofiloemenu(false)
        }}>
        <div className="menu w-56 h-64  absolute top-14 right-10 bg-white border  border-[#acacac] shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl overflow-hidden" onClick={(e)=>{
          e.stopPropagation()
        }}>
          <div className="userdata w-full h-18  flex items-center bg-[#F4F3F3] justify-evenly border-b border-[#acacac] ">
            <div className="">
              <h1 className="text-[12px] font-bold">{data?.username}</h1>
              <h1 className="text-[9px] ">{data?.useremail}</h1>
            </div>
            <div className="profile w-10 h-10 rounded-full bg-[#606360]  flex items-center justify-center text-[13px] text-white overflow-hidden">
              <img src={data?.profilepic} className="w-full h-full" alt="profileimg"></img>
            </div>
          </div>
          <div className="h-32 border-b border-[#acacac]">
            <div className="w-full h-10 flex items-center p-2  hover:bg-[#EBEAEA] transition-colors cursor-pointer text-[13px] gap-2">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
              </svg>
              My profile
            </div>
            <div className="w-full  gap-2 h-10 flex items-center p-2  hover:bg-[#EBEAEA] transition-colors cursor-pointer text-[13px]">
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
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </div>
            <div className="w-full h-10  gap-2 flex items-center p-2  hover:bg-[#EBEAEA] transition-colors cursor-pointer text-[13px]">
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
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              Storage plan
            </div>
          </div>
          <div className="w-full h-13.5  flex bg-rose-50 items-center gap-2 p-2 hover:bg-[#eccfcf] transition-colors cursor-pointer text-[15px] text-[red]" onClick={handlelogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path></svg>
            Sign Out
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import { useCallback, useEffect, useState } from "react";
import "./Header.css";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { BiLogOut, BiPhoneCall } from "react-icons/bi";
import { useAppDispatch } from "../Redux/store";
import { adminLogOut } from "../Redux/slice/AuthSlice";
import { MdOutlineCrueltyFree, MdOutlinePointOfSale, MdOutlinePriceChange } from "react-icons/md";
import { FaLayerGroup, FaRegObjectUngroup, FaUsers } from "react-icons/fa";
import { RiAdminLine, RiDiscountPercentLine } from "react-icons/ri";
import { PiQuestionMarkFill } from "react-icons/pi";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { TbSocial } from "react-icons/tb";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use dispatch hook for Redux actions

  const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth >= 992); // Default state based on screen width

  // Toggle Sidebar
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 992);
    };

    // Add resize event listener to update the sidebar state on window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener on unmount
  }, []);

  const handleLogOut = async () => {
    try {
      // Dispatch the logout action
      await dispatch(adminLogOut());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar sticky top-0 h-screen">
      <div
        className={`${
          isOpen ? "w-52" : "w-20"
        } duration-300 ease-in-out h-screen bg-gray-200 relative overflow-y-auto overflow-x-hidden sidebar transition-all`}
      >
       <div className="flex  items-center gap-2  px-2 py-3 bg-[#0765AA] text-white">
  {/* Sidebar Toggle Button */}
  <button
    onClick={toggleSidebar}
    aria-label="Toggle Sidebar"
    className="flex items-center justify-center focus:outline-none"
  >
    {isOpen ? (
      <IoMdClose className="w-7 h-7" />
    ) : (
      <HiMenuAlt3 className="w-7 h-7" />
    )}
  </button>

  {/* Logo */}
  <div className="bg-[#FFC629] flex items-center justify-center w-[60%] px-3 py-2 rounded-tl-2xl  rounded-br-2xl mx-2 sm:mx-8">
    <img src="/images/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
  </div>
</div>


        <ul className="pt-5 p-4 text-primary">
          <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/admins")}
          >
            <RiAdminLine className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>المشرفين</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/")}
          >
            <FaUsers className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>المستخدمين</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/groups")}
          >
            <FaRegObjectUngroup className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>المجموعات</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/categories")}
          >
            <FaLayerGroup className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>الفئات</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/questions")}
          >
            <PiQuestionMarkFill className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>الأسئلة المعتمدة</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/Posted_questions")}
          >
            <FaFileCircleQuestion className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>الأسئلة المنشورة</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/game")}
          >
            <MdOutlineCrueltyFree className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>اللعبة المجانية</span>
          </li>

           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/prices")}
          >
            <MdOutlinePriceChange className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>باقات الاسعار  </span>
          </li>

           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/discount")}
          >
            <RiDiscountPercentLine className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>  كود خصم</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/sales")}
          >
            <MdOutlinePointOfSale className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>  المبيعات  </span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/salesRecovered")}
          >
            <IoIosAlert className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>    المبيعات المستردة</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/contactus")}
          >
            <BiPhoneCall className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>    اتصل بنا</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/settings")}
          >
            <IoSettingsOutline className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>      الاعدادت</span>
          </li>
           <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={() => navigate("/socialMedia")}
          >
            <TbSocial className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>      التواصل الاجتماعي</span>
          </li>
          
          <li
            className="shadow flex items-center gap-x-2 my-4 p-2 hover:bg-[#0765AA] hover:text-white rounded-md cursor-pointer transition-all"
            onClick={handleLogOut}
          >
            <BiLogOut className="size-6" />  
            <span className={`${isOpen ? "" : "hidden"} text-md`}>تسجيل الخروج</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

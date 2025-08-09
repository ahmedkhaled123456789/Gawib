import { useCallback, useEffect, useState } from "react";
import "./Header.css";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  IoIosAlert,
  IoMdClose,

} from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

import { BiPhoneCall } from "react-icons/bi";
import {
  MdOutlineCrueltyFree,
  MdOutlinePointOfSale,
  MdOutlinePriceChange,
} from "react-icons/md";
import {
  FaLayerGroup,
  FaRegObjectUngroup,
  FaUsers,
  FaFileCircleQuestion,
} from "react-icons/fa6";
import {
  RiAdminLine,
  RiDiscountPercentLine,
} from "react-icons/ri";
import { PiQuestionMarkFill } from "react-icons/pi";
import { TbSocial } from "react-icons/tb";
import { LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth >= 992);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); 
        localStorage.removeItem("user");  

    navigate("/login");
  };
  const menuItems = [
    { icon: <FaUsers className="size-6" />, label: "المستخدمين", path: "/" },
    { icon: <RiAdminLine className="size-6" />, label: "المشرفين", path: "/admins" },
    { icon: <FaRegObjectUngroup className="size-6" />, label: "المجموعات", path: "/groups" },
    { icon: <FaLayerGroup className="size-6" />, label: "الفئات", path: "/categories" },
    { icon: <PiQuestionMarkFill className="size-6" />, label: "الأسئلة المعتمدة", path: "/questions" },
    { icon: <FaFileCircleQuestion className="size-6" />, label: "الأسئلة المنشورة", path: "/Posted_questions" },
    { icon: <MdOutlineCrueltyFree className="size-6" />, label: "اللعبة المجانية", path: "/game" },
    { icon: <MdOutlinePriceChange className="size-6" />, label: "باقات الاسعار", path: "/prices" },
    { icon: <RiDiscountPercentLine className="size-6" />, label: "كود خصم", path: "/discount" },
    { icon: <MdOutlinePointOfSale className="size-6" />, label: "المبيعات", path: "/sales" },
    { icon: <IoIosAlert className="size-6" />, label: "المبيعات المستردة", path: "/salesRecovered" },
    { icon: <BiPhoneCall className="size-6" />, label: "اتصل بنا", path: "/contactus" },
    { icon: <IoSettingsOutline className="size-6" />, label: "الاعدادت", path: "/settings" },
    { icon: <TbSocial className="size-6" />, label: "التواصل الاجتماعي", path: "/socialMedia" },
  ];

  return (
    <div className="sidebar sticky top-0 h-screen">
      <div
        className={`${
          isOpen ? "w-52" : "w-20"
        } h-screen bg-gray-200 relative overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-2 px-2 py-3 bg-[#085E9C] text-white">
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

          <div className="bg-[#FFC629] flex items-center justify-center w-[60%] px-3 py-2 rounded-tl-2xl rounded-br-2xl mx-2 sm:mx-8">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        <ul className="pt-5 px-4 text-primary">
          {menuItems.map((item, index) => (
            <li
              key={index}
 className={`shadow flex items-center gap-x-2 my-4 p-2 rounded-md cursor-pointer transition-all ${
    location.pathname === item.path ? "bg-[#085E9C] text-white" : "hover:bg-[#085E9C] hover:text-white"
  }`}              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className={`${isOpen ? "inline" : "hidden"} text-md`}>
                {item.label}
              </span>
            </li>
          ))}
         <li
      onClick={handleLogout}
      className={`shadow flex items-center gap-x-2 my-4 p-2 rounded-md cursor-pointer transition-all
        hover:bg-[#085E9C] hover:text-white`}
    >
      <LogOut />
      <span className={`${isOpen ? "inline" : "hidden"} text-md`}>خروج</span>
    </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import {
  faArrowLeftFromBracket,
  faHome,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChalkboardUser, faTimes } from "@fortawesome/sharp-light-svg-icons";
import { faAddressCard } from "@fortawesome/sharp-thin-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomUseContext } from "../context/context";

const SideBar = () => {
  const navigate = useNavigate();
  const { logout, loggedInUser } = CustomUseContext();
  const token = sessionStorage.getItem("token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // حالة التحكم في فتح وإغلاق الشريط الجانبي
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // تغيير حالة الشريط الجانبي

  if (!token) return <></>;

  return (
    <div className="sm:block hidden">
    
    <div className={`fixed z-10 ${isSidebarOpen ? "top-20 left-44" : "top-20 bg-blue-500 text-white p-2 pl-2 rounded-r-lg"} `}>
          <button
            onClick={toggleSidebar}
            className=" text-2xl   "
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
          </button>
        </div>
    <div className={`bg-blue-50 border-r px-3 py-6 flex flex-col h-screen  transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "w-52" : "hidden"}  
    
     `}>     
      {/* Logo and App Name */}
      <p className="font-bold text-xl text-blue-600 mb-6">EduConnect</p>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-4 text-lg text-gray-600">
        <li
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 hover:bg-blue-50 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200"
        >
          <FontAwesomeIcon icon={faHome} className="text-blue-600" />
          <span>Landing</span>
        </li>
        <li
          onClick={() => navigate("/home")}
          className="flex items-center space-x-3 hover:bg-blue-50 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200"
        >
          <FontAwesomeIcon icon={faChalkboardUser} className="text-blue-600" />
          <span>Classes</span>
        </li>
        <li
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 hover:bg-blue-50 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200"
        >
          <FontAwesomeIcon icon={faAddressCard} className="text-blue-600" />
          <span>Profile</span>
        </li>
      </div>

      {/* Account Information */}
      <div className="mt-auto pb-16">
        <hr className="w-full border-gray-300 mb-4" />
        <p className="font-semibold text-sm text-gray-500 mb-2">Account</p>
        <div className="text-gray-700 text-sm mb-4">
          <p>Username: {loggedInUser.displayName}</p>
          <p> {sessionStorage.getItem("userRole")}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center space-x-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 rounded-lg transition-all duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeftFromBracket} />
          <span>Logout</span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default SideBar;

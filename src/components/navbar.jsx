import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faScreenUsers, faTimes } from "@fortawesome/sharp-light-svg-icons";
import { Avatar } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomUseContext } from "../context/context";

const NavBar = () => {
  const { loggedInUser, logout } = CustomUseContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="bg-white shadow-md ">
      {/* Main Navbar */}
      <ul className="flex justify-between items-center h-16 px-4 bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Logo and App Name */}
        <li className="flex items-center">
          <p className="text-white text-xl sm:text-2xl font-serif">
            <span className="px-1.5">
              <FontAwesomeIcon icon={faScreenUsers} />
            </span>
            EduConnect
          </p>
        </li>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-white text-2xl focus:outline-none"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6 text-white ">
          <div className="relative flex items-center">
            <button
              className="border border-blue-100/20 bg-blue-700 hover:bg-blue-800/60  text-white py-2 px-5 rounded-lg text-sm transition-all"
              onClick={logout}
            >
              Logout
            </button>
            <div className="ml-4 w-10 h-10 rounded-full border border-blue-500 overflow-hidden">
              <Avatar
                img={loggedInUser?.photoURL}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </ul>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute  right-0 z-30 sm:hidden bg-gradient-to-tr   from-blue-500 to-blue-600 text-white space-y-3 py-4 px-2  rounded-b-md list-none ">
          <li
            className="cursor-pointer py-2 px-3 bg-blue-700 rounded-md hover:bg-blue-600 transition-all "
            onClick={() => {
              navigate("/");
              toggleMenu();
            }}
          >
            Home
          </li>
          <li
            className="cursor-pointer py-2 px-3 bg-blue-700 rounded-md hover:bg-blue-600 transition-all"
            onClick={() => {
              navigate("/home");
              toggleMenu();
            }}
          >
            Classes
          </li>
          <li
            className="cursor-pointer py-2 px-3 bg-blue-700 rounded-md hover:bg-blue-600 transition-all"
            onClick={() => {
              navigate("/profile");
              toggleMenu();
            }}
          >
            Profile
          </li>
          <li
            className="cursor-pointer py-2 px-3 bg-blue-900 rounded-md hover:bg-blue-950 transition-all"
            onClick={() => {
              logout();
              toggleMenu();
            }}
          >
            Logout
          </li>
        </div>
      )}
    </div>
  );
};

export default NavBar;

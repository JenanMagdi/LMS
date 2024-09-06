import {
  faArrowLeftFromBracket,
  faCommentsQuestionCheck,
  faGear,
  faHome,
  faMemoCircleCheck
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/sharp-light-svg-icons";
import { useNavigate } from "react-router-dom";
import { CustomUseContext } from "../context/context";
// import logoV from "../assets/Logo - V.svg";
const SideBar = () => {
  const navigate = useNavigate();
  const {logout} = CustomUseContext();    

  return (
    <div className="  bg-white h-full px-3  flex flex-col ">
      <p className="font-bold text-md text-geant-gray-400 p-3 ">EduConnect</p>
      <div className="pr-5 *:cursor-pointer flex flex-col text-md gap-y-3 *:text-geant-gray-600 *:list-none hover:*:bg-geant-primary-25 hover:*:rounded-lg *:*:pr-3 *:py-1.5 *:pl-3">
        <li onClick={() => navigate("/")} className="pr-16 ">
          <FontAwesomeIcon icon={faHome} />
          Home
        </li>
        <li onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faChalkboardUser } />          
        Classes
        </li>
        <li onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faMemoCircleCheck} />        
        Assignments
        </li>
        <li onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faCommentsQuestionCheck} />          
        quizes
        </li>
      </div>
      <div className=" list-none flex flex-col h-96 pb-10 justify-end *:cursor-pointer">
        <li
          onClick={() => navigate("/")}
          className=" pl-3 *:pr-2 text-geant-gray-600 mb-1"
        >
          <FontAwesomeIcon icon={faGear} />
          Settings
        </li>
        <hr />
        <p className="font-bold text-sm text-geant-gray-200 p-2 ">Account</p>
        <button
          onClick={()=>logout()}
          className="border border-geant-gray-100 hover:bg-geant-red-700 text-red-500
        font-bold py-1.5 w-full rounded-lg *:mr-2 mb-6 "
        >
          <FontAwesomeIcon icon={faArrowLeftFromBracket} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;

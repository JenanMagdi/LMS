import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faScreenUsers } from "@fortawesome/sharp-light-svg-icons";
import { Avatar } from "flowbite-react";
import { CustomUseContext } from "../context/context";

const NavBar = () => {
  const { loggedInUser , logout} = CustomUseContext();
  
  return (
<div className='mx-1 mt-0.5 bg-transparent '>
  <ul className="h-15 bg-blue-500 flex rounded-t-md justify-between p-2 items-center ">
    <li className="flex items-center">
      <p className="text-white text-2xl p-1 font-serif">
      <span className="px-1.5"><FontAwesomeIcon icon={faScreenUsers} /></span>
      EduConnect </p>
    </li>
    
    <div className="flex gap-x-5 cursor-pointer text-white">
    <li className="flex items-center">
      <p >Home</p>
    </li>
    <li className="flex items-center">
      <p >Classes</p>
    </li>
    <li className="flex items-center">
      <p  >Assignments</p>
    </li>
    <li className="flex items-center">
      <p >quizes</p>
    </li>
  
    </div>


    <div className="flex items-center *:*:cursor-pointer">
    <li
          // onClick={() => Navigate("/setting")}
          className="pr-2 text-white text-2xl">
          <FontAwesomeIcon icon={faGear} />
        </li>
    <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-00 rounded-full border-2 border-gray-100 hover:border-gray-300 ">
    <Avatar 
    onClick={()=>logout()} 
    className="rounded"
     img={loggedInUser?.photoURL}   
     />
    </div>
    </div>
  </ul>
</div>
  );
};

export default NavBar;
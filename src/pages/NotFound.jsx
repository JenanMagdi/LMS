import { faArrowLeftFromBracket } from "@fortawesome/pro-light-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/pro-thin-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomUseContext } from "../context/context";

const NotFound = () => {

    const {login,logout} = CustomUseContext();    

    return (
        <div>
            NotFound 
            <button
          onClick={()=>login()}
          className="border border-geant-gray-100 hover:bg-geant-red-700 text-red-500
        font-bold py-1.5 w-full rounded-lg *:mr-2 mb-6 "
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          Logn
        </button>

            <button
          onClick={()=>logout()}
          className="border border-geant-gray-100 hover:bg-geant-red-700 text-red-500
        font-bold py-1.5 w-full rounded-lg *:mr-2 mb-6 "
        >
          <FontAwesomeIcon icon={faArrowLeftFromBracket} />
          Logout
        </button>
        </div>
    );
}

export default NotFound;

import { faPlus } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomUseContext } from "../context/context";

const AddButton = () => {
  const { createClassDialog, setCreateClassDialog } = CustomUseContext();
  const { joinClassDialog, setJoinClassDialog } = CustomUseContext();
  return (
    <div className="fixed top-16 right-6 group ">
      <button
        type="button"
        className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 rounded-full w-10 h-10"
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="w-5 h-5 transition-transform group-hover:rotate-45"
          aria-hidden="true"
        />
      </button>
      <div className="dropdown relative group ">
        <ul className=" dropdown-menu absolute right-0 z-10 w-28 bg-white rounded-lg shadow-md py-2 hidden group-hover:block">
          <li>
            <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
              onClick={() => setJoinClassDialog(!joinClassDialog)}                          >
              Join Class
            </p>
          </li>
          <li>
            <p
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
              onClick={() => setCreateClassDialog(!createClassDialog)}
            >
              Create Class
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddButton;

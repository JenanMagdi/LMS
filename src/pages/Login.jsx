import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomUseContext } from "../context/context"; 
const Login = () => {
  const { login } = CustomUseContext();
  return (
    <div className="bg-gradient-to-t from-blue-200   to-blue-400 h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Welcome to EduConnect
        </h1>
        <p className="text-gray-600 mb-6">
          Sign in to connect with educators, access resources, and achieve your
          learning goals.
        </p>
        <button
          className="relative  bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:bg-blue-700   "
          onClick={login}>
          <FontAwesomeIcon icon={faGoogle} className="text-lg mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

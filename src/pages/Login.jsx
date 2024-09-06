import { CustomUseContext } from "../context/context";
const Login = () => {
    const {login,logout} = CustomUseContext();    
    return (
    <div className=" flex flex-col justify-center items-center h-screen gap-2" >
      <h1>Login</h1>
      <img src="https://i.imgur.com/8ZT6y6B.png" />
      <button className="bg-blue-600 text-white p-2 rounded"
      onClick={()=>login()}>
      Login 
      </button> 
      <button className="bg-blue-600 text-white p-2 rounded"
      onClick={()=>logout()}>
      Logout
      </button> 
    </div>
  );
};

export default Login;

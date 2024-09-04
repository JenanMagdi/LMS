// const Login = () => {

//   return (
//     <div className=" w-full h-full flex justify-center items-center min-w-fit mt-8 flex-wrap ">

// <div className="m-5 w-80 flex  rounded-lg border-2 border-indigo-300 bg-indigo-200 bg-gradient-to-tl justify-center flex-col items-center p-5">
// <form className="max-w-sm mx-auto">
//         <div className="mb-5">
//             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
//             <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
//         </div>
//         <div className="mb-5">
//             <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
//             <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
//         </div>
//         <div className="flex items-start mb-5">
//             <div className="flex items-center h-5">
//             <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
//             </div>
//             <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
//         </div>
//         <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
//         </form>

//         </div>
//         </div>
//       );
// };


  
// export default Login;

// import { useState } from 'react';

// export const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
  
//     const handleLogin = () => {
//       Login(email, password)
//         .then(() => alert('Logged in!'))
//         .catch((err) => alert(err.message));
//     };
  
//     return (
//       <div className="p-6">
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
//         <button onClick={handleLogin} className="bg-blue-500 text-white">Login</button>
//       </div>
//     );
//   };
  
const Login=() =>{
  return (
    <div className="p-6">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin} className="bg-blue-500 text-white">Login</button>
   </div>
  )
}

export default Login

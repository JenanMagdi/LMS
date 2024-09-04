// // const Signup = () => {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="m-5 w-80 flex rounded-lg border-2 border-indigo-300 bg-indigo-200 bg-gradient-to-tl justify-center flex-col items-center p-5">
// //           <form className=" w-80 flex flex-col p-6">
// //             <InputField label="Email address" type="email" required />
// //             <InputField label="Password" type="password" required />
// //             <InputField label="Confirm password" type="password" required />
// //             <div className="flex">
// //               <InputField label="First name" type="text" required />
// //               <InputField label="Last name" type="text" required />
// //             </div>
// //             <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
// //           </form>
// //         </div>
// //       </div>
// //     );
// //   };
  
// //   const InputField = (props) => {
// //     return (
// //       <div className="relative z-0 w-full mb-5 ">
// //         <input
// //           // eslint-disable-next-line react/prop-types
// //           type={props.type}
          
// //           // eslint-disable-next-line react/prop-types
// //           required={props.required}
// //           className="block py-2.5 rounded-lg  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
// //           placeholder=" "
// //         />
// //         <label
// //           className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
// //         >
        
// //           { 
// //           // eslint-disable-next-line react/prop-types
// //           props.label
// //           }
// //         </label>
// //       </div>
// //     );
// //   };
  
// //   export default Signup;
// import { auth, db } from '../lib/Firebase';

// export const SignUp = (email, password, role) => {
//   return auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
//     const userId = userCredential.user.uid;
//     return db.collection('users').doc(userId).set({
//       email: email,
//       role: role,
//       enrolledCourses: [],
//       teachingCourses: []
//     });
//   });
// };

// export const Login = (email, password) => {
//   return auth.signInWithEmailAndPassword(email, password);
// };

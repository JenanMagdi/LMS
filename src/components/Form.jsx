import { DialogActions } from '@mui/material';
import { useRef } from 'react';

function Form() {
  const Class_Name = useRef([]);
  const Section = useRef([]);
  const Subject = useRef([]);
  const Room = useRef([]);

  return (
    <div className="px-8 py-6 bg-white rounded-lg shadow-lg w-full">
      <p className="font-bold text-2xl mb-6 text-center">Create Class</p>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Class Name</label>
          <input
            type="text"
            id="Class_Name"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={Class_Name}
          />
        </div>

        <div>
          <label className="font-semibold">Section</label>
          <input
            type="text"
            id="Section"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={Section}
          />
        </div>

        <div>
          <label className="font-semibold">Subject</label>
          <input
            type="text"
            id="Subject"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={Subject}
          />
        </div>

        <div>
          <label className="font-semibold">Room</label>
          <input
            type="text"
            id="Room"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={Room}
          />
        </div>
      </div>

      <DialogActions className="mt-6 justify-center">
        <button
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition"
        >
          Create
        </button>
      </DialogActions>
    </div>
  );
}

export default Form;












// import { DialogActions } from "@mui/material"
// import { useRef } from "react"

// function Form() {
//     const Class_Name = useRef([])
//     const Section = useRef([])
//     const Subject = useRef([])
//     const Room = useRef([])
//   return (
//     <div  className="px-5">
//       <p  className="font-bold text-2xl">Create Class</p>
//       <div className="flex flex-col ">
//     <label className='font-bold  mt-5'>Class Name</label>
//     <input
//         type= "text"
//         id= "Class_Name"
//         className= " h-10 rounded-lg border border-geant-gray-200 w-80 p-1"
//         ref={Class_Name}
        
//         />
//     <label className='font-bold  mt-5'>Section</label>
//     <input
//         type= "text"
//         id= "Section"
//         className= " h-10 rounded-lg border border-geant-gray-200 w-full p-3"
//         ref={Section}
//         />
//     <label className='font-bold  mt-5'>Subject</label>
//     <input
//         type="text"
//         id="Subject"
//         className=" h-10 rounded-lg border border-geant-gray-200 w-full p-3"
//         ref={Subject}
//         />
//     <label className='font-bold  mt-5'>Room</label>
//     <input
//         type="text"
//         id="Room"
//         className=" h-10 rounded-lg border border-geant-gray-200 w-full p-3"
//         ref={Room}/> 
//         </div>

//         <DialogActions>
//             <button
//              className='bg-blue-500 p-2 rounded-md text-white autoFocus'
//                 disabled={''}
//                 // onClick={() => setShowForm(true)}
//               >

//                 Create
//               </button>
//         </DialogActions>
//         </div>
        
//   )
// }

// export default Form

import { DialogActions } from "@mui/material"
import { useRef } from "react"

function Form() {
    const Class_Name = useRef([])
    const Section = useRef([])
    const Subject = useRef([])
    const Room = useRef([])
  return (
    <div  className="px-5">
      <p  className="font-bold text-2xl">Create Class</p>
      <div className="flex flex-col ">
    <label className='font-bold  mt-5'>Class Name</label>
    <input
        type= "text"
        id= "Class_Name"
        className= " h-10 rounded-lg border border-geant-gray-200 w-80 p-1"
        ref={Class_Name}
        
        />
    <label className='font-bold  mt-5'>Section</label>
    <input
        type= "text"
        id= "Section"
        className= " h-10 rounded-lg border border-geant-gray-200 w-full p-3"
        ref={Section}
        />
    <label className='font-bold  mt-5'>Subject</label>
    <input
        type="text"
        id="Subject"
        className=" h-10 rounded-lg border border-geant-gray-200 w-full p-3"
        ref={Subject}
        />
    <label className='font-bold  mt-5'>Room</label>
    <input
        type="text"
        id="Room"
        className=" h-10 rounded-lg border border-geant-gray-200 w-full p-3"
        ref={Room}/> 
        </div>

        <DialogActions>
            <button
             className='bg-blue-500 p-2 rounded-md text-white autoFocus'
                disabled={''}
                // onClick={() => setShowForm(true)}
              >

                Create
              </button>
        </DialogActions>
        </div>
        
  )
}

export default Form

import { DialogActions } from '@mui/material';
import { collection, doc, setDoc } from 'firebase/firestore'; // استيراد Firebase Firestore بشكل صحيح
import { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { CustomUseContext } from '../../context/context';
import { db } from '../../lib/Firebase';

function Form() {
  const className = useRef(null);
  const section = useRef(null);
  const subject = useRef(null);
  const room = useRef(null);
  const { loggedInMail, setCreateClassDialog } = CustomUseContext();

  const addClass = async (e) => {
    e.preventDefault();
    const id = uuidV4();

    const classData = {
      owner: loggedInMail,
      className: className.current.value,
      section: section.current.value,
      subject: subject.current.value,
      room: room.current.value,
      id: id,
    };

    try {
      await setDoc(doc(collection(db, "CreatedClasses", loggedInMail, "classes"), id), classData);
      setCreateClassDialog(false);
    } catch (error) {
      console.error("Error adding class: ", error);
    }
  };

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
            ref={className}
          />
        </div>

        <div>
          <label className="font-semibold">Section</label>
          <input
            type="text"
            id="Section"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={section}
          />
        </div>

        <div>
          <label className="font-semibold">Subject</label>
          <input
            type="text"
            id="Subject"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={subject}
          />
        </div>

        <div>
          <label className="font-semibold">Room</label>
          <input
            type="text"
            id="Room"
            className="h-10 rounded-lg border border-gray-300 w-full p-2 mt-1 focus:outline-none focus:border-blue-500"
            ref={room}
          />
        </div>
      </div>

      <DialogActions className="mt-6 justify-center">
        <button
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition"
          onClick={addClass}
        >
          Create
        </button>
      </DialogActions>
    </div>
  );
}

export default Form;






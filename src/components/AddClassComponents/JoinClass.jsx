import { Close } from "@mui/icons-material";
import { Button, Dialog, Slide, TextField } from "@mui/material";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { Avatar } from "flowbite-react";
import React, { useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db } from "../../lib/Firebase";

// eslint-disable-next-line react/display-name
const Transaction = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const JoinClass = () => {
  const { joinClassDialog, setJoinClassDialog, loggedInUser, logout, setJoinedClasses } = CustomUseContext();
  const [classId, setClassId] = useState("");
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!classId) {
      setError("Class ID is required.");
      return;
    }
  
    try {
      const classRef = doc(db, "classes", classId);
      const classDoc = await getDoc(classRef);
  
      if (classDoc.exists()) {
        const classData = classDoc.data();
        const studentEmail = loggedInUser.providerData[0].email;
  
        if (classData.createdBy !== studentEmail) {
          // Update the student list in the `classes` collection
          await updateDoc(classRef, {
            students: [...(classData.students || []), studentEmail]
          });
  
          // Update the student's class in `ClassesJoinedByUser`
          await setDoc(
            doc(db, "ClassesJoinedByUser", studentEmail, "classes", classId),
            classData
          );
  
          // Optionally update `ClassesCreatedByUser` (if necessary)
          const createdClassesRef = collection(
            db,
            "ClassesCreatedByUser",
            classData.createdBy,
            "classes"
          );
          const createdClassDoc = await getDoc(doc(createdClassesRef, classId));
          if (createdClassDoc.exists()) {
            await updateDoc(doc(createdClassesRef, classId), {
              students: [...(createdClassDoc.data().students || []), studentEmail]
            });
          }
  
          // Refresh joined classes state
          const joinedClassesSnapshot = await getDocs(
            collection(db, "ClassesJoinedByUser", studentEmail, "classes")
          );
          const joinedClassesData = joinedClassesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setJoinedClasses(joinedClassesData);
          setJoinClassDialog(false);
        } else {
          setError("You cannot join a class that you own.");
        }
      } else {
        setError("Class not found.");
      }
    } catch (error) {
      console.error("Error joining class:", error);
      setError("An error occurred while joining the class.");
    }
  };
  
  return (
    <Dialog open={joinClassDialog} onClose={() => setJoinClassDialog(false)} TransitionComponent={Transaction}>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-between w-full mb-6">
          <p className="text-2xl font-semibold">Join Class</p>
          <Close className="cursor-pointer" onClick={() => setJoinClassDialog(false)} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <p className="text-sm text-gray-600 mb-4">You are currently signed in as {loggedInUser?.providerData[0].email}</p>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar img={loggedInUser?.photoURL} rounded />
            <div>
              <div className="font-semibold text-lg">{loggedInUser?.displayName}</div>
              <div className="text-gray-500">{loggedInUser?.providerData[0].email}</div>
            </div>
          </div>
          <Button variant="outlined" color="primary" fullWidth onClick={logout}>Logout</Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mt-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Class ID</div>
          <p className="text-sm text-gray-500 mb-4">Enter the class ID provided by your teacher.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              id="outlined-basic"
              label="Class ID"
              variant="outlined"
              fullWidth
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join'}
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinClass;
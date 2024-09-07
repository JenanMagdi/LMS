import { Close } from "@mui/icons-material";
import { Button, Dialog, Slide, TextField } from "@mui/material";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Avatar } from "flowbite-react";
import React, { useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db } from "../../lib/Firebase";
import { createNotification } from '../../lib/notifications';

const Transaction = React.forwardRef(function Transaction(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function JoinClass() {
  const { joinClassDialog, setJoinClassDialog, loggedInUser, logout, setJoinedClasses 
   } = CustomUseContext();

  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [joinedData, setJoinedData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !classCode) {
      console.error("Class code or email is undefined.");
      setError(true);
      return;
    }
    try {
      const classRef = doc(db, "CreatedClasses", email, "classes", classCode);
      const classDoc = await getDoc(classRef);
  
      if (classDoc.exists()) {
        const classData = classDoc.data();
        if (classData.owner !== loggedInUser.providerData[0].email) {
          setJoinedData(classData);
          setError(false);
   
  
          if (loggedInUser && loggedInUser.providerData[0].email) {
            const joinedClassRef = doc(db, "JoinedClasses", loggedInUser.providerData[0].email, "classes", classCode);
            await setDoc(joinedClassRef, classData);
  
           

            
            // Update the joinedClasses state in Context
            const joinedClassesQuerySnapshot = await getDocs(collection(db, 'JoinedClasses', loggedInUser.providerData[0].email, 'classes'));
            const joinedClassesData = joinedClassesQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJoinedClasses(joinedClassesData);
  

            await createNotification(
              classData.owner,
              `${loggedInUser.displayName} has joined your class ${classData.className}.`,
              loggedInUser.displayName,
              loggedInUser.photoURL
            );
            console.log("Class successfully added to JoinedClasses.");
            setJoinClassDialog(false);
          } else {
            console.error("Error: loggedInUser.email is null or undefined.");
            setError(true);
          }
        } else {
          console.error("You cannot join a class that you own.");
          setError(true);
        }
      } else {
        console.error("Class not found.");
        setError(true);
      }
    } catch (error) {
      console.error("Error joining class:", error);
      setError(true);
    }
  };
  
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();  
  //   if (!email || !classCode || email === undefined || classCode === undefined) {
  //     console.error("Class code or email is undefined.");
  //     setError(true);
  //     return;
  //   }
  //   try {
  //     console.log("Attempting to access document path: CreatedClasses/" + email + "/classes/" + classCode);
  //       const classRef = doc(db, "CreatedClasses", email, "classes", classCode);
  //       const classDoc = await getDoc(classRef);
  
  //     if (classDoc.exists()) {
  //       const classData = classDoc.data();
  //       console.log(classData);
        
  //       //insure the user iis not the class creator
  //      if (classData.owner !== loggedInUser.providerData[0].email) {
  //         setJoinedData(classData);
  //         setError(false);
  

  //         if (loggedInUser && loggedInUser.providerData[0].email) {
  //           const joinedClassRef = doc(db, "JoinedClasses", loggedInUser.providerData[0].email, "classes", classCode);
  //           await setDoc(joinedClassRef, classData);
  //           console.log("Class successfully added to JoinedClasses.");
  //           setJoinClassDialog(false);
  //         } else {
  //           console.error("Error: loggedInUser.email is null or undefined.");
  //           setError(true);
  //         }
  //         const joinedClassRef = doc(db, "JoinedClasses",loggedInUser.providerData[0].email, "classes", classCode);
  //         await setDoc(joinedClassRef, classData);
  
  //         console.log("Class successfully added to JoinedClasses.");
  //         setJoinClassDialog(false);
  //       } else {
  //         console.error("You cannot join a class that you own.");
  //         setError(true);
  //       }
  
  //     } else {
  //       console.error("Class not found.");
  //       setError(true);
  //     }
  //   } catch (error) {
  //     console.error("Error joining class:", error);
  //     setError(true);
  //   }
  // };
  
  return (
    <div>
      <Dialog
        fullScreen
        open={joinClassDialog}
        onClose={() => setJoinClassDialog(false)}
        TransitionComponent={Transaction}
      >
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-2xl font-semibold">Join Class</h2>
            <Close className="cursor-pointer" onClick={() => setJoinClassDialog(false)} />
          </div>

          {/* User Info */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
            <p className="text-sm text-gray-600 mb-4">
              You are currently signed in as {loggedInUser?.providerData[0].email}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar img={loggedInUser?.photoURL} rounded />
              <div>
                <div className="font-semibold text-lg">{loggedInUser?.displayName}</div>
                <div className="text-gray-500">{loggedInUser?.providerData[0].email}</div>
              </div>
            </div>
            <Button variant="outlined" color="primary" fullWidth onClick={() => logout()}>
              Logout
            </Button>
          </div>

          {/* Join Class Form */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mt-6">
            <div className="text-lg font-semibold text-gray-700 mb-2">Class Code</div>
            <p className="text-sm text-gray-500 mb-4">
              Ask your teacher for the class code, then enter it here.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                id="outlined-basic"
                label="Class Code"
                variant="outlined"
                fullWidth
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                error={error}
                helperText={error && "No class was found or you are the owner."}
              />
              <TextField
                id="outlined-basic"
                label="Owner's email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Join
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default JoinClass;

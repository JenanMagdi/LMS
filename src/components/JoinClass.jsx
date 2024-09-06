import { Close } from "@mui/icons-material";
import { Button, Dialog, Slide, TextField } from "@mui/material";
import { Avatar } from "flowbite-react";
import React, { useState } from "react";
import { CustomUseContext } from "../context/context";
import { db } from "../lib/Firebase";

const Transaction = React.forwardRef(function Transaction(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function JoinClass() {
  const { joinClassDialog, setJoinClassDialog, loggedInUser ,logout} = CustomUseContext();

  const [classCode, setClassCode] = useState("");
  const [email, setemail] = useState("");
  const [error, setError] = useState();
  const [joinedData, setJoinedData] = useState();
  const [classExists, setClassExists] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("CreatedClasses")
      .doc(email)
      .collection("classes")
      .doc(classCode)
      .get()
      .then((doc) => {
        if (doc.exists && doc.owner !== loggedInUser.email) {
          setClassExists(true);
          setJoinedData(doc.data());
          setError(false);
        } else {
          setError(true);
          setClassExists(false);
          return;
        }
      });

    if (classExists === true) {
      db.collection("JoinedClasses")
        .doc(loggedInUser.email)
        .collection("classes")
        .doc(classCode)
        .set({
          joinedData,
        })
        .then(() => {
          setJoinClassDialog(false);
        });
    }
  };

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
            <Button variant="outlined" color="primary" fullWidth onClick={()=>logout()}>
              Logout
            </Button>
          </div>
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
                helperText={error && "No class was found"}
              />
              <TextField
                id="outlined-basic"
                label="Owner's email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                variant="contained"
                color="primary"
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

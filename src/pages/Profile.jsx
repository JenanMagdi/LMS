import { Avatar, Button, TextField } from '@mui/material';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from 'react';
import { CustomUseContext } from '../context/context';
import { auth, storage } from "../lib/Firebase";

function Profile() {
  const { loggedInUser, setLoggedInUser, loggedInMail } = CustomUseContext();
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState(loggedInMail || '');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.displayName || '');
      setPhotoURL(loggedInUser.photoURL || '');
    }
  }, [loggedInUser]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProfileUpdate = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently signed in.");
      return;
    }

    try {
      let newPhotoURL = photoURL;

      if (file) {
        const storageRef = ref(storage, 'profile_images/' + currentUser.uid);
        await uploadBytes(storageRef, file);
        newPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(currentUser, { displayName: name, photoURL: newPhotoURL });
      console.log("Profile updated successfully");

      setLoggedInUser({ ...currentUser, displayName: name, photoURL: newPhotoURL });
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className=" max-w-2xl mx-auto min-h-screen  flex flex-col justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 ">
        <div className="flex flex-col items-center mb-6">
          <Avatar
            src={photoURL}
            sx={{ width: 120, height: 120 }}
            className="w-28 h-28 border-2 border-blue-500 mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{name ? `${name}'s Profile` : "Profile"}</h1>
          <p className="text-gray-600 text-sm">{email}</p>
        </div>
        <div className="space-y-4">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-base"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '1rem',
              },
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            disabled
            className="text-base"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '1rem',
              },
            }}
          />
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-input"
              className="hidden"
            />
            <label htmlFor="file-input">
              <Button variant="outlined" component="span" className="w-full">
                Upload Profile Picture
              </Button>
            </label>
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProfileUpdate}
            className="py-2"
          >
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

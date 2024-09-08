
import { Avatar, Button, TextField } from '@mui/material';
import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import Notifications from '../components/Notifications';
import { CustomUseContext } from '../context/context';

function Profile() {
  const { loggedInUser, setLoggedInUser ,loggedInMail } = CustomUseContext();
  const [name, setName] = useState(loggedInUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(loggedInUser?.photoURL || '');
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState(loggedInMail || '');

  const handleProfileUpdate = async () => {
    if (!loggedInUser) return;
    try {
      await updateProfile(loggedInUser, { displayName: name, photoURL });
      setLoggedInUser({ ...loggedInUser, displayName: name, photoURL });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">{name}&apos;s Profile</h1>
        <div className="flex items-center justify-center mb-6">
          <Avatar src={photoURL} sx={{ width: 80, height: 80 }} />
        </div>
        <div className="space-y-4">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            disabled
          />
          <TextField
            label="Profile Picture URL"
            variant="outlined"
            fullWidth
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleProfileUpdate}
          >
            Update Profile
          </Button>
        </div>
      
        
      </div>
      <div className="max-w-4xl mx-auto my-5 bg-white shadow-md rounded-lg p-6">
      <Notifications/>      
      </div>

    </div>
  );
}

export default Profile;

/* eslint-disable react/prop-types */
// src/components/Assignments/AddAssignmentDialog.jsx
import { Button, Dialog, TextField } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from '../lib/Firebase';
 // تأكد من إضافة Firebase Storage

const AddAssignmentDialog = ({ open, handleClose, handleAddAssignment }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    let fileUrl = '';
    if (file) {
      const storageRef = ref(storage, `assignments/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }

    const newAssignment = {
      title: assignmentTitle,
      dueDate,
      file: file ? { name: file.name, url: fileUrl } : null,
    };

    handleAddAssignment(newAssignment);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold">Add New Assignment</h2>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Assignment Title" 
          value={assignmentTitle} 
          onChange={(e) => setAssignmentTitle(e.target.value)} 
        />
        <TextField 
          fullWidth 
          margin="normal" 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
        />
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
          className="mt-4"
        >
          Add Assignment
        </Button>
      </div>
    </Dialog>
  );
};

export default AddAssignmentDialog;

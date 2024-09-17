import { Button, Dialog, DialogActions, Slide, TextField } from '@mui/material';
import { collection, doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid'; // استيراد nanoid من المكتبة
import React, { useState } from 'react';
import { CustomUseContext } from '../../context/context';
import { db } from '../../lib/Firebase';

// eslint-disable-next-line react/display-name
const Transaction = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function CreateForm() {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { loggedInMail, setCreateClassDialog, createClassDialog } = CustomUseContext();

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className || !section) {
      setError("All fields are required.");
      return;
    }

    const classId = nanoid(6); 
    const classData = {
      name: className,
      section: section,
      description : description,
      code: classId, 
      createdBy: loggedInMail,
      students: [],
    };

    try {
      // إضافة بيانات الكلاس إلى مجموعة الكلاسات العامة
      await setDoc(doc(collection(db, "classes"), classId), classData);

      // إضافة بيانات الكلاس إلى مجموعة الكلاسات التي أنشأها المستخدم
      await setDoc(doc(db, "ClassesCreatedByUser", loggedInMail, "classes", classId), classData);

      setCreateClassDialog(false); // إغلاق الحوار عند النجاح
    } catch (error) {
      console.error("Error creating class: ", error);
      setError("An error occurred while creating the class.");
    }
  };

  return (
    <Dialog open={createClassDialog} onClose={() => setCreateClassDialog(false)} TransitionComponent={Transaction}>
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Class</h2>
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <TextField
              label="Class Name"
              variant="outlined"
              fullWidth
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              error={!!error}
              helperText={error}
              required
            />
          </div>
          <div>
            <TextField
              label="Section"
              variant="outlined"
              fullWidth
              value={section}
              onChange={(e) => setSection(e.target.value)}
              error={!!error}
              helperText={error}
              required
            />
          </div>
          <div>
            <TextField
              label="description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </div>
          <DialogActions className="mt-6 justify-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  );
}

export default CreateForm;

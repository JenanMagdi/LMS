import { Checkbox, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import Form from '../components/Form';
import { CustomUseContext } from '../context/context';

const CreateClass = () => {
  const { createClassDialog, setCreateClassDialog } = CustomUseContext();
  const [checked, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Dialog
        onClose={() => setCreateClassDialog(false)}
        open={createClassDialog}
        fullWidth
        maxWidth="sm"  // ضبط حجم النافذة
      >
        {showForm ? (
          <div  >
            <Form />
          </div>
        ) : (
          <div className="p-6 bg-white rounded-md shadow-lg">
            <DialogContent>
              <p className="font-bold text-2xl text-center mb-4">Welcome to EduConnect!</p>
              <p className="text-gray-700 mb-2">Want to create a class? Here is what you need to know:</p>
              <p className="text-gray-500 mb-4">By creating a class, you can manage students, share materials, and communicate effectively with them.</p>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox onChange={() => setChecked(!checked)} />
                <p className="text-sm text-gray-600">I agree to the terms and conditions.</p>
              </div>
            </DialogContent>
            <DialogActions className="justify-end space-x-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => setCreateClassDialog(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white transition ${checked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                disabled={!checked}
                onClick={() => setShowForm(true)}
              >
                Continue
              </button>
            </DialogActions>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default CreateClass;

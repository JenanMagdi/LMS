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
        className='bg-gray-100/20 '
      >
        {showForm ? (
          <div className='flex flex-col items-center justify-center h-screen'>
             <Form/>
          </div>
        ) : (
          <div className='bg-gray-50 p-5 *:*:mb-2'>
            <DialogContent>
              <p className='font-bold'>Welcome to EduConnect!</p>
              <p>Want to create Class? lorem lorem lorem</p>
              <p>lorem lorem lorem lorem lorem lorem lorem lorem lorem </p>
              <div className='bg-gray-100'>
                <Checkbox onChange={() => setChecked(!checked)} />
                <p> lorem lorem lorem lorem lorem</p>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                className='border border-red-600 bg-transparent p-2 rounded-md text-red-500'
                autoFocus
                onClick={() => setCreateClassDialog(false)}
              >
                Cancel
              </button>
              <button
                className='bg-blue-500 p-2 rounded-md text-white autoFocus'
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
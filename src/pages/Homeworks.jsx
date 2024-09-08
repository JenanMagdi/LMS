// // src/pages/CreateHomework.jsx
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { app } from '../lib/Firebase'; // تأكد من تصدير firebase من ملف firebase.js

const db = getFirestore(app);

const CreateHomework = () => {
  const { classId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'classes', classId, 'homework'), {
        title,
        description,
        dueDate,
        createdAt: new Date(),
      });
      alert('Homework created successfully');
    } catch (error) {
      console.error('Error creating homework:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create Homework</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create</button>
      </form>
    </div>
  );
};

export default CreateHomework;

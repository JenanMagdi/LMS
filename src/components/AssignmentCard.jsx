/* eslint-disable react/prop-types */
// src/components/Assignments/AssignmentCard.jsx
import { useState } from 'react';

const AssignmentCard = ({ assignment, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(assignment.title);
  const [dueDate, setDueDate] = useState(assignment.dueDate);

  const handleSave = () => {
    onEdit(assignment.id, { title, dueDate });
    setEditing(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded shadow-md">
      {editing ? (
        <>
          <input 
            className="w-full mb-2 p-1 border border-gray-300 rounded" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            className="w-full mb-2 p-1 border border-gray-300 rounded" 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
          />
          <button 
            onClick={handleSave} 
            className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Save
          </button>
          <button 
            onClick={() => setEditing(false)} 
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          <p className="text-gray-600">Due Date: {assignment.dueDate}</p>
          {assignment.file && <p className="text-blue-500">File: {assignment.file.name}</p>}
          <div className="mt-4 flex justify-between">
            <button 
              onClick={() => setEditing(true)} 
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(assignment.id)} 
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentCard;

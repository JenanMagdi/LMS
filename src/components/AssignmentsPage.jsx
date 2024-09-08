// src/components/Assignments/AssignmentsPage.jsx
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/Firebase';
import AddAssignmentDialog from './AddAssignmentDialog';
import AssignmentCard from './AssignmentCard';

const AssignmentsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const querySnapshot = await getDocs(collection(db, 'assignments'));
      const fetchedAssignments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(fetchedAssignments);
    };

    fetchAssignments();
  }, []);

  const handleAddAssignment = async (assignment) => {
    try {
      const docRef = await addDoc(collection(db, 'assignments'), assignment);
      setAssignments([...assignments, { id: docRef.id, ...assignment }]);
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  const handleEditAssignment = async (id, updatedAssignment) => {
    try {
      const assignmentRef = doc(db, 'assignments', id);
      await updateDoc(assignmentRef, updatedAssignment);
      setAssignments(assignments.map(a => a.id === id ? { ...a, ...updatedAssignment } : a));
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await deleteDoc(doc(db, 'assignments', id));
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={() => setOpenDialog(true)} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        +
      </button>

      <AddAssignmentDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        handleAddAssignment={handleAddAssignment} 
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment} 
            onEdit={handleEditAssignment} 
            onDelete={handleDeleteAssignment}
          />
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;

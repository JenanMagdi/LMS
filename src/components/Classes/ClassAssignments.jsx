/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/Firebase";

function ClassAssignments({ classId, isClassCreator }) {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", deadline: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsRef = collection(db, "Classes", classId, "Assignments");
        const querySnapshot = await getDocs(assignmentsRef);
        const assignmentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssignments(assignmentsList);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId]);

  const handleAddAssignment = async () => {
    try {
      const assignmentsRef = collection(db, "Classes", classId, "Assignments");
      await addDoc(assignmentsRef, newAssignment);
      setAssignments([...assignments, { ...newAssignment, id: Date.now().toString() }]);
      setNewAssignment({ title: "", description: "", deadline: "" });
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await deleteDoc(doc(db, "Classes", classId, "Assignments", assignmentId));
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleUpdateAssignment = async (assignmentId, updatedData) => {
    try {
      await updateDoc(doc(db, "Classes", classId, "Assignments", assignmentId), updatedData);
      setAssignments(assignments.map(assignment => 
        assignment.id === assignmentId ? { ...assignment, ...updatedData } : assignment
      ));
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assignments</h2>
      {loading && <div>Loading assignments...</div>}
      {isClassCreator && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Create Assignment</h3>
          <input
            type="text"
            placeholder="Title"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="date"
            value={newAssignment.deadline}
            onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddAssignment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Assignment
          </button>
        </div>
      )}
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id} className="border p-4 mb-2 rounded">
            <h3 className="text-lg font-semibold">{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p>Deadline: {assignment.deadline}</p>
            {isClassCreator && (
              <div>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateAssignment(assignment.id, { title: "Updated Title" })}
                  className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                >
                  Update
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassAssignments;

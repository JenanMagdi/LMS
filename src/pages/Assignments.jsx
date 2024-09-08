import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/Firebase";

// عرض الواجبات
// eslint-disable-next-line react/prop-types
function Assignments({ classId }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Assignments', classId));
        setAssignments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, [classId]);

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p>Due Date: {assignment.dueDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assignments;
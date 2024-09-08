// // src/components/StudentAssignments.js
// import { collection, onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const StudentAssignments = ({ classId }) => {
//   const [assignments, setAssignments] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "classes", classId, "assignments"),
//       (snapshot) => {
//         setAssignments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       },
//       (error) => {
//         console.error("Error fetching assignments:", error);
//       }
//     );
//     return unsub;
//   }, [classId]);

// // Example in StudentAssignments
// return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold">Assignments</h2>
//       {assignments.length > 0 ? (
//         assignments.map((assignment) => (
//           <div key={assignment.id} className="bg-white p-4 shadow-md rounded mb-4">
//             <h3 className="text-xl font-semibold">{assignment.title || 'No Title'}</h3>
//             <p>{assignment.description || 'No Description'}</p>
//             <p>Due Date: {assignment.dueDate ? assignment.dueDate.toDate().toLocaleDateString() : 'No Due Date'}</p>
//             <p>Status: {new Date() > (assignment.dueDate ? assignment.dueDate.toDate() : new Date()) ? "Late" : "On Time"}</p>
//           </div>
//         ))
//       ) : (
//         <p>No assignments available</p>
//       )}
//     </div>
//   );
  
// };

// export default StudentAssignments;

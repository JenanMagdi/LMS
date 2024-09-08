// // src/components/StudentTasks.js
// import { collection, onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const StudentTasks = ({ classId }) => {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     if (!classId) {
//       console.error("classId is not provided.");
//       return;
//     }

//     const unsub = onSnapshot(
//       collection(db, "classes", classId, "tasks"),
//       (snapshot) => {
//         setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       },
//       (error) => {
//         console.error("Error fetching tasks:", error);
//       }
//     );
//     return unsub;
//   }, [classId]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold">Tasks</h2>
//       {tasks.length > 0 ? (
//         tasks.map((task) => (
//           <div key={task.id} className="bg-white p-4 shadow-md rounded mb-4">
//             <h3 className="text-xl font-semibold">{task.title || 'No Title'}</h3>
//             <p>{task.description || 'No Description'}</p>
//             <p>Due Date: {task.dueDate ? task.dueDate.toDate().toLocaleDateString() : 'No Due Date'}</p>
//             <p>Status: {new Date() > (task.dueDate ? task.dueDate.toDate() : new Date()) ? "Late" : "On Time"}</p>
//           </div>
//         ))
//       ) : (
//         <p>No tasks available</p>
//       )}
//     </div>
//   );
// };

// export default StudentTasks;

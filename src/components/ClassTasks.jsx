// import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { CustomUseContext } from "../context/context";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const ClassTasks = ({ classId, isClassCreator }) => {
//   const { loggedInMail } = CustomUseContext();
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [editingTask, setEditingTask] = useState(null);
//   const [editedText, setEditedText] = useState("");
//   const [editedDueDate, setEditedDueDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "classes", classId, "tasks"),
//       (snapshot) => {
//         setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setLoading(false);
//       },
//       (error) => {
//         setError(error.message);
//         setLoading(false);
//       }
//     );
//     return unsub;
//   }, [classId]);

//   const handlePostTask = async () => {
//     if (!newTask.trim() || !dueDate) return;

//     try {
//       await addDoc(collection(db, "classes", classId, "tasks"), {
//         description: newTask,
//         dueDate: new Date(dueDate),
//         creator: loggedInMail,
//         createdAt: Timestamp.now(),
//       });

//       setNewTask("");
//       setDueDate("");
//     } catch (error) {
//       console.error("Error posting task:", error);
//       setError("Failed to post task.");
//     }
//   };

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteDoc(doc(db, "classes", classId, "tasks", taskId));
//     } catch (error) {
//       console.error("Error deleting task:", error);
//       setError("Failed to delete task.");
//     }
//   };

//   const handleEditTask = async (taskId) => {
//     try {
//       await updateDoc(doc(db, "classes", classId, "tasks", taskId), {
//         description: editedText,
//         dueDate: new Date(editedDueDate),
//       });

//       setEditingTask(null);
//       setEditedText("");
//       setEditedDueDate("");
//     } catch (error) {
//       console.error("Error updating task:", error);
//       setError("Failed to update task.");
//     }
//   };

//   const handleEditClick = (task) => {
//     setEditingTask(task.id);
//     setEditedText(task.description);
//     setEditedDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
//   };

//   return (
//     <div className="p-4">
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {isClassCreator && (
//         <>
//           <div className="mb-4">
//             <input
//               type="text"
//               value={newTask}
//               onChange={(e) => setNewTask(e.target.value)}
//               placeholder="New Task"
//               className="w-full p-2 border rounded mb-2"
//             />
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full p-2 border rounded mb-2"
//             />
//             <button
//               onClick={handlePostTask}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Post Task
//             </button>
//           </div>
//         </>
//       )}
//       {tasks.map((task) => (
//         <div key={task.id} className="border p-2 mb-2">
//           {editingTask === task.id ? (
//             <>
//               <input
//                 type="text"
//                 value={editedText}
//                 onChange={(e) => setEditedText(e.target.value)}
//                 className="w-full p-2 border rounded mb-2"
//               />
//               <input
//                 type="date"
//                 value={editedDueDate}
//                 onChange={(e) => setEditedDueDate(e.target.value)}
//                 className="w-full p-2 border rounded mb-2"
//               />
//               <button
//                 onClick={() => handleEditTask(task.id)}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="font-bold">{task.description}</p>
//               <p className="text-gray-600">Due: {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</p>
//               {isClassCreator && (
//                 <div className="flex space-x-2 mt-2">
//                   <button
//                     onClick={() => handleEditClick(task)}
//                     className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteTask(task.id)}
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ClassTasks;

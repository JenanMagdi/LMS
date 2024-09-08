// import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { CustomUseContext } from "../context/context";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const ClassQuizzes = ({ classId, isClassCreator }) => {
//   const { loggedInMail } = CustomUseContext();
//   const [quizzes, setQuizzes] = useState([]);
//   const [newQuiz, setNewQuiz] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [editingQuiz, setEditingQuiz] = useState(null);
//   const [editedText, setEditedText] = useState("");
//   const [editedDueDate, setEditedDueDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "classes", classId, "quizzes"),
//       (snapshot) => {
//         setQuizzes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setLoading(false);
//       },
//       (error) => {
//         setError(error.message);
//         setLoading(false);
//       }
//     );
//     return unsub;
//   }, [classId]);

//   const handlePostQuiz = async () => {
//     if (!newQuiz.trim() || !dueDate) return;

//     try {
//       await addDoc(collection(db, "classes", classId, "quizzes"), {
//         description: newQuiz,
//         dueDate: new Date(dueDate),
//         creator: loggedInMail,
//         createdAt: Timestamp.now(),
//       });

//       setNewQuiz("");
//       setDueDate("");
//     } catch (error) {
//       console.error("Error posting quiz:", error);
//       setError("Failed to post quiz.");
//     }
//   };

//   const handleDeleteQuiz = async (quizId) => {
//     try {
//       await deleteDoc(doc(db, "classes", classId, "quizzes", quizId));
//     } catch (error) {
//       console.error("Error deleting quiz:", error);
//       setError("Failed to delete quiz.");
//     }
//   };

//   const handleEditQuiz = async (quizId) => {
//     try {
//       await updateDoc(doc(db, "classes", classId, "quizzes", quizId), {
//         description: editedText,
//         dueDate: new Date(editedDueDate),
//       });

//       setEditingQuiz(null);
//       setEditedText("");
//       setEditedDueDate("");
//     } catch (error) {
//       console.error("Error updating quiz:", error);
//       setError("Failed to update quiz.");
//     }
//   };

//   const handleEditClick = (quiz) => {
//     setEditingQuiz(quiz.id);
//     setEditedText(quiz.description);
//     setEditedDueDate(new Date(quiz.dueDate).toISOString().split("T")[0]);
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
//               value={newQuiz}
//               onChange={(e) => setNewQuiz(e.target.value)}
//               placeholder="New Quiz"
//               className="w-full p-2 border rounded mb-2"
//             />
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full p-2 border rounded mb-2"
//             />
//             <button
//               onClick={handlePostQuiz}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Post Quiz
//             </button>
//           </div>
//         </>
//       )}
//       {quizzes.map((quiz) => (
//         <div key={quiz.id} className="border p-2 mb-2">
//           {editingQuiz === quiz.id ? (
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
//                 onClick={() => handleEditQuiz(quiz.id)}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="font-bold">{quiz.description}</p>
//               <p className="text-gray-600">Due: {new Date(quiz.dueDate.seconds * 1000).toLocaleDateString()}</p>
//               {isClassCreator && (
//                 <div className="flex space-x-2 mt-2">
//                   <button
//                     onClick={() => handleEditClick(quiz)}
//                     className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteQuiz(quiz.id)}
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

// export default ClassQuizzes;

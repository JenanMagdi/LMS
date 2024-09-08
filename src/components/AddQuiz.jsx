// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { useState } from "react";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const AddQuiz = ({ classId }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");

//   const handleAddQuiz = async () => {
//     if (!title || !description || !dueDate) return;

//     try {
//       await addDoc(collection(db, "classes", classId, "quizzes"), {
//         title,
//         description,
//         dueDate: Timestamp.fromDate(new Date(dueDate)),
//         createdAt: Timestamp.now(),
//       });
//       setTitle("");
//       setDescription("");
//       setDueDate("");
//     } catch (error) {
//       console.error("Error adding quiz:", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold">Add Quiz</h2>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Title"
//         className="w-full p-2 border rounded mb-2"
//       />
//       <textarea
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Description"
//         className="w-full p-2 border rounded mb-2"
//       />
//       <input
//         type="date"
//         value={dueDate}
//         onChange={(e) => setDueDate(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//       />
//       <button
//         onClick={handleAddQuiz}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Add Quiz
//       </button>
//     </div>
//   );
// };

// export default AddQuiz;

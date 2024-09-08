// // src/components/StudentQuizzes.js
// import { collection, onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../lib/Firebase";

// // eslint-disable-next-line react/prop-types
// const StudentQuizzes = ({ classId }) => {
//   const [quizzes, setQuizzes] = useState([]);

//   useEffect(() => {
//     if (!classId) {
//       console.error("classId is not provided.");
//       return;
//     }

//     const unsub = onSnapshot(
//       collection(db, "classes", classId, "quizzes"),
//       (snapshot) => {
//         setQuizzes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       },
//       (error) => {
//         console.error("Error fetching quizzes:", error);
//       }
//     );
//     return unsub;
//   }, [classId]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold">Quizzes</h2>
//       {quizzes.length > 0 ? (
//         quizzes.map((quiz) => (
//           <div key={quiz.id} className="bg-white p-4 shadow-md rounded mb-4">
//             <h3 className="text-xl font-semibold">{quiz.title || 'No Title'}</h3>
//             <p>{quiz.description || 'No Description'}</p>
//             <p>Due Date: {quiz.dueDate ? quiz.dueDate.toDate().toLocaleDateString() : 'No Due Date'}</p>
//             <p>Status: {new Date() > (quiz.dueDate ? quiz.dueDate.toDate() : new Date()) ? "Late" : "On Time"}</p>
//           </div>
//         ))
//       ) : (
//         <p>No quizzes available</p>
//       )}
//     </div>
//   );
// };

// export default StudentQuizzes;

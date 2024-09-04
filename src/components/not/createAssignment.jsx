// import firebase from "firebase/compat/app";
// import { db } from "../database/Firebase";

// export const createAssignment = (courseId, title, description, deadline) => {
//     return db.collection('courses').doc(courseId).collection('assignments').add({
//       title: title,
//       description: description,
//       deadline: deadline
//     });
//   };
  
//   export const submitAssignment = (courseId, assignmentId, userId, fileUrl) => {
//     return db.collection('courses').doc(courseId).collection('assignments').doc(assignmentId).collection('submissions').add({
//       studentId: userId,
//       fileUrl: fileUrl,
//       submittedOn: firebase.firestore.FieldValue.serverTimestamp()
//     });
//   };
  
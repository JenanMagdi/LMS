// // assignments.js
// import { db } from '../firebase';

// const assignmentsCollection = db.collection('assignments');

// export const createAssignment = (data) => {
//   return assignmentsCollection.add(data);
// };

// export const getAssignment = (id) => {
//   return assignmentsCollection.doc(id).get();
// };

// export const getAssignments = () => {
//   return assignmentsCollection.get();
// };

// export const updateAssignment = (id, data) => {
//   return assignmentsCollection.doc(id).update(data);
// };

// export const deleteAssignment = (id) => {
//   return assignmentsCollection.doc(id).delete();
// };
// // lessons.js
// import { db } from '../firebase';

// const lessonsCollection = db.collection('lessons');

// export const createLesson = (data) => {
//   return lessonsCollection.add(data);
// };

// export const getLesson = (id) => {
//   return lessonsCollection.doc(id).get();
// };

// export const getLessons = () => {
//   return lessonsCollection.get();
// };

// export const updateLesson = (id, data) => {
//   return lessonsCollection.doc(id).update(data);
// };

// export const deleteLesson = (id) => {
//   return lessonsCollection.doc(id).delete();
// };
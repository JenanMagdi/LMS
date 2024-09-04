// // reports.js
// import { db } from '../firebase';

// const reportsCollection = db.collection('reports');

// export const createReport = (data) => {
//   return reportsCollection.add(data);
// };

// export const getReport = (id) => {
//   return reportsCollection.doc(id).get();
// };

// export const getReports = () => {
//   return reportsCollection.get();
// };

// export const updateReport = (id, data) => {
//   return reportsCollection.doc(id).update(data);
// };

// export const deleteReport = (id) => {
//   return reportsCollection.doc(id).delete();
// };
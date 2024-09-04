// // users.js
// import { db } from './users';

// const usersCollection = db.collection('users');

// export const createUser = (data) => {
//   return usersCollection.add(data);
// };

// export const getUser = (id) => {
//   return usersCollection.doc(id).get();
// };

// export const getUsers = () => {
//   return usersCollection.get();
// };

// export const updateUser = (id, data) => {
//   return usersCollection.doc(id).update(data);
// };

// export const deleteUser = (id) => {
//   return usersCollection.doc(id).delete();
// };
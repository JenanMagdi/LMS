// import firebase from 'firebase';
// import db, { auth } from '../lib/Firebase';
// const googleProvider = new firebase.auth.GoogleAuthProvider();

// // Sign in and check or create account in firestore
// const signInWithGoogle = async () => {
//   try {
//     const response = await auth.signInWithPopup(googleProvider);
//     console.log(response.user);
//     const user = response.user;
//     console.log(`User ID - ${user.uid}`);
//     const querySnapshot = await db
//       .collection("users")
//       .where("uid", "==", user.uid)
//       .get();
//     if (querySnapshot.docs.length === 0) {
//       // create a new user
//       await db.collection("users").add({
//         uid: user.uid,
//         enrolledClassrooms: [],
//       });
//     }
//   } catch (err) {
//     alert(err.message);
//   }
// };

// const Logout = () => {
//   auth.signOut();
// };


import firebase from 'firebase';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiToaGMYEwo332m03MqjGJzBbKc6rMZIA",
  authDomain: "lmsystem-27bd8.firebaseapp.com",
  projectId: "lmsystem-27bd8",
  storageBucket: "lmsystem-27bd8.appspot.com",
  messagingSenderId: "510028399067",
  appId: "1:510028399067:web:3c4a8175ddaf394c76a7fe",
  measurementId: "G-EKHGHMVXQ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db =  getFirestore(app);
// const storage = getStorage(app);
const provider = new firebase.auth.GoogleAuthProvider();

export { app, auth, db, db as default, provider };

// const app = firebase.initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = firebase.Firestore(app);
// const storage = firebase.Storage(app);

// lmsystem-27bd8-default-rtdb.firebaseio.com/
// Mq4tKBHNtQphxALvPeyd8cV2znpfNdqRgE9PL2QT
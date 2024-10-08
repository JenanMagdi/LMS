import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiToaGMYEwo332m03MqjGJzBbKc6rMZIA",
  authDomain: "lmsystem-27bd8.firebaseapp.com",
  databaseURL: "https://lmsystem-27bd8-default-rtdb.firebaseio.com",
  projectId: "lmsystem-27bd8",
  storageBucket: "lmsystem-27bd8.appspot.com",
  messagingSenderId: "510028399067",
  appId: "1:510028399067:web:3c4a8175ddaf394c76a7fe",
  measurementId: "G-EKHGHMVXQ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});


auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User is authenticated:", user);
  } else {
    console.log("No user is authenticated.");
  }
});

export { app, auth, db, provider, storage };

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../lib/Firebase";

const AddContext = createContext();

export function CustomUseContext() {
  return useContext(AddContext);
}

// eslint-disable-next-line react/prop-types
export function ContextProvider({ children }) {
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog, setJoinClassDialog] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInMail, setLoggedInMail] = useState(null);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const navigate = useNavigate();

  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        sessionStorage.setItem("token", token);
        setLoggedInUser(result.user);
        setLoggedInMail(result.user.providerData[0].email);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
      });
  };

  const logout = () => {
    auth.signOut()
      .then(() => {
        setLoggedInMail(null);
        setLoggedInUser(null);
        sessionStorage.removeItem("token");
        navigate("/notfound");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        if (loggedInUser?.uid !== authUser.uid) {
          setLoggedInMail(authUser.providerData[0].email);
          setLoggedInUser(authUser);
        }
      } else {
        if (loggedInUser) {
          setLoggedInMail(null);
          setLoggedInUser(null);
        }
      }
    });

    return () => unsubscribe(); // Ensure unsubscribe is called
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribe = onSnapshot(
        collection(db, 'CreatedClasses', loggedInMail, 'classes'),
        (snapshot) => {
          setCreatedClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );
      return () => unsubscribe(); // Ensure unsubscribe is called
    }
  }, [loggedInMail]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribe = onSnapshot(
        collection(db, 'JoinedClasses', loggedInMail, 'classes'),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('Updated Joined Classes Data:', data);
          setJoinedClasses(data);
        }
      );
      return () => unsubscribe(); // Ensure unsubscribe is called
    }
  }, [loggedInMail]);
  

  const value = {
    createClassDialog,
    setCreateClassDialog,
    joinClassDialog,
    setJoinClassDialog,
    login,
    logout,
    loggedInUser,
    setLoggedInUser,
    loggedInMail,
    setLoggedInMail,
    setJoinedClasses,
    joinedClasses,
    setCreatedClasses,
    createdClasses,
  };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}

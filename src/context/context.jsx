import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
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
  const [loggedInUser, setLoggedInUser] = useState(() => JSON.parse(sessionStorage.getItem("user")) || null);
  const [loggedInMail, setLoggedInMail] = useState(() => sessionStorage.getItem("userEmail") || null);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      sessionStorage.setItem("token", token);

      const user = result.user;
      setLoggedInUser(user);
      setLoggedInMail(user.providerData[0].email);

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("userEmail", user.providerData[0].email);
      
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setLoggedInMail(null);
      setLoggedInUser(null);
      sessionStorage.clear();
      navigate("/notfound");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        if (loggedInUser?.uid !== authUser.uid) {
          setLoggedInMail(authUser.providerData[0].email);
          setLoggedInUser(authUser);

          sessionStorage.setItem("user", JSON.stringify(authUser));
          sessionStorage.setItem("userEmail", authUser.providerData[0].email);
        }
      } else {
        setLoggedInMail(null);
        setLoggedInUser(null);
        sessionStorage.clear();
      }
    });
    return () => unsubscribe();
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribeCreated = onSnapshot(
        collection(db, "CreatedClasses", loggedInMail, "classes"),
        (snapshot) => {
          setCreatedClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );
      return () => unsubscribeCreated();
    }
  }, [loggedInMail]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribeJoined = onSnapshot(
        collection(db, "JoinedClasses", loggedInMail, "classes"),
        (snapshot) => {
          setJoinedClasses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );
      return () => unsubscribeJoined();
    }
  }, [loggedInMail]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribeNotifications = onSnapshot(
        collection(db, "Users", loggedInMail, "notifications"),
        (snapshot) => {
          setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );
      return () => unsubscribeNotifications();
    }
  }, [loggedInMail]);

  const value = {
    createClassDialog: false,
    setCreateClassDialog: () => {},
    joinClassDialog: false,
    setJoinClassDialog: () => {},
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
    notifications,
    setNotifications,
  };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}

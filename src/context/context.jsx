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
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog, setJoinClassDialog] = useState(false);

  // Add state for assignments, submissions, and tests
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tests, setTests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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

  // Monitor auth state changes
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

  // Fetch created classes
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

  // Fetch joined classes
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

  // Fetch assignments, submissions, tests, and announcements
  useEffect(() => {
    if (loggedInMail) {
      const unsubscribeAssignments = onSnapshot(
        collection(db, "Users", loggedInMail, "assignments"),
        (snapshot) => {
          setAssignments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );

      const unsubscribeSubmissions = onSnapshot(
        collection(db, "Users", loggedInMail, "submissions"),
        (snapshot) => {
          setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );

      const unsubscribeTests = onSnapshot(
        collection(db, "Users", loggedInMail, "tests"),
        (snapshot) => {
          setTests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );

      const unsubscribeAnnouncements = onSnapshot(
        collection(db, "Users", loggedInMail, "announcements"),
        (snapshot) => {
          setAnnouncements(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );

      return () => {
        unsubscribeAssignments();
        unsubscribeSubmissions();
        unsubscribeTests();
        unsubscribeAnnouncements();
      };
    }
  }, [loggedInMail]);

  const value = {
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
    createClassDialog,
    setCreateClassDialog,
    joinClassDialog,
    setJoinClassDialog,
    // Add new state variables for assignments, submissions, and tests
    assignments,
    submissions,
    tests,
    announcements
  };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}

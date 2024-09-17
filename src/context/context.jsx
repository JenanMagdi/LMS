import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("userRole") || null);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [createClassDialog, setCreateClassDialog] = useState(false);
  const [joinClassDialog, setJoinClassDialog] = useState(false);

  const navigate = useNavigate();

  // Function to set user role in Firestore
  const storeUserRoleInFirestore = async (email, role) => {
    try {
      const userDoc = doc(db, "Users", email);
      await setDoc(userDoc, { role }, { merge: true });
    } catch (error) {
      console.error("Error setting user role in Firestore:", error);
    }
  };

  const determineUserRole = (email) => {
    if (email.startsWith('itstd.')) {
      return 'student';
    } else if (email.endsWith('@uob.edu.ly')) {
      return 'staff';
    }
    return 'unknown'; // Default to 'unknown' if email format is invalid
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      sessionStorage.setItem("token", token);

      const user = result.user;
      const email = user.providerData[0].email;
      const role = determineUserRole(email);

      if (role === 'unknown') {
        // If role is unknown, sign out and show an alert
        await signOut(auth);
        alert('Unauthorized email. Please use a university email address.');
        return;
      }

      // Set user role in Firestore
      await storeUserRoleInFirestore(email, role);

      setLoggedInUser(user);
      setLoggedInMail(email);
      setUserRole(role);

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userRole", role);

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
      setUserRole(null);
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.")
    }
  };
  useEffect(() => {
    if (auth.currentUser) {
      setLoggedInUser(auth.currentUser);
    }
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in: ", user);
        // تعيين المستخدم في الحالة الخاصة بك
        setLoggedInUser(user);
      } else {
        console.log("No user signed in");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const email = authUser.providerData[0].email;
        const role = determineUserRole(email);

        if (role === 'unknown') {
          signOut(auth);
          alert('Unauthorized email. Please use a university email address.');
          return;
        }

        if (loggedInUser?.uid !== authUser.uid) {
          setLoggedInMail(email);
          setLoggedInUser(authUser);
          setUserRole(role);

          sessionStorage.setItem("user", JSON.stringify(authUser));
          sessionStorage.setItem("userEmail", email);
          sessionStorage.setItem("userRole", role);
        }
      } else {
        setLoggedInMail(null);
        setLoggedInUser(null);
        setUserRole(null);
        sessionStorage.clear();
      }
    });
    return () => unsubscribe();
  }, [loggedInUser]);


  const value = {
    login,
    logout,
    loggedInUser,
    setLoggedInUser,
    loggedInMail,
    setLoggedInMail,
    userRole,
    setUserRole,
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
  };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}

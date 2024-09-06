import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from '../lib/Firebase';

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
    const navigate = useNavigate();

    const login = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                sessionStorage.setItem('token', token);
                setLoggedInUser(result.user);
                setLoggedInMail(result.user.providerData[0].email);
                navigate('/home');
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
                sessionStorage.removeItem('token');
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
                    console.log("User logged in:", authUser);
                    console.log("User email:", authUser.providerData[0].email);
                }
            } else {
                if (loggedInUser) {
                    console.log("User logged out");
                    setLoggedInMail(null);
                    setLoggedInUser(null);
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [loggedInUser,loggedInMail]);

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
    };

    return (
        <AddContext.Provider value={value}>
            {children}
        </AddContext.Provider>
    );
}




                    // const logout = () => {
                //     auth.signOut()
                //     .then(() => {
                //         setLoggedInUser(null);
                //         setLoggedInMail(null);
                //         navigate('/');
                //         })
                //         .catch((error) => {
                //             // An error happened.
                //             });
                //             };
                //             const handleCreateClass = () => {
                //                 setCreateClassDialog(true);
                //                 };
                //                 const handleJoinClass = () => {
                //                     setJoinClassDialog(true);
                //                     };
                //                     const handleCreateClassSubmit = (e) => {
                //                         e.preventDefault();
                //                         const className = e.target.className.value;
                //                         const classCode = e.target.classCode.value;
                //                         const classDescription = e.target.classDescription.value;

                //                     }
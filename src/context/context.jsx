/* eslint-disable react/prop-types */
import { signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from '../lib/Firebase';

const AddContext = createContext();

export function CustomUseContext() {
    return useContext(AddContext);
}

export function ContextProvider({ children }) {
    const [createClassDialog, setCreateClassDialog] = useState(false);
    const [joinClassDialog, setJoinClassDialog] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInMail, setLoggedInMail] = useState(null);
    const navigate = useNavigate();

    // const login = () => {
    //     auth.signInWithPopup(provider);

    // };
const login = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            setLoggedInUser(result.user);
            setLoggedInMail(result.user.email);
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
                navigate("/notfound")
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
    // useEffect(() => {
    //     if (loggedInUser || loggedInMail) {
    //         console.log("User logged in:", loggedInUser);
    //         console.log("User email:", loggedInMail);
    //     }else 
    //     {
    //         console.log("User logged out");
    //     }
    // }, [loggedInUser, loggedInMail]);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                if (loggedInUser?.uid !== authUser.uid) {
                    setLoggedInMail(authUser.email);
                    setLoggedInUser(authUser);
                    console.log("User logged in:", authUser);
                    console.log("User email:", authUser.email);
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
    }, [loggedInUser, loggedInMail]);
    

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

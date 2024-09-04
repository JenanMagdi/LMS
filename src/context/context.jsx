import { createContext, useContext, useState } from "react";
// import { auth, provider } from "../lib/Firebase";

const AddContext = createContext();

export function CustomUseContext(){
    return useContext(AddContext)
}
// eslint-disable-next-line react/prop-types
export function ContextProvider({children}){
    
    const [createClassDialog,setCreateClassDialog] =useState(false);
    const [joinClassDialog,setJoinClassDialog] =useState(false);
    const [logInUser,setLogInUser] =useState(null);
    const [loggedInMail,setLoggedInMail] =useState(null);
    const  login =()=>{
        // auth.signInWithPopup(provider)
    }
    // useEffect(()=>{
    //     // const unsubscribe =auth.onAuthStateChanged((authUser)=>{
    //         if(authUser) {
    //             setLoggedInMail (authUser.email)
    //             setLogInUser(authUser)
    //             }
    //         else {
    //             setLoggedInMail(null)
    //             setLogInUser(null)
    //         }
    //     })

    //     return ()=> {
    //         unsubscribe()
    //     }

    // },[loggedInMail])
        const value={
            createClassDialog,
            setCreateClassDialog,
            joinClassDialog,
            setJoinClassDialog,
            login,
            logInUser,
            setLogInUser,
            loggedInMail,
            setLoggedInMail
        };
    return (<AddContext.Provider value={value}>
        {children}
        </AddContext.Provider>
    
    )

}

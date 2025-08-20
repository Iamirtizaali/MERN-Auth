import React, { createContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    // Ensure cookies are sent with requests (required for auth with cookies)
    axios.defaults.withCredentials = true;
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userData, setUserData] = React.useState(null);
    const getUserData=async ()=>{
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            const response = await axios.get(`${backendUrl}/api/user/get-user-data`);
            if (response.data.success) {
                // console.log("User data fetched successfully:", response.data.userData);
                setUserData(response.data.userData);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching user data:", error);
        }
    }
    const getAuthState=async ()=>{
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
            const response = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (response.data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching auth state:", error);
        }
    }
    useEffect(() => {
        getAuthState();
    }, []);
    const value={ backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData, getAuthState }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

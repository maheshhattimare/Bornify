import {createContext, useState, useEffect, useContext} from "react";
import API from "../services/api.js"; // axios instance

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (! token) {
                setUser(null);
                setLoadingUser(false);
                return;
            }

            try {
                const res = await API.get("/users/me");
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setUser(null);
                // Only remove token if it's an auth error
                if (err.response ?. status === 401) {
                    localStorage.removeItem("token");
                }
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, []);

    return (<AuthContext.Provider value={
        {user, setUser, loadingUser}
    }> {children} </AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);

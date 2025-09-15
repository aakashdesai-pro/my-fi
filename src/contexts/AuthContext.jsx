import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const login = async (email, password) => {
        await account.createEmailPasswordSession(email, password);
        const loggedIn = await account.get();
        setUser(loggedIn);
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
    };

    const checkUserStatus = async () => {
        try {
            const loggedIn = await account.get();
            setUser(loggedIn);
        } catch (error) {
            setUser(null);
        }
        setLoading(false);
    };

    const value = {
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import { registerRequest } from "../api/auth.ts";

interface AuthState { 
    user: object | null;
    signUp: (user: object) => void;
    isAuthenticated: boolean;
    errors: object | null;
}

const initialAuthState: AuthState = {
    user: null,
    signUp: () => { },
    isAuthenticated: false,
    errors: null,  
};

export const AuthContext = createContext(initialAuthState);

export const useAuth = () => { 
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => { 
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);

    const signUp = async (user: object) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrors(error.response.data);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, isAuthenticated, errors }}>
            {children}
        </AuthContext.Provider>
    );
};
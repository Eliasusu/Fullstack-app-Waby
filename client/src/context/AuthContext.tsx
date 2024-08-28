/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { registerRequest, loginRequest } from "../api/auth.ts";

interface AuthState { 
    user: object | null;
    signUp: (user: object) => void;
    signIn: (user: object) => void;
    isAuthenticated: boolean;
    errors: object | null;
}

const initialAuthState: AuthState = {
    user: null,
    signUp: () => { },
    signIn: () => { },
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

    const signIn = async (user: object) => { 
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setErrors(error.response.data);
        }  

    }

    useEffect(() => { 
        if (errors.length > 0) { 
            const timer = setTimeout(() => {
                setErrors([]);
            }, 3000);
            return() => clearTimeout(timer)
        }
    }, [errors]);

    return (
        <AuthContext.Provider value={{ user, signUp ,isAuthenticated, errors, signIn }}>
            {children}
        </AuthContext.Provider>
    );
};
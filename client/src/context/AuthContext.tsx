/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth.ts";
import Cookie from "js-cookie";
import { User } from "@/types/user.type.ts";

interface AuthState { 
    user: User | null;
    signUp: (user: User) => void;
    signIn: (user: User) => void;
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

    const signUp = async (user: User) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {      
            setErrors(error.response.data);
        }
    };

    const signIn = async (user: User) => { 
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (Array.isArray(error.response.data)) { 
                return setErrors(error.response.data);
            }
            setErrors(error.response.data.message);
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

    useEffect(() => { 
        const checkUser = async () => {
            const token = Cookie.get("token");
            if (token) {
                try {
                    const res = await verifyTokenRequest()
                    console.log(res);
                    if (res.data) {
                        setIsAuthenticated(true);
                        setUser(res.data);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        }
        checkUser();
    }, []);
    
    return (
        <AuthContext.Provider value={{ user, signUp ,isAuthenticated, errors, signIn }}>
            {children}
        </AuthContext.Provider>
    );
};
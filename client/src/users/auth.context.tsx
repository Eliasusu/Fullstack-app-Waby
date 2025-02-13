/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getProfileRequest, registerRequest, loginRequest, verifyTokenRequest, updateProfileRequest, deleteProfileRequest } from "@/users/auth.api.ts";
import Cookie from "js-cookie";
import { User } from "@/users/user.type.ts";


type userPropsUpdate = {
    username: string,
    name: string,
    phone: string,
    bodyWeight: number,
    height: number,
}

interface Error {
    code: string,
    expected: string,
    received: string,
    path: string[],
    message: string
}

const initialError: Error[] = []



interface AuthState {
    user: {
        id: string,
        username: string
    } | null;
    allDataUser: User | null
    signUp: (user: User) => void;
    signIn: (user: User) => void;
    logout: () => void;
    updateProfile: (id: string, data: userPropsUpdate) => void;
    deleteProfile: (id: string) => void;
    getOneProfile: (id: string) => void;
    isAuthenticated: boolean;
    errors: Error[];
}

const initialAuthState: AuthState = {
    user: {
        id: '',
        username: ''
    },
    allDataUser: null,
    signUp: () => { },
    signIn: () => { },
    updateProfile: () => { },
    deleteProfile: () => { },
    getOneProfile: () => ({} as User),
    logout: () => { },
    isAuthenticated: false,
    errors: [],
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
    const [allDataUser, setAllDataUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState<Error[]>(initialError)

    const handleError = (error: unknown) => {
        if (error && 
            typeof error === 'object' && 
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object' &&
            'message' in error.response.data) {
            const errorMessages = (error.response as {data: {message: unknown}}).data.message;
            if (Array.isArray(errorMessages)) {
                setErrors(errorMessages.map(err => ({
                    code: err.code,
                    expected: err.expected,
                    received: err.received,
                    path: err.path,
                    message: err.message
                })));
            }
        } else {
            setErrors([{
                code: 'unknown_error',
                expected: '',
                received: '',
                path: [],
                message: 'An unexpected error occurred'
            }]);
        }
    };

    const signUp = async (user: User) => {
        try {
            console.log('user en el signUp', user);
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error: unknown) {
            handleError(error);
        }
    };

    const signIn = async (user: User) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
                console.log(error);
            }
        }

    }

    const logout = () => {
        Cookie.remove("token");
        setUser(null);
        setIsAuthenticated(false);
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 3000);
            return () => clearTimeout(timer)
        }
    }, [errors]);


    const updateProfile = async (id: string, data: userPropsUpdate) => {
        try {

            const res = await updateProfileRequest(id, data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error: unknown) {
            handleError(error as Error);
        }
    }

    const deleteProfile = async (id: string) => {
        try {
            const res = await deleteProfileRequest(id);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            handleError(error as Error);
        }
    }

    const getOneProfile = async (id: string) => {
        if (!id) return {} as User;
        try {
            const res = await getProfileRequest(id);
            setAllDataUser(res.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            handleError(error as Error);
            throw error;
        }
    }

    useEffect(() => {
        const checkUser = async () => {
            const token = Cookie.get("token");
            if (token) {
                try {
                    const res = await verifyTokenRequest()
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
        <AuthContext.Provider value={{ user, allDataUser, getOneProfile, signUp, updateProfile, deleteProfile, isAuthenticated, errors, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
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
    errors: object | null;
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
    const [allDataUser, setAllDataUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState<{ message: string }[]>([]);

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
            if (error instanceof Error) {
                setErrors([{ message: error.message }]);
            }
        }
    }

    const deleteProfile = async (id: string) => {
        try {
            const res = await deleteProfileRequest(id);
            console.log('res.data', res.data)
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrors([{ message: error.message }]);
            } else {
                setErrors([{ message: "Hubo un problema al eliminar el perfil" }]);
            }
        }
    }

    const getOneProfile = async (id: string) => {
        if (!id) return {} as User;
        try {
            const res = await getProfileRequest(id);
            setAllDataUser(res.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrors([{ message: error.message }]);
            } else {
                setErrors([{ message: "Hubo un problema al obtener el perfil" }]);
            }
            throw error;
        }
    }

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
        <AuthContext.Provider value={{ user, allDataUser, getOneProfile, signUp, updateProfile, deleteProfile, isAuthenticated, errors, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { LoginInput, RegisterInput, UpdateUserInput, User } from "@waby/shared";
import { deleteMeRequest, getMeRequest, loginRequest, logoutRequest, registerRequest, updateMeRequest } from "@/users/auth.api.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface AuthState {
    /** Usuario de la sesión, completo (sin contraseña). */
    user: User | null;
    isAuthenticated: boolean;
    /** true mientras se verifica la sesión al cargar la app. */
    isLoading: boolean;
    signUp: (data: RegisterInput) => Promise<Result>;
    signIn: (data: LoginInput) => Promise<Result>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateUserInput) => Promise<Result>;
    deleteProfile: () => Promise<Result>;
}

const notReady = async (): Promise<Result> => ({ ok: false, errors: ['AuthProvider no está montado'] });

export const AuthContext = createContext<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    signUp: notReady,
    signIn: notReady,
    logout: async () => { },
    updateProfile: notReady,
    deleteProfile: notReady,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // La cookie de sesión es httpOnly: la única forma de saber si hay sesión es preguntarle a la API.
    useEffect(() => {
        getMeRequest()
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const signUp = (data: RegisterInput) =>
        attempt(async () => {
            const res = await registerRequest(data);
            setUser(res.data);
        });

    const signIn = (data: LoginInput) =>
        attempt(async () => {
            const res = await loginRequest(data);
            setUser(res.data);
        });

    const logout = async () => {
        await logoutRequest().catch(() => undefined);
        setUser(null);
    };

    const updateProfile = (data: UpdateUserInput) =>
        attempt(async () => {
            const res = await updateMeRequest(data);
            setUser(res.data);
        });

    const deleteProfile = () =>
        attempt(async () => {
            await deleteMeRequest();
            setUser(null);
        });

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, signUp, signIn, logout, updateProfile, deleteProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

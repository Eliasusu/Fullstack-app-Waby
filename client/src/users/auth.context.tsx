/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import type { LoginInput, RegisterInput, UpdateUserInput, User } from "@waby/shared";
import { deleteMeRequest, getMeRequest, loginRequest, logoutRequest, registerRequest, updateMeRequest } from "@/users/auth.api.ts";
import { attempt, type Result } from "@/lib/result.ts";
import { setSessionExpiredHandler } from "@/lib/axios.ts";

interface AuthState {
    /** Usuario de la sesión, completo (sin contraseña). */
    user: User | null;
    isAuthenticated: boolean;
    /** true mientras se verifica la sesión al cargar la app. */
    isLoading: boolean;
    /** true si la sesión se cerró porque venció (para avisarlo en el login). */
    sessionExpired: boolean;
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
    sessionExpired: false,
    signUp: notReady,
    signIn: notReady,
    logout: async () => { },
    updateProfile: notReady,
    deleteProfile: notReady,
});

export const useAuth = () => useContext(AuthContext);

/**
 * Llama a `reset` cuando cambia el usuario de la sesión (logout, login con otra cuenta, perfil borrado),
 * para que los contextos con datos del usuario no muestren los del anterior (nota 53).
 */
export function useResetOnUserChange(reset: () => void) {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const previous = useRef(userId);
    const resetRef = useRef(reset);
    resetRef.current = reset;
    useEffect(() => {
        if (previous.current === userId) return;
        previous.current = userId;
        resetRef.current();
    }, [userId]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);
    const userRef = useRef(user);
    userRef.current = user;

    // Si la API responde 401 con una sesión abierta, venció: se cierra acá y ProtectedRoute lleva al login.
    useEffect(() => setSessionExpiredHandler(() => {
        if (!userRef.current) return;
        setSessionExpired(true);
        setUser(null);
    }), []);

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
            setSessionExpired(false);
            setUser(res.data);
        });

    const signIn = (data: LoginInput) =>
        attempt(async () => {
            const res = await loginRequest(data);
            setSessionExpired(false);
            setUser(res.data);
        });

    const logout = async () => {
        await logoutRequest().catch(() => undefined);
        setSessionExpired(false);
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
        <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, sessionExpired, signUp, signIn, logout, updateProfile, deleteProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

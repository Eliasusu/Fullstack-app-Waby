import axios from "axios";

/** URL de la API. Se configura con VITE_API_URL (client/.env); por defecto, la API local. */
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1/',
    withCredentials: true,
})

let onSessionExpired: (() => void) | null = null;

/** Registra quién se entera de que la sesión venció (el AuthProvider). Devuelve cómo desregistrarlo. */
export function setSessionExpiredHandler(handler: () => void) {
    onSessionExpired = handler;
    return () => {
        if (onSessionExpired === handler) onSessionExpired = null;
    };
}

// Un 401 fuera de /auth significa sesión vencida o inválida (nota 48). Los de /auth son credenciales incorrectas.
instance.interceptors.response.use(undefined, (error) => {
    const url: string = error?.config?.url ?? '';
    if (error?.response?.status === 401 && !url.replace(/^\/+/, '').startsWith('auth/')) onSessionExpired?.();
    return Promise.reject(error);
})

export default instance

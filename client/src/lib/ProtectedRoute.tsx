import { useAuth } from "../users/auth.context.tsx";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()
    // Mientras se verifica la sesión no se redirige: recargar la página no saca al usuario (nota 52).
    if (isLoading) return null
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Outlet />
}

import { useAuth } from "../users/auth.context.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";


export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()
    // Mientras se verifica la sesión no se redirige: recargar la página no saca al usuario (nota 52).
    if (isLoading) return null
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
    return <Outlet />
}

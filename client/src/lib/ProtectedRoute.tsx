import { useAuth } from "../users/auth.context.tsx";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Outlet />
}

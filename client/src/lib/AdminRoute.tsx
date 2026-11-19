import { Outlet } from "react-router-dom";
import { useAuth } from "@/users/auth.context.tsx";
import ErrorPage from "@/pages/Errors/ErrorPage.tsx";

/**
 * Rutas solo para admin (nota 76). Va anidada dentro de ProtectedRoute, que ya resolvió la sesión.
 * Un usuario común que entra por URL ve un 403 que se entiende, con forma de volver.
 * La protección real está en la API (`requireAdmin`): esto solo evita mostrar lo que no puede usar.
 */
export default function AdminRoute() {
    const { isAdmin } = useAuth();
    if (!isAdmin) return <ErrorPage code={403} />;
    return <Outlet />;
}

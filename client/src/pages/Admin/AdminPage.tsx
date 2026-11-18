import { useEffect, useState } from "react";
import type { User } from "@waby/shared";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { getUsersRequest } from "@/users/auth.api.ts";
import { useLoader } from "@/lib/load.ts";

const roleLabels: Record<User['role'], string> = { USER: 'Usuario', ADMIN: 'Admin' };

/**
 * Administración (nota 76): solo la ve un admin (AdminRoute) y usa `GET /users`, que la API
 * protege con `requireAdmin`. La gestión de catálogos (#77) se suma acá.
 */
export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { loading, run } = useLoader();

    useEffect(() => {
        run(async () => {
            const res = await getUsersRequest();
            setUsers(res.data);
        });
    }, [run]);

    return (
        <>
            <Header />
            <div className="pb-24 flex justify-center">
                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="my-5 p-5">
                    <h1 className="text-2xl font-semibold text-white-text">Administración</h1>
                    <p className="text-sm text-white-text/70 mb-4">Usuarios registrados en Waby.</p>
                    <div className="border border-white/30 rounded-xl overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-white/20">
                                    <TableHead className="text-white/90">Usuario</TableHead>
                                    <TableHead className="text-white/90">Nombre</TableHead>
                                    <TableHead className="text-white/90">Email</TableHead>
                                    <TableHead className="text-white/90">Rol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="border-b border-white/30">
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{roleLabels[user.role]}</TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-16 text-center text-white-text/70">
                                            {loading ? 'Cargando…' : 'No se pudieron cargar los usuarios.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </BoxContainer>
            </div>
            <NavBar />
        </>
    );
}

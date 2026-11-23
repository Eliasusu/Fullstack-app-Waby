import { useEffect, useState } from "react";
import { CreateMuscleGroupSchema, CreateTrainingMethodSchema, type User } from "@waby/shared";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import CatalogEditor from "@/components/CatalogEditor.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { getUsersRequest } from "@/users/auth.api.ts";
import { useMuscleGroup } from "@/muscleGroups/muscle-group.context.tsx";
import { useTrainingMethod } from "@/trainingMethods/training-method.context.tsx";
import { useLoader } from "@/lib/load.ts";
import { notifyResult } from "@/lib/notify.ts";

const roleLabels: Record<User['role'], string> = { USER: 'Usuario', ADMIN: 'Admin' };

/**
 * Administración (nota 76): solo la ve un admin (AdminRoute). Usa endpoints que la API protege con
 * `requireAdmin`: el listado de usuarios y el alta, edición y baja de los catálogos (nota 77).
 */
export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { loading, run } = useLoader();
    const muscleGroups = useMuscleGroup();
    const trainingMethods = useTrainingMethod();

    useEffect(() => {
        run(async () => {
            const res = await getUsersRequest();
            setUsers(res.data);
        });
        muscleGroups.getAllMGS();
        trainingMethods.getAllTrainingMethods();
        // Se carga una vez al entrar a la pantalla.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run]);

    return (
        <>
            <Header />
            <div className="pb-24 flex flex-col items-center">
                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="my-5 p-5">
                    <h1 className="text-2xl font-semibold text-white-text">Administración</h1>
                    <p className="text-sm text-white-text/70">Catálogos que usan todos los usuarios y usuarios registrados.</p>
                </BoxContainer>

                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="mb-5 p-5">
                    <CatalogEditor
                        title="Grupos musculares"
                        items={muscleGroups.muscleGroups}
                        loading={muscleGroups.loading}
                        schema={CreateMuscleGroupSchema}
                        onCreate={async (values) => notifyResult(await muscleGroups.create(values), { title: 'Grupo muscular creado' })}
                        onUpdate={async (id, values) => notifyResult(await muscleGroups.update(id, values), { title: 'Grupo muscular actualizado' })}
                        onDelete={async (item) => notifyResult(await muscleGroups.remove(item.id), { title: 'Grupo muscular borrado', description: item.name })}
                    />
                </BoxContainer>

                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="mb-5 p-5">
                    <CatalogEditor
                        title="Métodos de entrenamiento"
                        items={trainingMethods.trainingMethods}
                        loading={trainingMethods.loading}
                        schema={CreateTrainingMethodSchema}
                        onCreate={async (values) => notifyResult(await trainingMethods.create(values), { title: 'Método de entrenamiento creado' })}
                        onUpdate={async (id, values) => notifyResult(await trainingMethods.update(id, values), { title: 'Método de entrenamiento actualizado' })}
                        onDelete={async (item) => notifyResult(await trainingMethods.remove(item.id), { title: 'Método de entrenamiento borrado', description: item.name })}
                    />
                </BoxContainer>

                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="mb-5 p-5">
                    <h2 className="text-xl font-semibold text-white-text mb-3">Usuarios</h2>
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

/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { CreateMuscleGroupInput, MuscleGroup, UpdateMuscleGroupInput } from "@waby/shared";
import { createMuscleGroup, deleteMuscleGroup, getAllMuscleGroups, updateMuscleGroup } from "./muscle-group.api.ts";
import { useLoader } from "@/lib/load.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface MuscleGroupState {
    muscleGroups: MuscleGroup[];
    loading: boolean;
    getAllMGS: () => Promise<void>;
    /** Alta, edición y baja (solo admin, nota 77). Después de cada cambio se recarga la lista. */
    create: (data: CreateMuscleGroupInput) => Promise<Result>;
    update: (id: number, data: UpdateMuscleGroupInput) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['MuscleGroupProvider no está montado'] });

export const MuscleGroupContext = createContext<MuscleGroupState>({
    muscleGroups: [],
    loading: false,
    getAllMGS: async () => { },
    create: notReady,
    update: notReady,
    remove: notReady,
});

export const useMuscleGroup = () => useContext(MuscleGroupContext);

export const MuscleGroupProvider = ({ children }: { children: ReactNode }) => {
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

    const { loading, run } = useLoader();

    const fetchAll = async () => {
        const res = await getAllMuscleGroups();
        setMuscleGroups(res.data);
    };

    /** Si la carga falla avisa con un toast (nota 63). */
    const getAllMGS = async () => {
        await run(fetchAll);
    };

    // La lista se recarga después de cada cambio, así lo nuevo aparece en el form de Ejercicio sin recargar.
    const create = (data: CreateMuscleGroupInput) =>
        attempt(async () => {
            await createMuscleGroup(data);
            await fetchAll();
        });

    const update = (id: number, data: UpdateMuscleGroupInput) =>
        attempt(async () => {
            await updateMuscleGroup(id, data);
            await fetchAll();
        });

    const remove = (id: number) =>
        attempt(async () => {
            await deleteMuscleGroup(id);
            await fetchAll();
        });

    return (
        <MuscleGroupContext.Provider value={{ muscleGroups, loading, getAllMGS, create, update, remove }}>
            {children}
        </MuscleGroupContext.Provider>
    );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { CreateTrainingMethodInput, TrainingMethod, UpdateTrainingMethodInput } from "@waby/shared";
import { createTrainingMethod, deleteTrainingMethod, getTrainingMethods, updateTrainingMethod } from "@/trainingMethods/training-method.api.ts";
import { useLoader } from "@/lib/load.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface TrainingMethodState {
    trainingMethods: TrainingMethod[];
    loading: boolean;
    getAllTrainingMethods: () => Promise<void>;
    /** Alta, edición y baja (solo admin, nota 77). Después de cada cambio se recarga la lista. */
    create: (data: CreateTrainingMethodInput) => Promise<Result>;
    update: (id: number, data: UpdateTrainingMethodInput) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['TrainingMethodProvider no está montado'] });

export const TrainingMethodContext = createContext<TrainingMethodState>({
    trainingMethods: [],
    loading: false,
    getAllTrainingMethods: async () => { },
    create: notReady,
    update: notReady,
    remove: notReady,
});

export const useTrainingMethod = () => useContext(TrainingMethodContext);

export const TrainingMethodProvider = ({ children }: { children: ReactNode }) => {
    const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([]);

    const { loading, run } = useLoader();

    const fetchAll = async () => {
        const res = await getTrainingMethods();
        setTrainingMethods(res.data);
    };

    /** Si la carga falla avisa con un toast (nota 63). */
    const getAllTrainingMethods = async () => {
        await run(fetchAll);
    };

    // La lista se recarga después de cada cambio, así lo nuevo aparece en los forms sin recargar.
    const create = (data: CreateTrainingMethodInput) =>
        attempt(async () => {
            await createTrainingMethod(data);
            await fetchAll();
        });

    const update = (id: number, data: UpdateTrainingMethodInput) =>
        attempt(async () => {
            await updateTrainingMethod(id, data);
            await fetchAll();
        });

    const remove = (id: number) =>
        attempt(async () => {
            await deleteTrainingMethod(id);
            await fetchAll();
        });

    return (
        <TrainingMethodContext.Provider value={{ trainingMethods, loading, getAllTrainingMethods, create, update, remove }}>
            {children}
        </TrainingMethodContext.Provider>
    );
};

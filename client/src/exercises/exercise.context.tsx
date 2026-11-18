/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import { useResetOnUserChange } from "@/users/auth.context.tsx";
import type { CreateExerciseInput, Exercise, UpdateExerciseInput } from "@waby/shared";
import { createExerciseReq, deleteExerciseReq, getExercisesReq, updateExerciseReq } from "@/exercises/exercise.api.ts";
import { attempt, type Result } from "@/lib/result.ts";
import { useLoader } from "@/lib/load.ts";

interface ExerciseState {
    /** Ejercicios del filtro actual (por ejemplo, de un grupo muscular). */
    exercises: Exercise[];
    /** Todos los ejercicios del usuario. */
    allExercises: Exercise[];
    /** true mientras se cargan ejercicios. */
    loading: boolean;
    getExercises: (muscleGroupId?: number) => Promise<void>;
    getAllExercises: () => Promise<void>;
    addExercise: (data: CreateExerciseInput) => Promise<Result<Exercise>>;
    editarExercise: (id: number, data: UpdateExerciseInput) => Promise<Result<Exercise>>;
    removeExercise: (id: number) => Promise<Result>;
}

const notReady = async () => ({ ok: false as const, errors: ['ExerciseProvider no está montado'] });

export const ExerciseContext = createContext<ExerciseState>({
    exercises: [],
    allExercises: [],
    loading: false,
    getExercises: async () => { },
    getAllExercises: async () => { },
    addExercise: notReady,
    editarExercise: notReady,
    removeExercise: notReady,
});

export const useExercise = () => useContext(ExerciseContext);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [filter, setFilter] = useState<number | undefined>(undefined);
    useResetOnUserChange(() => {
        setExercises([]);
        setAllExercises([]);
        setFilter(undefined);
    });

    const { loading, run } = useLoader();

    const fetchExercises = async (muscleGroupId?: number) => {
        setFilter(muscleGroupId);
        const res = await getExercisesReq(muscleGroupId ? { muscleGroupId } : {});
        setExercises(res.data);
    };

    const fetchAllExercises = async () => {
        const res = await getExercisesReq();
        setAllExercises(res.data);
    };

    // Las pantallas usan estas: si la carga falla avisan con un toast (nota 63).
    const getExercises = async (muscleGroupId?: number) => {
        await run(() => fetchExercises(muscleGroupId));
    };
    const getAllExercises = async () => {
        await run(fetchAllExercises);
    };

    /** Después de cada cambio se recargan las dos listas desde la API (nota 72). Si falla, lo informa la acción. */
    const refresh = () => Promise.all([fetchExercises(filter), fetchAllExercises()]);

    const addExercise = (data: CreateExerciseInput) =>
        attempt(async () => {
            const res = await createExerciseReq(data);
            await refresh();
            return res.data;
        });

    const editarExercise = (id: number, data: UpdateExerciseInput) =>
        attempt(async () => {
            const res = await updateExerciseReq(id, data);
            await refresh();
            return res.data;
        });

    const removeExercise = (id: number) =>
        attempt(async () => {
            await deleteExerciseReq(id);
            await refresh();
        });

    return (
        <ExerciseContext.Provider value={{ exercises, allExercises, loading, getExercises, getAllExercises, addExercise, editarExercise, removeExercise }}>
            {children}
        </ExerciseContext.Provider>
    );
};

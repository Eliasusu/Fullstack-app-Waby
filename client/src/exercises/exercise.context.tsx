/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { CreateExerciseInput, Exercise, UpdateExerciseInput } from "@waby/shared";
import { createExerciseReq, deleteExerciseReq, getExercisesReq, updateExerciseReq } from "@/exercises/exercise.api.ts";
import { attempt, type Result } from "@/lib/result.ts";

interface ExerciseState {
    /** Ejercicios del filtro actual (por ejemplo, de un grupo muscular). */
    exercises: Exercise[];
    /** Todos los ejercicios del usuario. */
    allExercises: Exercise[];
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

    const getExercises = async (muscleGroupId?: number) => {
        setFilter(muscleGroupId);
        const res = await getExercisesReq(muscleGroupId ? { muscleGroupId } : {});
        setExercises(res.data);
    };

    const getAllExercises = async () => {
        const res = await getExercisesReq();
        setAllExercises(res.data);
    };

    /** Después de cada cambio se recargan las dos listas desde la API (nota 72). */
    const refresh = () => Promise.all([getExercises(filter), getAllExercises()]);

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
        <ExerciseContext.Provider value={{ exercises, allExercises, getExercises, getAllExercises, addExercise, editarExercise, removeExercise }}>
            {children}
        </ExerciseContext.Provider>
    );
};

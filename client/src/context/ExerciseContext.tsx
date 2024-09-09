import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createExercise } from "../api/exercise.ts";

interface Exercise {
    name: string;
    trainingMethod: string;
    description?: string;
    muscleGroups: string[];
    difficulty: string;
    typeExercise: string;
}

interface ExerciseState {
    exercises: Exercise[];
    addExercise: (exercise: Exercise) => void;
    errors: object | null;
}

const initialExerciseState: ExerciseState = {
    exercises: [],
    addExercise: () => { },
    errors: null,
};
console.log("Entre al context");
export const ExerciseContext = createContext(initialExerciseState);

export const useExercise = () => {
    const context = useContext(ExerciseContext);
    console.log(context);
    if (!context) {
        throw new Error("useExercise must be used within an ExerciseProvider");
    }
    return context;
};

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [errors, setErrors] = useState<object | null>(null);

    const addExercise = async (exercise: Exercise) => {
        try {
            await createExercise(exercise);
            setExercises([...exercises, exercise]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el ejercicio" });
            }
        }
    };

    useEffect(() => {
        if (errors) {
            const timer = setTimeout(() => {
                setErrors(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <ExerciseContext.Provider value={{ exercises, addExercise, errors }}>
            {children}
        </ExerciseContext.Provider>
    );
};

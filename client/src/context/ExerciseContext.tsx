import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createExercise, getExercisesReq, getExercisesByMg } from "../api/exercise.ts";
import { Exercise } from "../types/exercise.type.ts";


interface ExerciseState {
    exercises: Exercise[];
    addExercise: (exercise: Exercise) => void;
    getExercises: (mg: string) => void;
    errors: object | null;
}

const initialExerciseState: ExerciseState = {
    exercises: [],
    addExercise: () => { },
    getExercises: () => { },
    errors: null,
};
export const ExerciseContext = createContext(initialExerciseState);

// eslint-disable-next-line react-refresh/only-export-components
export const useExercise = () => {
    const context = useContext(ExerciseContext);

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
        const updatedExercises = await getExercisesReq(); 
        setExercises(updatedExercises.data.exercises);
    } catch (error: unknown) {
        if (error instanceof Error) {
            setErrors({ message: error.message });
        } else {
            setErrors({ message: "Hubo un problema al guardar el ejercicio" });
        }
    }
};

    const getExercises = async (mg: string) => {
        if (mg) {
            const res = await getExercisesByMg(mg);
            setExercises(res.data.exercisesDestructurized);
        } else { 
        const res = await getExercisesReq();
        console.log(res.data.exercises);
        setExercises(res.data.exercises);
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
        <ExerciseContext.Provider value={{ exercises, addExercise, getExercises ,errors }}>
            {children}
        </ExerciseContext.Provider>
    );
};

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createExercise, getExercisesReq, getExercisesByMg, deleteExercise, updateExercise } from "@/exercises/exercise.api.ts";
import { Exercise } from "@/exercises/exercise.type.ts";
import { useMuscleGroup } from "@/muscleGroups/muscle-group.context.tsx";


interface ExerciseState {
    exercises: Exercise[];
    addExercise: (exercise: Exercise) => void;
    getExercises: (mg: string) => void;
    editarExercise: (exercise: Exercise) => void;
    getAllExercises: () => void;
    removeExercise: (idExcercise: number) => void;
    errors: object | null;
}

const initialExerciseState: ExerciseState = {
    exercises: [],
    addExercise: () => { },
    getExercises: () => { },
    editarExercise: () => { },
    getAllExercises: () => { },
    removeExercise: () => { },
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
    const { muscleGroups } = useMuscleGroup();

    // Se puede crear otro metodo llamado addExerciseByMg o directamente usamos este 
    // Pero hay que modificarlo y agregarlo en el controller
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
    
    const editarExercise = async (exercise: Exercise) => {
        try {
            const mg = exercise.muscleGroups[0].toString(); 
            const muscleGroupMatch = muscleGroups.find(muscleGroup => muscleGroup.nameMuscleGroup === mg);
            const muscleGroupId = muscleGroupMatch ? muscleGroupMatch.idMuscleGroup : null;
            const exerciseUpdated = { 
                ...exercise, 
                muscleGroups: muscleGroupId !== null ? [muscleGroupId] : [] 
            };
            console.log(exerciseUpdated);
            await updateExercise(exerciseUpdated);
            const updatedExercises = await getExercisesByMg(muscleGroupId?.toString() || "");
            setExercises(updatedExercises.data.exercisesDestructurized);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el ejercicio" });
            }
        }
    };

    const getAllExercises = async () => { 
        const res = await getExercisesReq();
        setExercises(res.data.exercises);
    }

    const getExercises = async (mg: string) => {
        if (mg) {
            const res = await getExercisesByMg(mg);
            setExercises(res.data.exercisesDestructurized);
        } else { 
            const res = await getExercisesReq();
            setExercises(res.data.exercises);
        }
  };

    const removeExercise = async (idExercise: number) => {
        try {
            await deleteExercise(idExercise);
            const updatedExercises = await getExercisesReq();
            setExercises(updatedExercises.data.exercises);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al eliminar el ejercicio" });
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
        <ExerciseContext.Provider value={{ exercises, addExercise, editarExercise, getExercises, getAllExercises, removeExercise, errors }}>
            {children}
        </ExerciseContext.Provider>
    );
};

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getTrainingOfTheDay, getAllTrainings, createTraining, deleteTrainingReq } from "@/trainings/training.api.ts";
import { Training } from "@/trainings/trainings.type";


interface TrainingState {
    trainings: Training[];
    training: Training | undefined;
    addTraining: (training: Training) => void;
    getTrainings: () => void;
    getTrainingToDay: (date: string) => object;
    updateTraining: (training: Training) => void;
    deleteTraining: (id: number) => void;
    errors: object | null;
}

const initialTrainingState: TrainingState = {
    trainings: [{
        idTraining: 0,
        user: '',
        trainingName: '',
        trainingType: '',
        day: '',
        startHour: '',
        endHour: '',
        exercisesTrainings: [{ exercise: { name: '', trainingMethod: '', description: '', muscleGroups: [''], difficulty: '', typeExercise:'' }, sets: 0, reps: 0, weight: '', rest: '', idExerciseTraining: 0}],
        completed: false,
    }],
    training: {
        idTraining: 0,
        user: '',
        trainingName: '',
        trainingType: '',
        day: '',
        startHour: '',
        endHour: '',
        exercisesTrainings: [{ exercise: { name: '', trainingMethod: '', description: '', muscleGroups: [''], difficulty: '', typeExercise:'' }, sets: 0, reps: 0, weight: '', rest: '', idExerciseTraining: 0}],
        completed: false,
    },
    addTraining: () => { },
    getTrainings: () => { },
    getTrainingToDay: () => ({}),
    updateTraining: () => { },
    deleteTraining: () => { },
    errors: null,
};
export const TrainingContext = createContext(initialTrainingState);

// eslint-disable-next-line react-refresh/only-export-components
export const useTraining = () => {
    const context = useContext(TrainingContext);

    if (!context) {
        throw new Error("useTraining must be used within an TrainingProvider");
    }
    return context;
};

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [training, setTraining] = useState<Training>();
    const [errors, setErrors] = useState<object | null>(null);

    const addTraining = async (training: Training) => {
        try {
            await createTraining(training);
            setTrainings([...trainings, training]);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el ejercicio" });
            }
        }
    };

    const getTrainingToDay = async (date: string) => {
        try {
            const res = await getTrainingOfTheDay(date);
            setTraining(res.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al obtener el entrenamiento" });
            }
        }
    };

    const getTrainings = async () => {
        try {
            const res = await getAllTrainings();
            setTrainings(res.data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al obtener los ejercicios" });
            }
    
        }
    };

    const updateTraining = async (training: Training) => { 
        try {
            await createTraining(training);
            const updatedTrainings = await getAllTrainings();
            setTrainings(updatedTrainings.data.trainings);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el ejercicio" });
            }
        }
    };
    
    const deleteTraining = async (id: number) => {
        try {
            await deleteTrainingReq(id);
            setTrainings(trainings.filter((training) => training.idTraining !== id));
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
        <TrainingContext.Provider value={{ trainings, training ,addTraining, updateTraining ,getTrainings, getTrainingToDay, deleteTraining, errors }}>
            {children}
        </TrainingContext.Provider>
    );
};

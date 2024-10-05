import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getTrainingOfTheDay, getAllTrainings, createTraining, deleteTrainingReq, updateTrainingReq } from "@/trainings/training.api.ts";
import { Training } from "@/trainings/trainings.type";


interface TrainingState {
    trainings: Training[];
    training: Training | undefined;
    addTraining: (training: Training) => void;
    getTrainings: () => void;
    getTrainingToDay: (date: Date) => object;
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
        day: new Date(),
        startHour: '',
        endHour: '',
        trainingItems: [{ exercise: {
            name: '', trainingMethod: '', description: '', muscleGroups: [0], difficulty: '', typeExercise: '',
            idExercise: 0
        }, sets: 0, reps: 0, weight: '', rest: '', idTrainingItem: 0}],
        completed: false,
    }],
    training: {
        idTraining: 0,
        user: '',
        trainingName: '',
        trainingType: '',
        day: new Date(),
        startHour: '',
        endHour: '',
        trainingItems: [{ exercise: {
            name: '', trainingMethod: '', description: '', muscleGroups: [0], difficulty: '', typeExercise: '',
            idExercise: 0
        }, sets: 0, reps: 0, weight: '', rest: '', idTrainingItem: 0}],
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

    const getTrainingToDay = async (date: Date) => {
        try {
            const dateString = date.toISOString().split("T")[0];
            const res = await getTrainingOfTheDay(dateString);
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
            const lastTrainingItem = training.trainingItems[training.trainingItems.length - 1];
            const updatedTraining = {
                ...training,
                trainingItems: [{
                    exercise: lastTrainingItem.exercise.idExercise,
                    sets: lastTrainingItem.sets,
                    reps: lastTrainingItem.reps,
                    weight: lastTrainingItem.weight,
                    rest: lastTrainingItem.rest,
                    comment: lastTrainingItem.comment
                }]
            };
            console.log(updatedTraining);
            await updateTrainingReq(updatedTraining);
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

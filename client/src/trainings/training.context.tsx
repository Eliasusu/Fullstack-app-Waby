import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getTrainingOfTheDay, getAllTrainings, createTraining, deleteTrainingReq, updateTrainingReq } from "@/trainings/training.api.ts";
import { Training } from "@/trainings/trainings.type";
import { TrainingItem } from "@/trainingItem/trainingItems.type";
import { createTrainingItemReq, deleteTrainingItemReq, updateTrainingItemReq } from "@/trainingItem/trainingItem.api.ts";

interface TrainingState {
    trainings: Training[];
    training: Training | undefined;
    addTraining: (training: Training) => void;
    addTrainingItem: (trainingItem: TrainingItem, idTraining: number) => void;
    getTrainings: () => void;
    getTrainingToDay: (date: Date) => object;
    updateTraining: (training: Training) => void;
    updateTrainingItem: (trainingItem: TrainingItem, idTraining:number) => void;
    deleteTraining: (id: number) => void;
    deleteTrainingItem: (id: number, idTraining:number) => void;
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
    addTrainingItem: () => { },
    getTrainings: () => { },
    getTrainingToDay: () => ({}),
    updateTraining: () => { },
    updateTrainingItem: () => { },
    deleteTraining: () => { },
    deleteTrainingItem: () => { },
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

    const addTrainingItem = async (trainingItem: TrainingItem, idTraining: number) => {
        try {
            console.log('trainingItem', trainingItem);
            console.log('idTraining', idTraining);
            const id = idTraining.toString();
            await createTrainingItemReq(trainingItem, id);
            const updatedTrainings = await getAllTrainings();
            setTrainings(updatedTrainings.data.trainings);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al actualizar el entrenamiento" });
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
            await updateTrainingReq(training);
            const updatedTrainings = await getAllTrainings();
            setTrainings(updatedTrainings.data.trainings);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al actualizar el entrenamiento" });
            }
        }
    };

    const updateTrainingItem = async (trainingItem: TrainingItem, idTraining: number) => {
        try {
            console.log('trainingItem', trainingItem);
            console.log('idTraining', idTraining);
            const id = idTraining.toString();
            await updateTrainingItemReq(trainingItem, id);
            const updatedTrainings = await getAllTrainings();
            setTrainings(updatedTrainings.data.trainings);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al actualizar el entrenamiento" });
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
                setErrors({ message: "Hubo un problema al eliminar el entrenamiento" });
            }
    
        }
    };

    const deleteTrainingItem = async (idItem: number, idTraining: number) => { 
        try {
            const idStr = idItem.toString();
            const idTrainingStr = idTraining.toString();
            await deleteTrainingItemReq(idStr, idTrainingStr);
            const updatedTrainings = await getAllTrainings();
            setTrainings(updatedTrainings.data.trainings);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al eliminar el entrenamiento" });
            }
        }
    }

    useEffect(() => {
        if (errors) {
            const timer = setTimeout(() => {
                setErrors(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <TrainingContext.Provider value={{ trainings, training ,addTraining, addTrainingItem, updateTraining, updateTrainingItem, getTrainings, getTrainingToDay, deleteTraining, deleteTrainingItem, errors }}>
            {children}
        </TrainingContext.Provider>
    );
};

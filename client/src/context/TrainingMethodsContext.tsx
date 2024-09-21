import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getOneTrainingMethod, getTrainingMethods } from "@/api/trainingMethods.ts";
import { TrainingMethod } from "@/types/trainingMethod.type.ts";

interface TrainingMethodState {
    trainingMethod: TrainingMethod;
    trainingMethods: TrainingMethod[];
    getTraining: (id: string) => void;
    getAllTrainingMethods: () => void;
    errors: object | null;
}

const initialTrainingMethodState: TrainingMethodState = {
    trainingMethod: {
        idMethod: "",
        nameMethod: "",
        description: "",
        users: [],
    },
    trainingMethods: [],
    getTraining: () => { },
    errors: null,
    getAllTrainingMethods: () => { },
};

export const TrainingMethodContext = createContext(initialTrainingMethodState);

// eslint-disable-next-line react-refresh/only-export-components

// eslint-disable-next-line react-refresh/only-export-components
export const useTrainingMethod = () => {
    const context = useContext(TrainingMethodContext);

    if (!context) {
        throw new Error("useTrainingMethod must be used within an TrainingMethodProvider");
    }
    return context;
};

export const TrainingMethodProvider = ({ children }: { children: ReactNode }) => {
    const [trainingMethod, setTrainingMethod] = useState<TrainingMethod>({
        idMethod: "",
        nameMethod: "",
        description: "",
        users: [],
    });
    const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([]);
    const [errors, setErrors] = useState<object | null>(null);

    const getTraining = async (name: string) => {
        try {
            const res = await getOneTrainingMethod(name);
            setTrainingMethod(res.data.trainingMethod);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    };

    const getAllTrainingMethods = async () => {
        try {
            const res = await getTrainingMethods();
            setTrainingMethods(res.data.trainingMethods);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al obtener los métodos de entrenamiento" });
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
        <TrainingMethodContext.Provider value={{ trainingMethod, trainingMethods, getTraining, getAllTrainingMethods, errors }}>
            {children}
        </TrainingMethodContext.Provider>
    );
};
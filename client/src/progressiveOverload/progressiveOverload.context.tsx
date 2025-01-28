import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {createProgressiveOverload, deleteProgressiveOverload, getProgressiveOverloadsReq, getProgressiveOverloadsByExercise, updateProgressiveOverload, getProgressiveOverload} from "@/progressiveOverload/progressiveOverload.api";
import { ProgressiveOverload } from "@/progressiveOverload/progressiveOverload.type";

interface ProgressiveOverloadState {
    progressiveOverload: ProgressiveOverload;
    progressiveOverloads: ProgressiveOverload[];
    getAll: () => void;
    getByExercise: (id: number) => void;
    getOne: (id: number) => void;
    create: (progressiveOverload: object) => void;
    update: (progressiveOverload: ProgressiveOverload) => void;
    remove: (id: number) => void;
    errors: object | null;
}

const initialProgressiveOverloadState: ProgressiveOverloadState = {
    progressiveOverload: {
        idProgressiveOverload: 0,
        name: "",
        exercise: "",
        user: "",
        weightLifted: "",
        weightGoal: "",
        repsDone: "",
        repsGoal: "",
        secDone: "",
        secGoal: "",
        logDate: new Date(),
    },
    progressiveOverloads: [],
    getAll: () => { },
    getOne: () => { },
    getByExercise: () => { },
    create: () => { },
    update: () => { },
    remove: () => { },
    errors: null,
};

export const ProgressiveOverloadContext = createContext(initialProgressiveOverloadState);

export const useProgressiveOverload = () => {
    const context = useContext(ProgressiveOverloadContext);

    if (!context) {
        throw new Error("useProgressiveOverload must be used within an ProgressiveOverloadProvider");
    }
    return context;
}

export const ProgressiveOverloadProvider = ({ children }: { children: ReactNode }) => {
    const [progressiveOverload, setProgressiveOverload] = useState<ProgressiveOverload>({
        idProgressiveOverload: 0,
        name: "",
        exercise: "",
        user: "",
        weightLifted: "",
        weightGoal: "",
        repsDone: "",
        repsGoal: "",
        secDone: "",
        secGoal: "",
        logDate: new Date(),
    });
    const [progressiveOverloads, setProgressiveOverloads] = useState<ProgressiveOverload[]>([]);
    const [errors, setErrors] = useState<object | null>(null);


    const getOne = async (id: number) => {
        try {
            const res = await getProgressiveOverload(id);
            setProgressiveOverload(res.data.progressiveOverload);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    }    

    const getAll = async () => {
        try {
            const res = await getProgressiveOverloadsReq();
            setProgressiveOverloads(res.data.progressiveOverloads);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    }


    const getByExercise = async (id: number) => {
        try {
            const res = await getProgressiveOverloadsByExercise(id);
            setProgressiveOverloads(res.data.progressiveOverloads);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    }

    const create = async (progressiveOverload: object) => {
        try {
            await createProgressiveOverload(progressiveOverload);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    }

    const update = async (progressiveOverload: ProgressiveOverload) => {
        try {
            await updateProgressiveOverload(progressiveOverload);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
            }
        }
    }

    const remove = async (id: number) => {
        try {
            await deleteProgressiveOverload(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el método de entrenamiento" });
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
        <ProgressiveOverloadContext.Provider value={{ progressiveOverload, progressiveOverloads, getOne,getAll, getByExercise, create, update, remove, errors }}>
            {children}
        </ProgressiveOverloadContext.Provider>
    );
  
  }
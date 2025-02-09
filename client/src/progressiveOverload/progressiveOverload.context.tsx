import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createProgressiveOverload, deleteProgressiveOverload, getProgressiveOverloadsReq, getProgressiveOverloadsByExercise, updateProgressiveOverload, getProgressiveOverload } from "@/progressiveOverload/progressiveOverload.api";
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
        typePO: "",
        done: 0,
        goal: 0,
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

// eslint-disable-next-line react-refresh/only-export-components
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
        typePO: "",
        done: 0,
        goal: 0,
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
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
            }
        }
    }

    const getAll = async () => {
        try {
            const res = await getProgressiveOverloadsReq();
            console.log('res.data.progressiveOverloads', res.data.progressiveOverloads)
            setProgressiveOverloads(res.data.progressiveOverloads);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
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
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
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
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
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
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
            }
        }
    }

    const remove = async (id: number) => {
        console.log('entre al remove del context')
        try {
            await deleteProgressiveOverload(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar la sobrecarga progresiva" });
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
        <ProgressiveOverloadContext.Provider value={{ progressiveOverload, progressiveOverloads, getOne, getAll, getByExercise, create, update, remove, errors }}>
            {children}
        </ProgressiveOverloadContext.Provider>
    );

}
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { createProgressiveOverload, deleteProgressiveOverload, getProgressiveOverloadsReq, getProgressiveOverloadsByExercise, updateProgressiveOverload, getProgressiveOverload } from "@/progressiveOverload/progressiveOverload.api";
import { ProgressiveOverload } from "@/progressiveOverload/progressiveOverload.type";

interface Error {
    code: string;
    minimum?: number;
    type: string;
    inclusive?: boolean;
    exact?: boolean;
    message: string;
    path: string[];
    expected?: string;
    received?: string;
}

interface ProgressiveOverloadState {
    progressiveOverload: ProgressiveOverload;
    progressiveOverloads: ProgressiveOverload[];
    getAll: () => void;
    getByExercise: (id: number) => void;
    getOne: (id: number) => void;
    create: (progressiveOverload: object) => void;
    update: (progressiveOverload: ProgressiveOverload) => void;
    remove: (id: number) => void;
    errors: Error[] | null;
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
    const [errors, setErrors] = useState<Error[] | null>(null);


    const getOne = async (id: number) => {
        try {
            const res = await getProgressiveOverload(id);
            setProgressiveOverload(res.data.progressiveOverload);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
            }
        }
    }

    const getAll = async () => {
        try {
            const res = await getProgressiveOverloadsReq();
            setProgressiveOverloads(res.data.progressiveOverloads);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
            }
        }
    }


    const getByExercise = async (id: number) => {
        try {
            const res = await getProgressiveOverloadsByExercise(id);
            setProgressiveOverloads(res.data.progressiveOverloads);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
            }
        }
    }

    const create = async (progressiveOverload: object) => {
        try {
            await createProgressiveOverload(progressiveOverload);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const errorMessages = (error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues;
                setErrors(errorMessages);
            }
        }
    }

    const update = async (progressiveOverload: ProgressiveOverload) => {
        try {
            await updateProgressiveOverload(progressiveOverload);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
            }
        }
    }

    const remove = async (id: number) => {
        try {
            await deleteProgressiveOverload(id);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                setErrors((error as { response: { data: { message: { issues: Error[] } } } }).response.data.message.issues);
            }
        }
    }

    useEffect(() => {
        console.log('Errors actualizados en useEffect:', errors);
    }, [errors]);

    return (
        <ProgressiveOverloadContext.Provider value={{ progressiveOverload, progressiveOverloads, getOne, getAll, getByExercise, create, update, remove, errors }}>
            {children}
        </ProgressiveOverloadContext.Provider>
    );

}
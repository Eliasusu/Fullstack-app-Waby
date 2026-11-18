/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { TrainingMethod } from "@waby/shared";
import { getTrainingMethods } from "@/trainingMethods/training-method.api.ts";
import { useLoader } from "@/lib/load.ts";

interface TrainingMethodState {
    trainingMethods: TrainingMethod[];
    loading: boolean;
    getAllTrainingMethods: () => Promise<void>;
}

export const TrainingMethodContext = createContext<TrainingMethodState>({
    trainingMethods: [],
    loading: false,
    getAllTrainingMethods: async () => { },
});

export const useTrainingMethod = () => useContext(TrainingMethodContext);

export const TrainingMethodProvider = ({ children }: { children: ReactNode }) => {
    const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([]);

    const { loading, run } = useLoader();

    /** Si la carga falla avisa con un toast (nota 63). */
    const getAllTrainingMethods = async () => {
        await run(async () => {
            const res = await getTrainingMethods();
            setTrainingMethods(res.data);
        });
    };

    return (
        <TrainingMethodContext.Provider value={{ trainingMethods, loading, getAllTrainingMethods }}>
            {children}
        </TrainingMethodContext.Provider>
    );
};

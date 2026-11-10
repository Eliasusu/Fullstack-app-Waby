/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { TrainingMethod } from "@waby/shared";
import { getTrainingMethods } from "@/trainingMethods/training-method.api.ts";

interface TrainingMethodState {
    trainingMethods: TrainingMethod[];
    getAllTrainingMethods: () => Promise<void>;
}

export const TrainingMethodContext = createContext<TrainingMethodState>({
    trainingMethods: [],
    getAllTrainingMethods: async () => { },
});

export const useTrainingMethod = () => useContext(TrainingMethodContext);

export const TrainingMethodProvider = ({ children }: { children: ReactNode }) => {
    const [trainingMethods, setTrainingMethods] = useState<TrainingMethod[]>([]);

    const getAllTrainingMethods = async () => {
        const res = await getTrainingMethods();
        setTrainingMethods(res.data);
    };

    return (
        <TrainingMethodContext.Provider value={{ trainingMethods, getAllTrainingMethods }}>
            {children}
        </TrainingMethodContext.Provider>
    );
};

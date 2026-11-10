/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { MuscleGroup } from "@waby/shared";
import { getAllMuscleGroups } from "./muscle-group.api.ts";

interface MuscleGroupState {
    muscleGroups: MuscleGroup[];
    getAllMGS: () => Promise<void>;
}

export const MuscleGroupContext = createContext<MuscleGroupState>({
    muscleGroups: [],
    getAllMGS: async () => { },
});

export const useMuscleGroup = () => useContext(MuscleGroupContext);

export const MuscleGroupProvider = ({ children }: { children: ReactNode }) => {
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

    const getAllMGS = async () => {
        const res = await getAllMuscleGroups();
        setMuscleGroups(res.data);
    };

    return (
        <MuscleGroupContext.Provider value={{ muscleGroups, getAllMGS }}>
            {children}
        </MuscleGroupContext.Provider>
    );
}

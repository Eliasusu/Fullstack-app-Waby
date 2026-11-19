/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import type { MuscleGroup } from "@waby/shared";
import { getAllMuscleGroups } from "./muscle-group.api.ts";
import { useLoader } from "@/lib/load.ts";

interface MuscleGroupState {
    muscleGroups: MuscleGroup[];
    loading: boolean;
    getAllMGS: () => Promise<void>;
}

export const MuscleGroupContext = createContext<MuscleGroupState>({
    muscleGroups: [],
    loading: false,
    getAllMGS: async () => { },
});

export const useMuscleGroup = () => useContext(MuscleGroupContext);

export const MuscleGroupProvider = ({ children }: { children: ReactNode }) => {
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

    const { loading, run } = useLoader();

    /** Si la carga falla avisa con un toast (nota 63). */
    const getAllMGS = async () => {
        await run(async () => {
            const res = await getAllMuscleGroups();
            setMuscleGroups(res.data);
        });
    };

    return (
        <MuscleGroupContext.Provider value={{ muscleGroups, loading, getAllMGS }}>
            {children}
        </MuscleGroupContext.Provider>
    );
}

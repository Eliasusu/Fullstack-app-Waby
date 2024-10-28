import {createContext, ReactNode, useContext, useState} from "react";
import { getAllMuscleGroups, getMuscleGroup  } from "./muscle-group.api.ts";
import { MuscleGroup } from "./muscleGroup.type.ts";


interface MuscleGroupState {
    muscleGroup: MuscleGroup;
    muscleGroups: MuscleGroup[];
    getMG: (id: number) => void;
    getAllMGS: () => void;
    errors: object | null;
}

const initialMuscleGroupState: MuscleGroupState = { 
    muscleGroup: {
        idMuscleGroup: 0,
        nameMuscleGroup: "",
        description: "",
        imageMuscleGroup: "",
    },
    muscleGroups: [],
    getMG: () => { },

    getAllMGS: () => { },
    errors: null,
};

export const MuscleGroupContext = createContext(initialMuscleGroupState);

// eslint-disable-next-line react-refresh/only-export-components

// eslint-disable-next-line react-refresh/only-export-components
export const useMuscleGroup = () => {
    const context = useContext(MuscleGroupContext);

    if (!context) {
        throw new Error("useMuscleGroup must be used within an MuscleGroupProvider");
    }
    return context;
};

export const MuscleGroupProvider = ({ children }: { children: ReactNode }) => {
    const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>({
        idMuscleGroup: 0,
        nameMuscleGroup: "",
        description: "",
        imageMuscleGroup: "",
    });
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [errors, setErrors] = useState<object | null>(null);

    const getMG = async (id: number) => {
        try {
            const res = await getMuscleGroup(id);
            setMuscleGroup(res.data.muscleGroup);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el grupo muscular" });
            }
        }
    };

    /*const getMGByName = async (name: string) => {
        try {
            const res = await getMuscleGroupByName(name);
            setMuscleGroup(res.data.muscleGroup);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el grupo muscular" });
            }
        }
    };*/

    const getAllMGS = async () => {
        try {
            const res = await getAllMuscleGroups();
            setMuscleGroups(res.data.muscleGroups);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ message: error.message });
            } else {
                setErrors({ message: "Hubo un problema al guardar el grupo muscular" });
            }
        }
    };

    return (
        <MuscleGroupContext.Provider value={{ muscleGroup, muscleGroups, getMG, getAllMGS, errors }}>
            {children}
        </MuscleGroupContext.Provider>
    );
}
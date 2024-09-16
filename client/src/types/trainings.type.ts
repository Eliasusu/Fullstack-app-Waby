
import { ExerciseTraining } from "@/types/exercisesTrainings.type.ts";
import { Mesocycle } from "@/types/mesocycle.type.ts";

export interface Training {
    idTraining?: number;
    user: string;
    mesocycle?: Mesocycle;
    trainingName: string;
    trainingType: string;
    day: Date;
    time: string;
    completed: boolean;
    exercisesTrainings?: ExerciseTraining[];
}
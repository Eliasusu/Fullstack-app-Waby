import { User } from "@/types/user.type.ts"
import { ExerciseTraining } from "@/types/exercisesTrainings.type.ts";
import { Mesocycle } from "@/types/mesocycle.type.ts";

export interface Training {
    idTraining?: number;
    user: User;
    mesocycle: Mesocycle;
    trainingName: string;
    trainingType: string;
    day: Date;
    time: string;
    completed?: boolean;
    exercisesTrainings?: ExerciseTraining[];
}
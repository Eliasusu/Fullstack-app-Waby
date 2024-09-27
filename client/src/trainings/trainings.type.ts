
import { ExerciseTraining } from "@/exercises_trainings/exercisesTrainings.type";
import { Mesocycle } from "@/mesocycles/mesocycle.type";

export interface Training {
    idTraining?: number;
    user:string;
    mesocycle?: Mesocycle;
    trainingName: string;
    trainingType: string;
    day: string;
    startHour: string;
    endHour: string;
    completed: boolean;
    exercisesTrainings: ExerciseTraining[];
}
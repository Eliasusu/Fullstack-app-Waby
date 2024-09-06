import { Training } from "@/types/trainings.type.ts";
import { Exercise } from "@/types/exercise.type.ts";

export interface ExerciseTraining { 
    idExerciseTraining?: number;
    sets: number;
    reps: number;
    weight: number;
    rest: string;
    comment?: string;
    exercise: Exercise["name"];
    training?: Training["trainingName"];
}
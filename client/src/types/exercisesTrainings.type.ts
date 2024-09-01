import { Training } from "@/types/trainings.type.ts";
import { Exercise } from "@/types/exercise.type.ts";

export interface ExerciseTraining { 
    idExerciseTraining?: number;
    sets: number;
    reps: number;
    weight: number;
    rest: number;
    comment?: string;
    exercise: Exercise;
    training: Training;
}
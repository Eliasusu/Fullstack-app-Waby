import { Exercise } from "@/exercises/exercise.type.ts";

export interface ExerciseTraining { 
    idExerciseTraining: number;
    sets: number;
    reps: number;
    weight: string;
    rest: string;
    comment?: string;
    exercise: Exercise;
    training?: string;
}
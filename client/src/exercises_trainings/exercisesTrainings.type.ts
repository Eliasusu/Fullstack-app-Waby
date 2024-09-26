import { Exercise } from "./exercise.type.ts";

export interface ExerciseTraining { 
    idExerciseTraining?: number;
    sets: number;
    reps: number;
    weight: number;
    rest: string;
    comment?: string;
    exercise: Exercise;
    training?: string;
}
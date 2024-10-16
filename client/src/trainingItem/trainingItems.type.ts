import { Exercise } from "@/exercises/exercise.type.ts";

export interface TrainingItem { 
    idTrainingItem?: number;
    sets: number;
    reps: number;
    weight: string;
    rest: string;
    comment?: string;
    exercise: Exercise;
    training?: string;
    completeExercise?: boolean;
}


export interface TrainingItemProps {
    exercise: number,
    sets: number;
    reps: number;
    weight: string;
    rest: string;
    comment?: string;
    completeExercise?: boolean;
}
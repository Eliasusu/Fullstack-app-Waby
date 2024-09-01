import { Exercise } from '@/types/exercise.type';

export interface MuscleGroup {
    idMuscleGroup?: number;
    nameMuscleGroup: string;
    description: string;
    imageMuscleGroup?: string;
    exercises: Exercise[];
}
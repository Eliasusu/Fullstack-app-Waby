
import { MuscleGroup } from './muscleGroup.models';
import { TrainingMethod } from './trainingMethod.models';

export type Exercise = {
    idExercise?: number;
    name: string,
    trainingMethod: TrainingMethod,
    description: string,
    videoUrl?: string | null,
    image?: string | null,
    muscleGroups: MuscleGroup[],
    difficulty: string,
    typeExercise: string,
    date?: Date    
}
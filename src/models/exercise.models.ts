
import { MuscleGroup } from './muscleGroup.models';
import { TrainingMethod } from './trainingMethod.models';

export class Exercise {
    public idExercise: number;
    constructor(
        public name: string,
        public trainingMethod: TrainingMethod,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
        public difficulty: string,
        public typeExercise: string,
        public date: Date    
    ){}
}
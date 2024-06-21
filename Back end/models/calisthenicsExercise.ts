import { Training } from './training';
import { MuscleGroup } from './muscleGroup';
import { TrainingMethod } from './trainingMethod';
import { generateId } from './common/generateId';

export class CalisthenicsExercise {
    public idExercise: string;
    constructor(
        public training: Training | null,
        public name: string,
        public trainingMethod: TrainingMethod,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
        public difficulty: string,
        public typeExercise: string,
        public date: Date
    ) {
        this.idExercise = generateId();
    }
}
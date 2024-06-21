import { Training } from './training';
import { MuscleGroup } from './muscleGroup';
import { generateId } from './common/generateId';

export class GymExercise {
    public idExercise: string;
    constructor(
        public training: Training | null,
        public name: string,
        public trainingMethod: string,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
        public difficulty: string,
        public typeExercise: string,
        public date: Date        
    ){
        this.idExercise = generateId();
    }
}
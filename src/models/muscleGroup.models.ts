import { Exercise } from './exercise.models';

export class MuscleGroup {
    public idMuscleGroup: number;
    constructor(
        public nameMuscleGroup: string,
        public description: string | null,
        public imageMuscleGroup: string | null
    ){}
}
import { Exercise } from './exercise';

export class MuscleGroup {
    public idMuscleGroup: number;
    constructor(
        public nameMuscleGroup: string,
        public description: string | null,
        public imageMuscleGroup: string | null
    ){}
}
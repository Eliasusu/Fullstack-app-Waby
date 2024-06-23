import { Exercise } from './exercise';

export class MuscleGroup {
    public idMuscleGroup: number;
    constructor(
        public exercise: Exercise,
        public nameMuscleGroup: string,
        public descriptionMuscleGroup: string | null,
        public imageMuscleGroup: string | null
    ){}
}
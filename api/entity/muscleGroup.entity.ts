import { Exercise } from './exercise.entity';

export class MuscleGroup {
    constructor(
        public idMuscleGroup: string,
        public nameMuscleGroup: string,
        public description: string ,
        public imageMuscleGroup: string
    ){}
}
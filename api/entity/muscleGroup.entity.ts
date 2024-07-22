import { Exercise } from './exercise.entity';

export class MuscleGroup {
    constructor(
        public nameMuscleGroup: string,
        public description: string ,
        public imageMuscleGroup?: string,
        public idMuscleGroup?: number,
    ){}
}
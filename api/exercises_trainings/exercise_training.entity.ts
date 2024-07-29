import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

export class Exercise_Training {
    constructor(
        public training: Training,
        public exercise: Exercise,
        public sets: number,
        public reps: number,
        public weight: number,
        public rest: number,
        public comment: string,
    ) { }
}
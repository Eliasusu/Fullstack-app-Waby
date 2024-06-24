import { Training } from './training.models.ts';
import { Exercise } from './exercise.models.ts';

export class Routine {
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
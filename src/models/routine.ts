import { Training } from './training';
import { Exercise } from './exercise';

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
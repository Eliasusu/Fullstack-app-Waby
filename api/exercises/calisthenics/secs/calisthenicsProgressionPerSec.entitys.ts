import { Exercise } from "../../exercise.entity.js";

export class CalisthenicsProgressionPerSec {
    constructor(
        public idProgression: number,
        public exercise: Exercise,
        public nameProgression: string,
        public orderProgression: number,
        public numberSecNeeded: number,
        public numberRepsNeeded: number
    ){}
}
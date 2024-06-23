import { Exercise } from "./exercise";

export class CalisthenicsProgressionPerSec {
    public idProgression: number;
    constructor(
        public exercise: Exercise,
        public nameProgression: string,
        public orderProgression: number,
        public numberSecNeeded: number,
        public numberRepsNeeded: number
    ){}
}
import { Exercise } from "./exercise";


export class CalisthenicsProgressionPerReps {
    public idProgression: number;
    constructor(
        public exercise: Exercise,
        public nameProgression: string,
        public orderProgression: number,
        public numberSeriesNeeded: number,
        public numberRepsNeeded: number
    ){}
}
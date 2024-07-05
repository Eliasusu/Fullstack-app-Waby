import { Exercise } from "./exercise.entity";


export class CalisthenicsProgressionPerReps {
    constructor(
        public idProgression: number,
        public exercise: Exercise,
        public nameProgression: string,
        public orderProgression: number,
        public numberSeriesNeeded: number,
        public numberRepsNeeded: number
    ){}
}
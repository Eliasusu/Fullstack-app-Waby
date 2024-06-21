import { Exercise } from "./exercise";
import { Training } from "./training";


export class CalisthenicsProgressionPerSec {
    constructor(
        exercise: Exercise,
        idProgression: number,
        training: Training | null,
        nameProgression: string,
        orderProgression: number,
        numberSecNeeded: number,
        numberRepsNeeded: number
    ){}
}
import { Exercise} from "./exercise";
import { Training } from "./training";


export class CalisthenicsProgressionPerReps {
    constructor(
        exercise: Exercise,
        idProgression: number,
        training: Training | null,
        nameProgression: string,
        orderProgression: number,
        numberSeriesNeeded: number,
        numberRepsNeeded: number
    ){}
}
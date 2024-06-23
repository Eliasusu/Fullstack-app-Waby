import { User } from './user';
import { Exercise } from './exercise';
import { generateId } from './common/generateId';


export class CalisthenicsGoal {
    public idGoal: string | null;
    constructor(
        public user: User,
        public goalOption: string,
        public startDate: Date,
        public deadline: Date,
        public goalExercise: Exercise,
        public numberInitialReps: number | null,
        public numberInitialSec: number | null,
        public numberInitialSets: number,
    ){
        this.idGoal = generateId();
    }
}
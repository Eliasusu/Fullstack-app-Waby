import { User } from './user';
import { CalisthenicsExercise } from './CalisthenicsExercise';
import { generateId } from './common/generateId';


export class CalisthenicsGoal {
    public idGoal: string | null;
    constructor(
        public user: User,
        public goalOption: string,
        public startDate: Date,
        public deadline: Date,
        public goalExercise: CalisthenicsExercise,
        public numberInitialReps: number | null,
        public numberInitialSec: number | null,
        public numberInitialSets: number,
    ){
        this.idGoal = generateId();
    }
}
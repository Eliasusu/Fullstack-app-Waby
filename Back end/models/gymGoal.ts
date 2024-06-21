import { User } from './user';
import { GymExercise } from './GymExercise';
import { generateId } from './common/generateId';


export class CalisthenicsGoal {
    public idGoal: string | null;
    constructor(
        public user: User,
        public goalOption: string,
        public startDate: Date,
        public deadline: Date,
        public goalExercise: GymExercise,
        public initialPr: number,
    ){
        this.idGoal = generateId();
    }
}
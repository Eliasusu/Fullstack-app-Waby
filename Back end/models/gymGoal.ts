import { User } from './user';
import { Exercise } from './exercise';
import { generateId } from './common/generateId';


export class GymGoal {
    public idGoal: string | null;
    constructor(
        public user: User,
        public goalOption: string,
        public startDate: Date,
        public deadline: Date,
        public goalExercise: Exercise,
        public initialPr: number,
    ){
        this.idGoal = generateId();
    }
}
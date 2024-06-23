import { User } from './user';
import { Mesocycle } from './mesocycle';

export class Training{
    public idTraining: number;
    constructor(
        public user: User,
        public mesocycle: Mesocycle,
        public trainingName: string,
        public trainingType: string,
        public day: Date,
        public time: string,
    ){}
}
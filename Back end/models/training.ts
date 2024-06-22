import { User } from './user';
import { Mesocycle } from './mesocycle';

export class Training{
    public idTraining: number;
    constructor(
        public user: User,
        public mesocycle: Mesocycle,
        public trainingType: string,
        public day: Date,
    ){}
}
import { User } from './user.models';
import { Mesocycle } from './mesocycle.models.ts';

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
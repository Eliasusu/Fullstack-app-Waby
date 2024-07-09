import { User } from './user.entity';
import { Mesocycle } from './mesocycle.entity.js';
import { Exercise } from './exercise.entity.js';

export class Training{
    constructor(
        public user: User,
        public mesocycle: Mesocycle,
        public trainingName: string,
        public trainingType: string,
        public day: Date,
        public time: string,
        public idTraining?:string,
    ){}
} 
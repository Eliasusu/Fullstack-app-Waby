import { generateId } from '../shared/generateId';
import { TrainingMethod } from './trainingMethod.entity';

export class User {
    public idUser: string;
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public name: string,
        public birthdate: Date,
        public phone: string,
        public bodyWeight: number,
        public height: number,
        public trainingMethod: TrainingMethod
    ) {
        this.idUser = generateId();
    }
}
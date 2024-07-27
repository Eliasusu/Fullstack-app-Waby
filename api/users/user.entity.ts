import { generateId } from '../shared/generateId.js';

export class User {
    public idUser?: string;
    constructor(
        public username: string,
        public password: string,
        public email: string,
        public name: string,
        public birthdate: Date,
        public phone: string,
        public bodyWeight: number,
        public height: number,
    ) {
        this.idUser = generateId();
    }
}
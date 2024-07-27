import { Training } from "./training.entity.js";

export class Mesocycle {
    constructor( 
        public idMesocycle: number,
        public typeMesocycle: string,
        public startDate: Date,
        public endDate: Date,
    ) {}
}
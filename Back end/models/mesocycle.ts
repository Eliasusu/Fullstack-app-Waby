import { Routine } from './routine';

export class Mesocycle {
    public idMesocycle: number;
    constructor( 
        public typeMesocycle: string,
        public routines: Routine[],
        public startDate: Date,
        public endDate: Date,
    ) {}
}
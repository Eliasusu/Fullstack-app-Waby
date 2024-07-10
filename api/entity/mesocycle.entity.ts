import { Routine } from './routine.entity';

export class Mesocycle {
    constructor( 
        public idMesocycle: string,
        public typeMesocycle: string,
        public startDate: Date,
        public endDate: Date,
    ) {}
}
import { Training } from "../trainings/training.entity.js";
import { Collection, PrimaryKey, Property, Cascade, OneToMany } from '@mikro-orm/core';

export class Mesocycle {
 
    @PrimaryKey( { nullable: false })
    idMesocycle!: number;

    @Property({ nullable: false })
    typeMesocycle!: string;

    @Property({ nullable: false })
    
    @Property({ nullable: false })
    startDate!: Date;

    @Property({ nullable: false })
    endDate!: Date;

    @OneToMany(() => Training, (training) => training.mesocycle, {
        cascade: [Cascade.ALL],
    })
    trainings = new Collection<Training>(this);
}
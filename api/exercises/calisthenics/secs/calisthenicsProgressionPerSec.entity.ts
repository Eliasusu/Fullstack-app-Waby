import { Collection, PrimaryKey, Property, ManyToOne, Rel, Entity } from '@mikro-orm/core';
import { Exercise } from "../../exercise.entity.js";

@Entity()
export class CalisthenicsProgressionPerSec {
    @PrimaryKey()
    idProgression?: number;

    @ManyToOne(() => Exercise, { nullable: false })
    exercise!: Rel<Exercise>;

    @Property({ nullable: false, unique: true})
    nameProgression?: string;

    @Property({ nullable: false })
    orderProgression?: number;

    @Property({ nullable: false })
    numberSecNeeded?: number;

    @Property({ nullable: false })
    numberRepsNeeded?: number;

}
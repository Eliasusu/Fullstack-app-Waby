import { PrimaryKey, Property, ManyToOne, Rel, Entity } from '@mikro-orm/core';
import { Exercise } from "../../exercise.entity.js";

@Entity()
export class ProgressionSec {
    @PrimaryKey()
    idProgression?: number;

    @ManyToOne(() => Exercise, { nullable: false })
    exercise!: Rel<Exercise>;

    @Property({ nullable: false, unique: true})
    nameProgression?: string;

    @Property({ nullable: false })
    orderProgression?: number;

    @Property({ nullable: false })
    numberSetsNeeded?: number;

    @Property({ nullable: false })
    numberSecNeeded?: number;

}
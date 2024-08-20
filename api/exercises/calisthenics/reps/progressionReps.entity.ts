import { PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { Exercise } from "../../exercise.entity.js";

@Entity()
export class ProgressionReps {
    @PrimaryKey()
    idProgression?: number;

    @ManyToOne(() => Exercise)
    exercise?: Rel<Exercise>;

    @Property({ nullable: true, unique: true})
    nameProgression?: string;

    @Property({ nullable: true })
    orderProgression?: number;

    @Property({ nullable: true })
    numberSetsNeeded?: number;

    @Property({ nullable: true })
    numberRepsNeeded?: number;
}
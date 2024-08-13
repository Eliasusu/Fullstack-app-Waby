import { Collection, ManyToMany, PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { Exercise } from "../../exercise.entity.js";

@Entity()
export class CalisthenicsProgressionPerReps {
    @PrimaryKey()
    idProgression!: number;

    @ManyToOne(() => Exercise, { nullable: false })
    exercise!: Rel<Exercise>;

    @Property({ nullable: false, unique: true})
    nameProgression!: string;

    @Property({ nullable: false })
    orderProgression!: number;

    @Property({ nullable: false })
    numberSeriesNeeded!: number;

    @Property({ nullable: false })
    numberRepsNeeded!: number;
}
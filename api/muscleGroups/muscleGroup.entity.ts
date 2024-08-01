import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel } from '@mikro-orm/core';
import { Exercise } from '../exercises/exercise.entity.js';

export class MuscleGroup {
    @PrimaryKey({ autoincrement: true })
    idMuscleGroup?: number;

    @Property({ nullable: false })
    nameMuscleGroup!: string;

    @Property({ nullable: false })
    description!: string;

    @Property({ nullable: true })
    imageMuscleGroup?: string;

    @ManyToMany(() => Exercise, (exercise) => exercise.muscleGroups, {
        cascade: [Cascade.ALL],
        owner: true,
    })
    exercises = new Collection<Exercise>(this);
}
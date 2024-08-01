import { Collection, ManyToMany, PrimaryKey, Property, Cascade, Entity } from '@mikro-orm/core';
import { Exercise } from '../exercises/exercise.entity.js';

@Entity()
export class MuscleGroup {
    @PrimaryKey()
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
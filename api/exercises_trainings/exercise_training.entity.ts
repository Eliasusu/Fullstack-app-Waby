
import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, OneToMany } from '@mikro-orm/core';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

export class Exercise_Training {
    @OneToMany(() => Training, (training) => training.exercises_trainings, {
        cascade: [Cascade.ALL],
    })
    training!: Rel<Training>;

    @OneToMany(() => Exercise, (exercise) => exercise.exercises_trainings, {
        cascade: [Cascade.ALL],
    })
    exercise!: Rel<Exercise>;

    @Property({ nullable: false })
    sets!: number;

    @Property({ nullable: false })
    reps!: number;

    @Property({ nullable: false })
    weight!: number;

    @Property({ nullable: false })
    rest!: number;

    @Property({ nullable: true })
    comment?: string;
}
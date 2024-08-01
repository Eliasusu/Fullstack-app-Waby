
import { Property, Cascade, Entity, Rel, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

@Entity()
export class Exercise_Training {
    @PrimaryKey()
    idExercise_Training?: number;

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
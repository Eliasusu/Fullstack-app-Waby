
import { Property, Entity, Rel, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

@Entity()
export class ExerciseTraining {
    @PrimaryKey({type: 'number', autoincrement: true })
    idTrainingExercise!: number;

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
    
    @ManyToOne(() => Exercise, { nullable: false }) 
    exercise!: Rel<Exercise>;

    @ManyToOne(() => Training, { nullable: false })
    training!: Rel<Training>;
}
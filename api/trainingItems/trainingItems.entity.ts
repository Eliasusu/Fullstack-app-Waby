
import { Property, Entity, Rel, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

@Entity()
export class trainingItem {
    @PrimaryKey({type: 'number', autoincrement: true })
    idTrainingItem?: number;

    @Property({ nullable: false })
    sets!: number;

    @Property({ nullable: false })
    reps!: number;

    @Property({ nullable: false })
    weight!: string;

    @Property({ nullable: false })
    rest!: string;

    @Property({ nullable: true })
    comment?: string;

    @Property({ nullable: true })
    completeExercise?: boolean;
    
    @ManyToOne(() => Exercise, { nullable: false }) 
    exercise!: Rel<Exercise>;

    @ManyToOne(() => Training, { nullable: false })
    training!: Rel<Training>;
}
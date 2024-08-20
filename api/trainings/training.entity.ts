import { User } from '../users/user.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { ExerciseTraining } from '../exercises_trainings/exercise_training.entity.js';
import { Collection, Cascade } from '@mikro-orm/core';
import { nullable } from 'zod';

@Entity()
export class Training{

    @PrimaryKey()
    idTraining?: number;
    
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;

    @ManyToOne(() => Mesocycle, { nullable: false })
    mesocycle!: Mesocycle;

    @Property({ nullable: false })
    trainingName!: string;

    @Property({ nullable: false })
    trainingType!: string;

    @Property({ nullable: false })
    day!: Date;

    @Property({ nullable: false })
    time!: string;

    @ManyToOne(() => ExerciseTraining, { nullable: true })
    exercisesTrainings?: Rel<ExerciseTraining>;
    
} 
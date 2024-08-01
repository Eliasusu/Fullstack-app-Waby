import { User } from '../users/user.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { PrimaryKey, Property, ManyToOne, Rel, ManyToMany, Cascade, Collection, Entity } from '@mikro-orm/core';
import { Exercise } from '../exercises/exercise.entity.js';
import { Exercise_Training } from '../exercises_trainings/exercise_training.entity.js';

@Entity()
export class Training{

    @PrimaryKey()
    idTraining?: number;
    
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;

    @ManyToOne(() => Mesocycle)
    mesocycle?: Mesocycle;

    @Property({ nullable: false })
    trainingName!: string;

    @Property({ nullable: false })
    trainingType!: string;

    @Property({ nullable: false })
    day!: Date;

    @Property({ nullable: false })
    time!: string;

    @ManyToMany(() => Exercise, (exercise) => exercise.trainings, {
        cascade: [Cascade.ALL],
        owner: true,
    })
    exercises = new Collection<Exercise>(this);

    @ManyToOne(() => Exercise_Training, { nullable: true })
    exercises_trainings?: Exercise_Training;
} 
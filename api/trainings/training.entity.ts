import { User } from '../users/user.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { ExerciseTraining } from '../exercises_trainings/exercise_training.entity.js';

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

    @OneToMany(() => ExerciseTraining, (exerciseTraining) => exerciseTraining.training, {
        cascade: [Cascade.ALL],
    })
    exercisesTrainings?: Rel<ExerciseTraining>[];
}
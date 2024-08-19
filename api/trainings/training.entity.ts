import { User } from '../users/user.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { Exercise_Training } from '../exercises_trainings/exercise_training.entity.js';
import { Collection, Cascade } from '@mikro-orm/core';

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

    @OneToMany(() => Exercise_Training, (exercise_training) => exercise_training.training, {
        cascade: [Cascade.ALL],
    })
    exercises_trainings? = new Collection<Exercise_Training>(this);
    
} 
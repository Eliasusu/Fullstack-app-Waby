import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Exercise_Training } from '../exercises_trainings/exercise_training.entity.js';
import { CalisthenicsProgressionPerReps } from './calisthenics/reps/calisthenicsProgressionPerReps.entity.js';
import { CalisthenicsProgressionPerSec } from './calisthenics/secs/calisthenicsProgressionPerSec.entity.js';


@Entity()
export class Exercise  {
    @PrimaryKey()
    idExercise?: number;

    @Property({ nullable: false }) 
    name!: string;

    @ManyToOne(() => TrainingMethod, { nullable: false })
    trainingMethod!: Rel<TrainingMethod>;
    
    @Property({ nullable: false })
    description!: string;

    @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.exercises, {
        cascade: [Cascade.ALL]
    })
    muscleGroups = new Collection<MuscleGroup>(this);

    @Property({ nullable: false })
    difficulty!: string;

    @Property({ nullable: false })
    typeExercise!: string;

    @Property({ nullable: false, type: 'date', defaultRaw: 'current_timestamp()'})
    dateCreated!: Date;
        
    @Property({ nullable: true })
    image?: string;

    @ManyToOne(() => Exercise_Training, { nullable: true })
    exercises_trainings!: Rel<Exercise_Training>;

    @OneToMany(() => CalisthenicsProgressionPerReps, (calisthenicsProgressionPerReps) => calisthenicsProgressionPerReps.exercise, { 
    cascade: [Cascade.ALL]
    })
    calisthenicsProgressionPerReps? = new Collection<CalisthenicsProgressionPerReps>(this);
    
    @OneToMany(() => CalisthenicsProgressionPerSec, (calisthenicsProgressionPerSec) => calisthenicsProgressionPerSec.exercise, { 
        cascade: [Cascade.ALL]
    })
    calisthenicsProgressionPerSec? = new Collection<CalisthenicsProgressionPerSec>(this);

};

import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { ExerciseTraining } from '../exercises_trainings/exercise_training.entity.js';
import { ProgressionReps as RepsProgression } from './calisthenics/reps/progressionReps.entity.js';
import { ProgressionSec } from './calisthenics/secs/progressionSec.entity.js';
import { User } from '../users/user.entity.js';


@Entity()
export class Exercise  {
    @PrimaryKey()
    idExercise?: number;

    @Property({ nullable: false, unique: true }) 
    name!: string;

    @ManyToOne(() => TrainingMethod, { nullable: false })
    trainingMethod!: Rel<TrainingMethod>;
    
    @Property({ nullable: false })
    description?: string;

    @ManyToMany(() => MuscleGroup, (muscleGroup) => muscleGroup.exercises, {
        cascade: [Cascade.ALL]
    })
    muscleGroups = new Collection<MuscleGroup>(this);

    @Property({ nullable: false })
    difficulty!: string;

    @Property({ nullable: false })
    typeExercise!: string;

    @Property({ nullable: false, type: 'date', defaultRaw: 'current_timestamp()'})
    dateCreated?: Date;
        
    @Property({ nullable: true })
    image?: string;

    @ManyToOne(() => User, { nullable: true }) 
    user!: Rel<User>;

    @ManyToOne(() => ExerciseTraining, { nullable: true })
    exercisesTrainings?: Rel<ExerciseTraining>;

    @OneToMany(() => RepsProgression, (repsProgressions) => repsProgressions.exercise, { 
        cascade: [Cascade.ALL]
    })
    progressionReps = new Collection<RepsProgression>(this);
    
    @OneToMany(() => ProgressionSec, (calisthenicsProgressionPerSec) => calisthenicsProgressionPerSec.exercise, { 
        cascade: [Cascade.ALL]
    })
    progressionSec = new Collection<ProgressionSec>(this);

};

import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, Entity } from '@mikro-orm/core';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Training } from '../trainings/training.entity.js';
import { Exercise_Training } from '../exercises_trainings/exercise_training.entity.js';


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

    @ManyToMany(() => Training, (training) => training.exercises, {
        cascade: [Cascade.ALL]
    })
    trainings = new Collection<Training>(this);
        
    @Property({ nullable: true })
    image?: string;

    @ManyToOne(() => Exercise_Training, { nullable: true })
    exercises_trainings?: Exercise_Training;
};

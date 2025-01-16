import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { trainingItem } from '../trainingItems/trainingItems.entity.js';
import { ProgressionReps } from './calisthenics/reps/progressionReps.entity.js';
import { ProgressionSec } from './calisthenics/secs/progressionSec.entity.js';
import { User } from '../users/user.entity.js';
import { ProgressiveOverload } from '../progressiveOverload/progressiveOverload.entity.js';


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

    @OneToMany(() => trainingItem, (trainingItem) => trainingItem.exercise, {
        cascade: [Cascade.ALL],
    })
    trainingItems?: Rel<trainingItem>[];

    @OneToMany(() => ProgressionReps, (progressionReps) => progressionReps.exercise, { 
        cascade: [Cascade.ALL]
    })
    progressionReps = new Collection<ProgressionReps>(this);
    
    @OneToMany(() => ProgressionSec, (progressionSec) => progressionSec.exercise, { 
        cascade: [Cascade.ALL]
    })
    progressionSec = new Collection<ProgressionSec>(this);

    @OneToMany(() => ProgressiveOverload, (progressiveOverload) => progressiveOverload.exercise, {
        cascade: [Cascade.ALL]
    }) 
    progressiveOverload = new Collection<ProgressiveOverload>(this);

};

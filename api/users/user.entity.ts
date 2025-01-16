import { generateId } from '../shared/generateId.js';
import { Collection, Entity, ManyToMany, PrimaryKey, Property, Cascade, OneToMany } from '@mikro-orm/core';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { ProgressiveOverload } from '../progressiveOverload/progressiveOverload.entity.js';

@Entity()
export class User {
    @PrimaryKey()
    idUser!: string;

    @Property({ nullable: false, unique: true })
    username!: string;

    @Property({ nullable: false, unique: true })
    password!: string;

    @Property({ nullable: false, unique: true })
    email!: string;

    @Property({ nullable: false })
    name!: string;

    @Property({ nullable: false })
    birthdate!: Date;

    @Property({ nullable: true, unique: true })
    phone?: string;

    @Property({ nullable: false })
    bodyWeight!: number;

    @Property({ nullable: false })
    height!: number;

    @ManyToMany(() => TrainingMethod, (trainingMethod) => trainingMethod.users, {
        cascade: [Cascade.ALL],
        owner: true,
    })
    trainingMethods!: TrainingMethod[];

    @OneToMany(() => Training, (training) => training.user, {
        cascade: [Cascade.ALL],
    })
    trainings? = new Collection<Training>(this);

    @OneToMany(() => Exercise, (exercise) => exercise.user, {
        cascade: [Cascade.ALL],
    })
    exercises? = new Collection<Exercise>(this);

    @OneToMany(() => ProgressiveOverload, (progressiveOverload) => progressiveOverload.user, {
        cascade: [Cascade.ALL],
    })
    progressiveOverloads? = new Collection<ProgressiveOverload>(this);
        
    constructor() {
        this.idUser = generateId();
    }
}


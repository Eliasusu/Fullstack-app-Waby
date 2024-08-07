import { generateId } from '../shared/generateId.js';
import { Collection, Entity, ManyToMany, PrimaryKey, Property, Cascade, OneToMany } from '@mikro-orm/core';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Training } from '../trainings/training.entity.js';

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

    @Property({ nullable: false, unique: true })
    phone!: string;

    @Property({ nullable: false })
    bodyWeight!: number;

    @Property({ nullable: false })
    height!: number;

    @Property({ persist: false })
    token?: string;

    @ManyToMany(() => TrainingMethod, (trainingMethod) => trainingMethod.users, {
        cascade: [Cascade.ALL],
        owner: true,
    })
    trainingMethods!: TrainingMethod[];

    @OneToMany(() => Training, (training) => training.user, {
        cascade: [Cascade.ALL],
    })
    trainings? = new Collection<Training>(this);
    
    constructor() {
        this.idUser = generateId();
    }
}


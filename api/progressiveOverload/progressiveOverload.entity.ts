import { Collection, ManyToMany, PrimaryKey, Property, Cascade, ManyToOne, Rel, Entity, OneToMany } from '@mikro-orm/core';
import { Exercise } from '../exercises/exercise.entity.js'
import { User } from '../users/user.entity.js';

@Entity()

export class ProgressiveOverload {
    @PrimaryKey()
    idProgressiveOverload?: number;

    @Property({ nullable: false })
    name!: string;

    @Property({ nullable: false, type: 'date', defaultRaw: 'current_timestamp()' })
    logDate?: Date;

    @Property({ nullable: true })
    weightLifted?: string;

    @Property({ nullable: true })
    weightGoal?: string;

    @Property({ nullable: true })
    repsDone?: string;

    @Property({ nullable: true })
    repsGoal?: string;

    @Property({ nullable: true })
    secDone?: string;

    @Property({ nullable: true })
    secGoal?: string;

    @ManyToOne(() => Exercise, { nullable: false })
    exercise!: Rel<Exercise>;

    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
};  
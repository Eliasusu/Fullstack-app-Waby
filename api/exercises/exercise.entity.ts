import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, Unique, type Rel, OptionalProps } from '@mikro-orm/core';
import type { Difficulty, MetricType, MovementPattern } from '@waby/shared';
import { User } from '../users/user.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { Progression } from '../progressions/progression.entity.js';

/** El nombre es único para cada usuario (nota 06). */
@Entity()
@Unique({ properties: ['user', 'name'] })
export class Exercise {
    [OptionalProps]?: 'createdAt';

    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user!: Rel<User>;

    @Property({ length: 100 })
    name!: string;

    @Property({ type: 'text', nullable: true })
    description?: string | null;

    @ManyToOne(() => TrainingMethod)
    trainingMethod!: Rel<TrainingMethod>;

    @ManyToMany(() => MuscleGroup, undefined, { owner: true })
    muscleGroups = new Collection<MuscleGroup>(this);

    @Enum({ items: ['EASY', 'MEDIUM', 'HARD'] })
    difficulty!: Difficulty;

    @Enum({ items: ['PUSH', 'PULL', 'LEGS', 'CORE'] })
    movementPattern!: MovementPattern;

    @Enum({ items: ['REPS', 'TIME'] })
    metricType!: MetricType;

    @Property({ type: 'string', nullable: true })
    image?: string | null;

    @Property({ type: 'datetime' })
    createdAt: Date = new Date();

    @OneToMany(() => Progression, (progression) => progression.exercise, { orphanRemoval: true })
    progressions = new Collection<Progression>(this);
}

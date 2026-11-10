import { Collection, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property, OptionalProps } from '@mikro-orm/core';
import type { Role } from '@waby/shared';
import { DateOnlyType } from '../shared/db/date-only.type.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { Training } from '../trainings/training.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { Goal } from '../goals/goal.entity.js';

@Entity()
export class User {
    [OptionalProps]?: 'role';

    @PrimaryKey()
    id!: number;

    @Property({ unique: true, length: 30 })
    username!: string;

    @Property({ unique: true })
    email!: string;

    /** Hash de bcrypt. Nunca sale en una respuesta. */
    @Property({ hidden: true })
    password!: string;

    @Property({ length: 100 })
    name!: string;

    @Property({ type: DateOnlyType })
    birthdate!: string;

    @Property({ type: 'string', nullable: true, length: 30 })
    phone?: string | null;

    @Property({ type: 'double' })
    bodyWeightKg!: number;

    @Property({ type: 'double' })
    heightCm!: number;

    @Enum({ items: ['USER', 'ADMIN'], default: 'USER' })
    role: Role = 'USER';

    /** Sin cascade: los catálogos no se tocan al guardar un usuario (nota 37). */
    @ManyToMany(() => TrainingMethod, undefined, { owner: true })
    trainingMethods = new Collection<TrainingMethod>(this);

    @OneToMany(() => Exercise, (exercise) => exercise.user)
    exercises = new Collection<Exercise>(this);

    @OneToMany(() => Training, (training) => training.user)
    trainings = new Collection<Training>(this);

    @OneToMany(() => Mesocycle, (mesocycle) => mesocycle.user)
    mesocycles = new Collection<Mesocycle>(this);

    @OneToMany(() => Goal, (goal) => goal.user)
    goals = new Collection<Goal>(this);
}

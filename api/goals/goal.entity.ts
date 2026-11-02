import { Entity, Enum, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core';
import type { GoalTargetType } from '@waby/shared';
import { User } from '../users/user.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { DateOnlyType } from '../shared/db/date-only.type.js';

/** Meta sobre un Ejercicio. El progreso no se guarda: se deriva de los Ítems completados. */
@Entity()
export class Goal {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user!: Rel<User>;

    /** En la base hace cascada (para poder borrar un usuario); la API no deja borrar un Ejercicio con Metas. */
    @ManyToOne(() => Exercise, { onDelete: 'cascade' })
    exercise!: Rel<Exercise>;

    @Enum({ items: ['REPS', 'WEIGHT', 'SECONDS'] })
    targetType!: GoalTargetType;

    @Property({ type: 'double' })
    targetValue!: number;

    @Property({ type: DateOnlyType })
    startDate!: string;

    @Property({ type: DateOnlyType, nullable: true })
    endDate?: string | null;
}

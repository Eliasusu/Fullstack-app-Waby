import { Entity, Enum, ManyToOne, PrimaryKey, Property, type Rel } from '@mikro-orm/core';
import type { GoalTargetType } from '@waby/shared';
import { User } from '../users/user.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';

/**
 * Meta sobre un Ejercicio dentro de un Mesociclo (ADR-0004). El progreso no se guarda:
 * se deriva de los Ítems completados en los Entrenamientos del Mesociclo.
 */
@Entity()
export class Goal {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user!: Rel<User>;

    /** En la base hace cascada (para poder borrar un usuario); la API no deja borrar un Ejercicio con Metas. */
    @ManyToOne(() => Exercise, { onDelete: 'cascade' })
    exercise!: Rel<Exercise>;

    /** Obligatorio al crear (CreateGoalSchema). Si se borra el Mesociclo, la Meta queda sin él y sin progreso. */
    @ManyToOne(() => Mesocycle, { nullable: true, onDelete: 'set null' })
    mesocycle?: Rel<Mesocycle> | null;

    @Enum({ items: ['REPS', 'WEIGHT', 'SECONDS'] })
    targetType!: GoalTargetType;

    @Property({ type: 'double' })
    targetValue!: number;
}

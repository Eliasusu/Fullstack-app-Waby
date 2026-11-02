import { Entity, ManyToOne, PrimaryKey, Property, type Rel, OptionalProps } from '@mikro-orm/core';
import { Training } from '../trainings/training.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';

/**
 * Un Ejercicio dentro de un Entrenamiento. Es plan: `completed` significa que se hizo tal cual.
 * Lleva `reps` o `seconds` según el `metricType` del Ejercicio. `weightKg` vacío = peso corporal.
 */
@Entity()
export class TrainingItem {
    [OptionalProps]?: 'completed';

    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Training, { onDelete: 'cascade' })
    training!: Rel<Training>;

    /** En la base hace cascada (para poder borrar un usuario); la API no deja borrar un Ejercicio en uso. */
    @ManyToOne(() => Exercise, { onDelete: 'cascade' })
    exercise!: Rel<Exercise>;

    @Property()
    sets!: number;

    @Property({ type: 'integer', nullable: true })
    reps?: number | null;

    @Property({ type: 'integer', nullable: true })
    seconds?: number | null;

    @Property({ type: 'double', nullable: true })
    weightKg?: number | null;

    @Property({ type: 'integer', nullable: true })
    restSeconds?: number | null;

    @Property({ type: 'string', length: 500, nullable: true })
    comment?: string | null;

    @Property()
    completed: boolean = false;
}

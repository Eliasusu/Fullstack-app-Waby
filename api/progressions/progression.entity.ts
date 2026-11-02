import { Entity, ManyToOne, PrimaryKey, Property, Unique, type Rel } from '@mikro-orm/core';
import { Exercise } from '../exercises/exercise.entity.js';

/** Escalón ordenado de un Ejercicio. Lleva `reps` o `seconds` según su `metricType`. */
@Entity()
@Unique({ properties: ['exercise', 'name'] })
@Unique({ properties: ['exercise', 'order'] })
export class Progression {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => Exercise, { onDelete: 'cascade' })
    exercise!: Rel<Exercise>;

    @Property({ fieldName: 'position' })
    order!: number;

    @Property({ length: 100 })
    name!: string;

    @Property()
    sets!: number;

    @Property({ type: 'integer', nullable: true })
    reps?: number | null;

    @Property({ type: 'integer', nullable: true })
    seconds?: number | null;
}

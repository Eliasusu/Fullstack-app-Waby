import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/** Catálogo: lo edita el admin. El M:N con Ejercicio lo maneja Exercise. */
@Entity()
export class MuscleGroup {
    @PrimaryKey()
    id!: number;

    @Property({ unique: true, length: 50 })
    name!: string;

    @Property({ length: 500 })
    description!: string;

    @Property({ type: 'string', nullable: true })
    image?: string | null;
}

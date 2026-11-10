import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/** Catálogo: lo edita el admin. */
@Entity()
export class TrainingMethod {
    @PrimaryKey()
    id!: number;

    @Property({ unique: true, length: 50 })
    name!: string;

    @Property({ length: 500 })
    description!: string;
}

import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property, type Rel } from '@mikro-orm/core';
import type { MesocycleType } from '@waby/shared';
import { User } from '../users/user.entity.js';
import { Training } from '../trainings/training.entity.js';
import { DateOnlyType } from '../shared/db/date-only.type.js';

/** Bloque de varias semanas que agrupa Entrenamientos. La fecha de fin se deriva. */
@Entity()
export class Mesocycle {
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user!: Rel<User>;

    @Property({ length: 100 })
    name!: string;

    @Enum({ items: ['STRENGTH', 'HYPERTROPHY', 'DELOAD'] })
    type!: MesocycleType;

    @Property({ type: DateOnlyType })
    startDate!: string;

    @Property()
    weeks!: number;

    @OneToMany(() => Training, (training) => training.mesocycle)
    trainings = new Collection<Training>(this);
}

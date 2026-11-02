import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Rel, OptionalProps } from '@mikro-orm/core';
import { User } from '../users/user.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { TrainingItem } from '../trainingItems/trainingItem.entity.js';
import { DateOnlyType } from '../shared/db/date-only.type.js';

/** Lo planificado para un día. Si se borra su Mesociclo, queda suelto. */
@Entity()
export class Training {
    [OptionalProps]?: 'completed';

    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user!: Rel<User>;

    @Property({ length: 100 })
    name!: string;

    @Property({ type: DateOnlyType, index: true })
    day!: string;

    @Property()
    completed: boolean = false;

    @ManyToOne(() => Mesocycle, { nullable: true, onDelete: 'set null' })
    mesocycle?: Rel<Mesocycle> | null;

    @OneToMany(() => TrainingItem, (item) => item.training, { orphanRemoval: true })
    items = new Collection<TrainingItem>(this);
}

import { User } from '../users/user.entity.js';
import { PrimaryKey, Property, ManyToOne, Rel, Entity, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { trainingItem } from '../trainingItems/trainingItems.entity.js';

@Entity()
export class Training{

    @PrimaryKey()
    idTraining?: number;
    
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;

    @Property({ nullable: false })
    trainingName!: string;

    @Property({ nullable: false })
    trainingType!: string;

    @Property({ nullable: false })
    day!: Date;
    
    @Property({ nullable: false })
    startHour!: string;

    @Property({ nullable: false })
    endHour!: string;

    @Property({ nullable: true })
    completed?: boolean ;

    @OneToMany(() => trainingItem, (trainingItems) => trainingItems.training, {
        cascade: [Cascade.ALL],
    })
    trainingItems?: Rel<trainingItem>[];
}
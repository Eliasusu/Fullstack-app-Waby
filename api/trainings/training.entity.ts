import { User } from '../users/user.entity';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';


export class Training{

    @PrimaryKey({ nullable: false })
    idTraining?: string;
    
    @ManyToOne(() => User, { nullable: false })
    user!: User;

    @ManyToOne(() => Mesocycle)
    mesocycle?: Mesocycle;

    @Property({ nullable: false })
    trainingName!: string;

    @Property({ nullable: false })
    trainingType!: string;

    @Property({ nullable: false })
    day!: Date;

    @Property({ nullable: false })
    time!: string;

} 
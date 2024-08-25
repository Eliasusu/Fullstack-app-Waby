import { Training } from "../trainings/training.entity.js";
import { Collection, PrimaryKey, Property, Cascade, OneToMany, Entity, ManyToOne, Rel } from '@mikro-orm/core';
import { User } from "../users/user.entity.js";

@Entity()
export class Mesocycle {
 
    @PrimaryKey()
    idMesocycle?: number;

    @Property({ nullable: false })
    typeMesocycle!: string;
    
    @Property({ nullable: false })
    startDate!: Date;

    @Property({ nullable: false })
    endDate!: Date;

    @OneToMany(() => Training, (training) => training.mesocycle,{
        cascade: [Cascade.ALL],
    })
    trainings? = new Collection<Training>(this);
    
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
}
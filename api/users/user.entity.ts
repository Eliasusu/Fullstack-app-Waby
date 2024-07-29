import { generateId } from '../shared/generateId.js';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
    @PrimaryKey()
    public idUser?: string;

    @Property({ nullable: false, unique: true })
    username!: string;

    @Property({ nullable: false, unique: true })
    password!: string;

    @Property({ nullable: false, unique: true })
    email!: string;

    @Property({ nullable: false })
    public name!: string;

    @Property({ nullable: false })
    public birthdate!: Date;

    @Property({ nullable: false })
    public phone!: string;

    @Property({ nullable: false })
    public bodyWeight!: number;

    @Property({ nullable: false })
    public height!: number;

    constructor(){this.idUser = generateId();}
}


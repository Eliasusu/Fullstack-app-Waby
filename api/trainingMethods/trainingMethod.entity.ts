import { Collection, Entity, ManyToMany, PrimaryKey, Property, Cascade } from '@mikro-orm/core';
import { generateId } from '../shared/generateId.js';
import { User } from '../users/user.entity.js'; 

export class TrainingMethod {
  @PrimaryKey()
  idMethod?: string;

  @Property({ nullable: false, unique: true })
  nameMethod!: string;

  @Property({ nullable: false })
  description!: string;
  
  @ManyToMany(() => User, (user) => user.trainingMethods, {
    cascade: [Cascade.ALL],
  })
  users = new Collection<User>(this);
  
  constructor() {
    this.idMethod = generateId();
  }
}
import { User } from './user';
import { generateId } from './common/generateId';

export class BodyWeightGoals {
  public goalId: string;
  constructor(
    public user: User,
    public goalType: string,
    public goalStartDate: Date,
    public deadline: Date,
    public startBodyWeight: number,
    public goalBodyWeight: number,
  ){
    this.goalId = generateId();
  }
}

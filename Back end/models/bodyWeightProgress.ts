import { BodyWeightGoals } from './bodyWeightGoal';

export class BodyWeightProgress {
    constructor(
      public bodyWeightGoal: BodyWeightGoals,
      public uploadDate: Date,
      public recordedGoalWeight: number
    ){
      this.uploadDate = new Date(Date.now());
    }
}
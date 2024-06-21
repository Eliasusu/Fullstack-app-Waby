import { BodyWeightGoal } from './bodyWeightGoal';

export class BodyWeightProgress {
    constructor(
      public bodyWeightGoal: BodyWeightGoal,
      public uploadDate: Date,
      public recordedGoalWeight: number
    ){
      this.uploadDate = Date.now();
    }
}
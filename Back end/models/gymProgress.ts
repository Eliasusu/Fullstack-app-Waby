import { GymGoal } from "./gymGoal";

export class GymProgress {
    constructor(
        public goal: GymGoal,
        public uploadDate: Date,
        public recordedPr: number,
    ) {
        this.uploadDate = new Date(Date.now());
    }
}

export { GymGoal } from "./gymGoal";
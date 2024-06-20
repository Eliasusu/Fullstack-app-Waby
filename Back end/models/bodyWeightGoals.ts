export class BodyWeightGoals {
  constructor(
    public goalId: number,
    public userId: number,
    public goalType: string,
    public goalStartDate: Date,
    public startWeight: number,
    public deadline: Date,
    public goalWeight: number,
  ) {}
}

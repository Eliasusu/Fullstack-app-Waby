export class CalisthenicsProgressionPerReps {
  constructor(
    public idExercise: number,
    public idProgression: number,
    public idTraining: number,
    public nameProgression: string,
    public orderProgression: number,
    public numberOfSeriesNeeded: number,
    public numberOfRepsNeeded: number,
  ) {}
}
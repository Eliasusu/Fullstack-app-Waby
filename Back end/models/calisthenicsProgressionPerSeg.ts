export class CalisthenicsProgressionPerSeg {
  constructor(
    public idExercise: number,
    public idProgression: number,
    public idTraining: number,
    public nameProgression: string,
    public orderProgression: number,
    public numberOfSeriesNeeded: number,
    public numberOfSegNeeded: number,
  ) {}
}
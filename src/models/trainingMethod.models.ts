import { generateId } from '../lib/generateId';

export class TrainingMethod {
  public idMethod: string;
  constructor(
    public nameMethod: string,
    public description: string,
  ) {
    this.idMethod = generateId();
  }
}
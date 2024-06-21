import { generateId } from '../utils/generateId';

export class TrainingMethod {
  public idMethod: string;
  constructor(
    public nameMethod: string,
    public description: string,
  ) {
    this.idMethod = generateId();
  }
}
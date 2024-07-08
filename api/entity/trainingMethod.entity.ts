import { generateId } from '../shared/generateId.js';

export class TrainingMethod {
  public idMethod: string;
  constructor(
    public nameMethod: string,
    public description: string,
  ) {
    this.idMethod = generateId();
  }
}
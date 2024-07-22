
import { MuscleGroup } from './muscleGroup.entity.js';
import { TrainingMethod } from './trainingMethod.entity.js';
import { Training } from './training.entity.js';

export class Exercise  {
    constructor(
    public name: string,
    public trainingMethod: TrainingMethod,
    public description: string,
    public muscleGroups: MuscleGroup[],
    public difficulty: string,
    public typeExercise: string,
    public idExercise?: number | null,
    public training?: Training | null,
    public image?: string | null,
    public dateCreated?: Date
    ) {
        dateCreated = new Date();
    }
}
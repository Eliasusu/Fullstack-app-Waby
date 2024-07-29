
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { Training } from '../trainings/training.entity.js';

export class Exercise  {
    constructor(
    public name: string,
    public trainingMethod: TrainingMethod,
    public description: string,
    public muscleGroups: MuscleGroup[],
    public difficulty: string,
    public typeExercise: string,
    public dateCreated: Date,
    public idExercise?: number | null,
    public training?: Training | null,
    public image?: string | null,
    ) {
        dateCreated = new Date();
    }
}
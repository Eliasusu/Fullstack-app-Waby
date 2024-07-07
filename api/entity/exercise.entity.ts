
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
    public idExercise?: string,
    public training?: Training,
    public videoUrl?: string | null,
    public image?: string | null,
    public date?: Date
    ){}
}
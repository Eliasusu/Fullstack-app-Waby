import { Training } from './training';
import { MuscleGroup } from './muscleGroup';
import { TrainingMethod } from './trainingMethod';
import { generateId } from './common/generateId';

export class CalisthenicsExercise {
    public idExercise: string;
    constructor(
        public training: Training | null,
        public name: string,
        public trainingMethod: TrainingMethod,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
<<<<<<< 94e1d967c3ba87318dbcf68c5f849a2f42e5e051
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
>>>>>>> Revert "Cambio en el schema user"
        public difficulty: string,
        public typeExercise: string,
        public date: Date
    ) {
<<<<<<< 94e1d967c3ba87318dbcf68c5f849a2f42e5e051
=======
<<<<<<< HEAD
=======
        public typeExercise: string,        
    ){
>>>>>>> parent of 44fcfeb (Auto stash before merge of "feature/usuario" and "origin/feature/usuario")
=======
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
>>>>>>> Revert "Cambio en el schema user"
        this.idExercise = generateId();
    }
}
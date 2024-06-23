import { Training } from './training';
import { MuscleGroup } from './muscleGroup';
import { TrainingMethod } from './trainingMethod';

export class Exercise {
    public idExercise: number;
    constructor(
        public training: Training | null,
        public name: string,
        public trainingMethod: TrainingMethod,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
<<<<<<< HEAD
<<<<<<< 94e1d967c3ba87318dbcf68c5f849a2f42e5e051
=======
=======
>>>>>>> origin/feature/usuario
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
<<<<<<< HEAD
>>>>>>> Revert "Cambio en el schema user"
=======
>>>>>>> origin/feature/usuario
        public difficulty: string,
        public typeExercise: string,
        public date: Date
<<<<<<< HEAD:Back end/models/calisthenicsExercise.ts
    ) {
<<<<<<< HEAD
<<<<<<< 94e1d967c3ba87318dbcf68c5f849a2f42e5e051
=======
=======
>>>>>>> origin/feature/usuario
<<<<<<< HEAD
=======
        public typeExercise: string,        
    ){
>>>>>>> parent of 44fcfeb (Auto stash before merge of "feature/usuario" and "origin/feature/usuario")
=======
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
<<<<<<< HEAD
>>>>>>> Revert "Cambio en el schema user"
=======
>>>>>>> origin/feature/usuario
        this.idExercise = generateId();
    }
=======
    ) {}
>>>>>>> origin/feature/usuario:src/models/exercise.ts
}
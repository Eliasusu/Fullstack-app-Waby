import { Training } from './training';
import { MuscleGroup } from './muscleGroup';
import { generateId } from './common/generateId';

export class GymExercise {
    public idExercise: string;
    constructor(
        public training: Training | null,
        public name: string,
        public trainingMethod: string,
        public description: string,
        public videoUrl: string | null,
        public image: string | null,
        public muscleGroups: MuscleGroup[],
        public difficulty: string,
<<<<<<< HEAD
<<<<<<< 94e1d967c3ba87318dbcf68c5f849a2f42e5e051
        public typeExercise: string,
        public date: Date        
=======
<<<<<<< HEAD
<<<<<<< HEAD
        public typeExercise: string,
        public date: Date        
=======
<<<<<<< HEAD
<<<<<<< HEAD
        public typeExercise: string,
        public date: Date        
>>>>>>> origin/feature/usuario
=======
        public typeExercise: string,   
>>>>>>> parent of 44fcfeb (Auto stash before merge of "feature/usuario" and "origin/feature/usuario")
=======
        public typeExercise: string,
        public date: Date        
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
<<<<<<< HEAD
>>>>>>> Revert "Cambio en el schema user"
=======
>>>>>>> origin/feature/usuario
    ){
        this.idExercise = generateId();
    }
}
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
<<<<<<< HEAD
        public typeExercise: string,
        public date: Date        
=======
        public typeExercise: string,   
>>>>>>> parent of 44fcfeb (Auto stash before merge of "feature/usuario" and "origin/feature/usuario")
=======
        public typeExercise: string,
        public date: Date        
>>>>>>> parent of b2e1f5f (Cambio en el schema user)
    ){
        this.idExercise = generateId();
    }
}
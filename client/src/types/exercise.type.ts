import { User } from "@/types/user.type.ts"
import { MuscleGroup } from "@/types/muscleGroup.type.ts";
import { ExerciseTraining } from "@/types/exercisesTrainings.type.ts";
import { ProgressionRep } from "@/types/progressions/progressionRep.type.ts";
import { ProgressionSec } from "@/types/progressions/progressionSec.type.ts";

export interface Exercise {
    idExercise?: number;
    name: string;
    trainingMethod?: string;
    description?: string;
    muscleGroups: MuscleGroup[];
    difficulty?: string;
    typeExercise?: string;
    dateCreated?: Date;
    image?: string;
    user?: User;
    exercisesTrainings?: ExerciseTraining[];
    progressionReps?: ProgressionRep[];
    progressionSec?: ProgressionSec[];
}
import { User } from "@/users/user.type"
import { ExerciseTraining } from "@/exercises_trainings/exercisesTrainings.type";
import { ProgressionRep } from "@/types/progressions/progressionRep.type.ts";
import { ProgressionSec } from "@/types/progressions/progressionSec.type.ts";

export interface Exercise {
    idExercise?: number;
    name: string;
    trainingMethod: string;
    description: string;
    muscleGroups: [string];
    difficulty: string;
    typeExercise: string;
    dateCreated?: Date;
    image?: string;
    user?: User;
    exercisesTrainings?: ExerciseTraining[];
    progressionReps?: ProgressionRep[];
    progressionSec?: ProgressionSec[];
}
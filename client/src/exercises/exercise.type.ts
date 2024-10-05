import { User } from "@/users/user.type"
import { TrainingItem } from "@/trainingItem/trainingItems.type.ts";
import { ProgressionRep } from "@/exercises/progressions/progressionRep.type.ts";
import { ProgressionSec } from "@/exercises/progressions/progressionSec.type.ts";

export interface Exercise {
    idExercise?: number;
    name: string;
    trainingMethod: string;
    description: string;
    muscleGroups: number [];
    difficulty: string;
    typeExercise: string;
    //dateCreated?: Date;
    image?: string;
    user?: User;
    trainingItems?: TrainingItem[];
    progressionReps?: ProgressionRep[];
    progressionSec?: ProgressionSec[];
}
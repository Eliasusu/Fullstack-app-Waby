import { Exercise } from '@/exercises/exercise.type.ts';

export interface ProgressionRep { 
    idProgressoion: number;
    exercise: Exercise;
    nameProgression: string;
    orderProgression: number;
    numberSetsNeeded: number;
    numberRepsNeeded: number;
}
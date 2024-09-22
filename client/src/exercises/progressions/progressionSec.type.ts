import { Exercise } from '@/types/exercise.type.ts';

export interface ProgressionSec { 
    idProgressoion: number;
    exercise: Exercise;
    nameProgression: string;
    orderProgression: number;
    numberSetsNeeded: number;
    numberSecNeeded: number;
}
import { TrainingMethod } from '@/types/trainingMethod.type';
import { Training } from '@/types//trainings.type';
import { Exercise } from '@/types/exercise.type';
import { Mesocycle } from '@/types/mesocycle.type';

export interface User { 
    idUser?: string;
    username: string;
    password: string;
    email: string;
    name: string;
    birthdate: Date;
    phone: string;
    bodyWeight: number;
    height: number;
    token?: string;
    trainingMethods?: TrainingMethod[];
    trainings?: Training[];
    exercises?: Exercise[];
    mesocycles?: Mesocycle[];
}
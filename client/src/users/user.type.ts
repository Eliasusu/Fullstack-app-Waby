import { TrainingMethod } from '@/trainingMethods/trainingMethod.type';
import { Training } from '@/trainings/trainings.type';
import { Exercise } from '@/types/exercise.type';
import { Mesocycle } from '@/mesocycles/mesocycle.type';

export interface User { 
    idUser?: string;
    username: string;
    avatar: string
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

import { Training } from '@/trainings/trainings.type';
import { Exercise } from '@/exercises/exercise.type';


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
    trainingMethods?: string;
    trainings?: Training[];
    exercises?: Exercise[];
}
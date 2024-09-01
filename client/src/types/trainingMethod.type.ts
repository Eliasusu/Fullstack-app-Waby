import { User } from '@/types/user.type';

export interface TrainingMethod { 
    idMethod: string;
    nameMethod: string;
    description: string;
    users: User[];
}
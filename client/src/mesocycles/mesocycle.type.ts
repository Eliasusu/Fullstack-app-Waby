import { User } from "@/users/user.type"
import { Training } from "@/trainings/trainings.type";

export interface Mesocycle { 
    idMesocycle?: number;
    user?: User;
    typeMesocycle: string;
    startDate: Date;
    endDate: Date;
    trainings?: Training[];
}
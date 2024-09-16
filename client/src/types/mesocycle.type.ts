import { User } from "@/types/user.type.ts"
import { Training } from "@/types/trainings.type.ts";

export interface Mesocycle { 
    idMesocycle?: number;
    user?: User;
    typeMesocycle: string;
    startDate: Date;
    endDate: Date;
    trainings?: Training[];
}
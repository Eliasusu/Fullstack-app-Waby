
import { TrainingItem } from "@/trainingItem/trainingItems.type.ts";

export interface Training {
    idTraining?: number;
    user?: string;
    trainingName: string;
    trainingType?: string;
    day: Date;
    startHour: string;
    endHour: string;
    completed: boolean;
    trainingItems: TrainingItem[];
}

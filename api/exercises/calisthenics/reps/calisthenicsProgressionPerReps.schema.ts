import { z } from 'zod';
import { CalisthenicsProgressionPerReps } from './calisthenicsProgressionPerReps.entity.js';

export const progressionPerRepSchema = z.object({
    nameProgression: z.string(
        z.string().min(1).max(255)
    ),
    orderProgression: z.number(
        z.number().int().positive()
    ),
    numberSetsNeeded: z.number(
        z.number().int().positive()
    ),
    numberRepsNeeded: z.number(
        z.number().int().positive()
    ),
})

export function validateProgressionPerRep(CalisthenicsProgressionPerReps: any) {
    return progressionPerRepSchema.safeParse(CalisthenicsProgressionPerReps);
}

export function validateProgressionPerRepPartial(CalisthenicsProgressionPerReps: any) {
    return progressionPerRepSchema.partial().safeParse(CalisthenicsProgressionPerReps);
}
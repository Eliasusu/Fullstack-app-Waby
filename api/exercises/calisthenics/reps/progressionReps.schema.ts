import { z } from 'zod';
import { ProgressionReps } from './progressionReps.entity.js';

export const progressionRepSchema = z.object({
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

export function validateProgressionRep(ProgressionReps: any) {
    return progressionRepSchema.safeParse(ProgressionReps);
}

export function validateProgressionRepPartial(ProgressionReps: any) {
    return progressionRepSchema.partial().safeParse(ProgressionReps);
}
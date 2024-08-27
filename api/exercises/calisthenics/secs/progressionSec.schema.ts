import { z } from 'zod';
import { ProgressionSec } from './progressionSec.entity.js';

export const progressionSecSchema = z.object({
    nameProgression: z.string(
        z.string().min(1).max(255)
    ),
    orderProgresion: z.number(
        z.number().int().positive()
    ),
    numberSecNeeded: z.number(
        z.number().int().positive()
    ),
    numberSetsNeeded: z.number(
        z.number().int().positive()
    ),
})

export function validateProgressionSec(ProgressionSec: any) {
    return progressionSecSchema.safeParse(ProgressionSec);
}

export function validatePartialProgressionSec(ProgressionSec: any) {
    return progressionSecSchema.partial().safeParse(ProgressionSec);
}
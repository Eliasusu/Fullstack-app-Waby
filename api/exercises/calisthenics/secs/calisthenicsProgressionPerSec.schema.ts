import { z } from 'zod';

export const calisthenicsProgressionPerSecSchema = z.object({
    exercise: z.number({}).positive(),
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

export function validateCalisthenicsProgressionPerSec(data: any) {
    calisthenicsProgressionPerSecSchema.safeParse(data);
}
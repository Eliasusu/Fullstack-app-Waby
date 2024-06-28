import { z } from 'zod';
// import { exerciseSchema } from './exercises.schema.ts';

export const calisthenicsProgressionPerSecSchema = z.object({
    idProgression: z.number(
        z.number().int().positive()
    ),
    // exercise: exerciseSchema,
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
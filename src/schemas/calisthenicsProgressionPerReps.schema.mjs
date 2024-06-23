import { z } from 'zod';
import { exerciseSchema } from './exercise.schema.mjs';

export const calisthenicsProgressionPerSecSchema = z.object({
    idProgression: z.number(
        z.number().int().positive()
    ),
    exercise: exerciseSchema,
    nameProgression: z.string(
        z.string().min(1).max(255)
    ),
    orderProgresion: z.number(
        z.number().int().positive()
    ),
    numberRepsNeeded: z.number(
        z.number().int().positive()
    ),
    numberSetsNeeded: z.number(
        z.number().int().positive()
    ),
}),
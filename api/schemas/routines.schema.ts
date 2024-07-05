import { z } from 'zod';
import { exercisesSchema } from './exercises.schema.js';
import { trainingsSchema } from './trainings.schema.js';

const routineSchema = z.object({
    training: trainingsSchema,
    exercise: exercisesSchema,
    sets: z.number({
        required_error: 'Sets is required',
    }).positive(),
    reps: z.number({
        required_error: 'Reps is required',
    }).positive(),
    weight: z.number({
        required_error: 'Weight is required',
    }).positive(),
    rest: z.number({
        required_error: 'Rest is required',
    }).positive(),
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
    }),
});

type Routine = z.infer<typeof routineSchema>;

export function validateRoutine(routine: Routine) {
    return routineSchema.safeParse(routine);
}

export function validatePartialRoutine(routine: Routine) {
    return routineSchema.partial().safeParse(routine);
}
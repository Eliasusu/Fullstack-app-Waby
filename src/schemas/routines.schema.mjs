import { z } from 'zod';
import { exerciseSchema } from './exercises.schema.mjs';
import { trainingSchema } from './trainings.schema.mjs';

const routineSchema = z.object({
    training: z.trainingSchema({
        required_error: 'Training is required', 
    }),
    exercise: z.exerciseSchema({
        required_error: 'Exercise is required',
    }),
    sets: z.number({
        required_error: 'Sets is required',
        nonnegative_error: 'Sets must be a non-negative number',
    }),
    reps: z.number({
        required_error: 'Reps is required',
        nonnegative_error: 'Reps must be a non-negative number',
    }),
    rest: z.number({
        required_error: 'Rest is required',
        nonnegative_error: 'Rest must be a non-negative number',
    }),
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
    }),
});

export function validateRoutine(routine) {
    return routineSchema.safeParse(routine);
}

export function validatePartialRoutine(routine) {
    return routineSchema.partial().safeParse(routine);
}
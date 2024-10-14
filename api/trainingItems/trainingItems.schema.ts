import { z } from 'zod';
import { trainingItem } from './trainingItems.entity.js';

export const exerciseTraining: any = z.object({
    exercise: z.number({}),
    sets: z.number({
        required_error: 'Sets is required',
    }).positive(),
    reps: z.number({
        required_error: 'Reps is required',
    }).positive(),
    weight: z.string({
        required_error: 'Weight is required',
    }),
    rest: z.string({
        required_error: 'Rest is required',
    }),
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
    }),
    commpleteExercise: z.boolean({})
});


export function validateRoutine(routine: trainingItem) {
    return exerciseTraining.safeParse(routine);
}

export function validatePartialRoutine(routine: trainingItem) {
    return exerciseTraining.partial().safeParse(routine);
}
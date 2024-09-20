import { z } from 'zod';
import { ExerciseTraining } from './exercise_training.entity.js';

export const exerciseTraining: any = z.object({
    sets: z.number({
        required_error: 'Sets is required',
    }).positive(),
    reps: z.number({
        required_error: 'Reps is required',
    }).positive(),
    weight: z.number({
        required_error: 'Weight is required',
    }).positive(),
    rest: z.string({
        required_error: 'Rest is required',
    }),
    comment: z.string({
        invalid_type_error: 'Comment must be a string',
    }),
});



export function validateRoutine(routine: ExerciseTraining) {
    return exerciseTraining.safeParse(routine);
}

export function validatePartialRoutine(routine: ExerciseTraining) {
    return exerciseTraining.partial().safeParse(routine);
}
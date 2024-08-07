import { z } from 'zod';
import { exercisesSchema } from '../exercises/exercises.schema.js';
import { trainingsSchema } from '../trainings/trainings.schema.js';
import { Exercise_Training } from './exercise_training.entity.js';

export const exercise_Training = z.object({
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



export function validateRoutine(routine: Exercise_Training) {
    return exercise_Training.safeParse(routine);
}

export function validatePartialRoutine(routine: Exercise_Training) {
    return exercise_Training.partial().safeParse(routine);
}
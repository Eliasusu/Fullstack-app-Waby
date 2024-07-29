import { z } from 'zod';
import { exercisesSchema } from '../exercises/exercises.schema.js';
import { trainingsSchema } from '../trainings/trainings.schema.js';

const exercise_Training = z.object({
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

type Exercise_Training = z.infer<typeof exercise_Training>;

export function validateRoutine(routine: Exercise_Training) {
    return exercise_Training.safeParse(routine);
}

export function validatePartialRoutine(routine: Exercise_Training) {
    return exercise_Training.partial().safeParse(routine);
}
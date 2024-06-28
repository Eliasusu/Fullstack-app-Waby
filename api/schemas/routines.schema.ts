import { z } from 'zod';
// import { exerciseSchema } from './exercises.schema.js';
// import { trainingSchema } from './trainings.schema.js';

const routineSchema = z.object({
    // training: z.trainingSchema({
    //     required_error: 'Training is required', 
    // }),
    // exercise: z.exerciseSchema({
    //     required_error: 'Exercise is required',
    // }),
    sets: z.number({
        required_error: 'Sets is required',
    }).positive(),
    reps: z.number({
        required_error: 'Reps is required',
    }).positive()   ,
    rest: z.number({
        required_error: 'Rest is required',
    }).positive(),
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
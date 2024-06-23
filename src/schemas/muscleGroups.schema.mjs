import { z } from 'zod';

export const muscleGroupSchema = z.object({
    idMuscleGroup: z.number(),
    nameMuscleGroup: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
    description: z.string({
        invalid_type_error: 'Description must be a string',
    }),
    imageMuscleGroup: z.string({
        invalid_type_error: 'Image must be a string',
    }),
});


export function validateMuscleGroup(data) {
    return muscleGroupSchema.safeParse(data);
}

export function validatePartialMuscleGroup(data) {
    return muscleGroupSchema.partial().parse(data);
}
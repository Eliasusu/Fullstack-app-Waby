import { z } from 'zod';

export const muscleGroupSchema = z.object({
    idMuscleGroup: z.string({}),
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

type MuscleGroup = z.infer<typeof muscleGroupSchema>;

export function validateMuscleGroup(muscleGroup: MuscleGroup) {
    return muscleGroupSchema.safeParse(muscleGroup);
}

export function validatePartialMuscleGroup(muscleGroup: MuscleGroup) {
    return muscleGroupSchema.partial().parse(muscleGroup);
}
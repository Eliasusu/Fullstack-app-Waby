import { z } from 'zod';

/** Grupo muscular (catálogo: lo edita el admin). */
export const MuscleGroupSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    image: z.string().nullable(),
});
export type MuscleGroup = z.infer<typeof MuscleGroupSchema>;

export const CreateMuscleGroupSchema = z.object({
    name: z.string().trim().min(1).max(50),
    description: z.string().trim().min(1).max(500),
    image: z.string().trim().max(255).optional(),
});
export type CreateMuscleGroupInput = z.infer<typeof CreateMuscleGroupSchema>;

export const UpdateMuscleGroupSchema = CreateMuscleGroupSchema.partial();
export type UpdateMuscleGroupInput = z.infer<typeof UpdateMuscleGroupSchema>;

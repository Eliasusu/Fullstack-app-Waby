import { z } from 'zod';

/** Método de entrenamiento (catálogo: lo edita el admin). */
export const TrainingMethodSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
});
export type TrainingMethod = z.infer<typeof TrainingMethodSchema>;

export const CreateTrainingMethodSchema = z.object({
    name: z.string().trim().min(1).max(50),
    description: z.string().trim().min(1).max(500),
});
export type CreateTrainingMethodInput = z.infer<typeof CreateTrainingMethodSchema>;

export const UpdateTrainingMethodSchema = CreateTrainingMethodSchema.partial();
export type UpdateTrainingMethodInput = z.infer<typeof UpdateTrainingMethodSchema>;


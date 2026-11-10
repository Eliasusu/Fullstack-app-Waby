import { z } from 'zod';
import { DateOnlySchema, IdSchema, RefSchema } from './common.js';
import { TrainingItemSchema } from './training-item.js';

/** Entrenamiento: lo planificado para un día. Puede pertenecer a un Mesociclo o estar suelto. */
export const TrainingSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    day: DateOnlySchema,
    completed: z.boolean(),
    mesocycle: RefSchema.nullable(),
});
export type Training = z.infer<typeof TrainingSchema>;

/** Entrenamiento con sus Ítems (detalle y vista del día). */
export const TrainingWithItemsSchema = TrainingSchema.extend({
    items: z.array(TrainingItemSchema),
});
export type TrainingWithItems = z.infer<typeof TrainingWithItemsSchema>;

export const CreateTrainingSchema = z
    .object({
        name: z.string().trim().min(1).max(100),
        day: DateOnlySchema,
        completed: z.boolean().optional(),
        mesocycleId: IdSchema.nullable().optional(),
    })
    .strict();
export type CreateTrainingInput = z.infer<typeof CreateTrainingSchema>;

export const UpdateTrainingSchema = CreateTrainingSchema.partial();
export type UpdateTrainingInput = z.infer<typeof UpdateTrainingSchema>;

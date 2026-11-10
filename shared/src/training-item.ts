import { z } from 'zod';
import { IdSchema } from './common.js';
import { ExerciseRefSchema } from './exercise.js';

/**
 * Ítem de entrenamiento: un Ejercicio dentro de un Entrenamiento. Es plan:
 * `completed` significa que se hizo tal cual. Lleva `reps` o `seconds` según
 * el `metricType` del Ejercicio (ver `volumeError` en rules.ts).
 */
export const TrainingItemSchema = z.object({
    id: z.number().int(),
    trainingId: z.number().int(),
    exercise: ExerciseRefSchema,
    sets: z.number().int(),
    reps: z.number().int().nullable(),
    seconds: z.number().int().nullable(),
    weightKg: z.number().nullable(),
    restSeconds: z.number().int().nullable(),
    comment: z.string().nullable(),
    completed: z.boolean(),
});
export type TrainingItem = z.infer<typeof TrainingItemSchema>;

const TrainingItemFieldsSchema = z
    .object({
        exerciseId: IdSchema,
        sets: z.number().int().min(1),
        reps: z.number().int().min(1).optional(),
        seconds: z.number().int().min(1).optional(),
        /** Vacío = peso corporal. */
        weightKg: z.number().min(0).max(1000).optional(),
        restSeconds: z.number().int().min(0).max(3600).optional(),
        comment: z.string().trim().max(500).optional(),
        completed: z.boolean().optional(),
    })
    .strict();

const notBoth = (value: { reps?: number; seconds?: number }) => value.reps == null || value.seconds == null;
const notBothMessage = { message: 'Un ítem lleva reps o segundos, no los dos', path: ['seconds'] };

export const CreateTrainingItemSchema = TrainingItemFieldsSchema.refine(notBoth, notBothMessage).refine(
    (value) => value.reps != null || value.seconds != null,
    { message: 'Un ítem necesita reps o segundos', path: ['reps'] },
);
export type CreateTrainingItemInput = z.infer<typeof CreateTrainingItemSchema>;

export const UpdateTrainingItemSchema = TrainingItemFieldsSchema.partial().refine(notBoth, notBothMessage);
export type UpdateTrainingItemInput = z.infer<typeof UpdateTrainingItemSchema>;

import { z } from 'zod';

/**
 * Progresión: escalón ordenado de un Ejercicio. Lleva `reps` o `seconds` según
 * el `metricType` del Ejercicio (ver `volumeError` en rules.ts, que aplica la API).
 */
export const ProgressionSchema = z.object({
    id: z.number().int(),
    exerciseId: z.number().int(),
    order: z.number().int(),
    name: z.string(),
    sets: z.number().int(),
    reps: z.number().int().nullable(),
    seconds: z.number().int().nullable(),
});
export type Progression = z.infer<typeof ProgressionSchema>;

const ProgressionFieldsSchema = z
    .object({
        order: z.number().int().min(1),
        name: z.string().trim().min(1).max(100),
        sets: z.number().int().min(1),
        reps: z.number().int().min(1).optional(),
        seconds: z.number().int().min(1).optional(),
    })
    .strict();

const notBoth = (value: { reps?: number; seconds?: number }) => value.reps == null || value.seconds == null;
const notBothMessage = { message: 'Una progresión lleva reps o segundos, no los dos', path: ['seconds'] };

export const CreateProgressionSchema = ProgressionFieldsSchema.refine(notBoth, notBothMessage).refine(
    (value) => value.reps != null || value.seconds != null,
    { message: 'Una progresión necesita reps o segundos', path: ['reps'] },
);
export type CreateProgressionInput = z.infer<typeof CreateProgressionSchema>;

export const UpdateProgressionSchema = ProgressionFieldsSchema.partial().refine(notBoth, notBothMessage);
export type UpdateProgressionInput = z.infer<typeof UpdateProgressionSchema>;

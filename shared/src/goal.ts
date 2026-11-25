import { z } from 'zod';
import { IdSchema, RefSchema } from './common.js';
import { GoalTargetTypeSchema } from './enums.js';
import { ExerciseRefSchema } from './exercise.js';

/**
 * Meta sobre un Ejercicio dentro de un Mesociclo (ADR-0004). `currentValue` y
 * `achieved` son derivados: salen de los Ítems completados del Ejercicio en los
 * Entrenamientos de ese Mesociclo. `mesocycle` es `null` solo si se borró el
 * Mesociclo; en ese caso no hay progreso.
 * `targetType` tiene que ser compatible con el `metricType` del Ejercicio
 * (ver `isGoalTargetTypeValidFor` en rules.ts).
 */
export const GoalSchema = z.object({
    id: z.number().int(),
    exercise: ExerciseRefSchema,
    mesocycle: RefSchema.nullable(),
    targetType: GoalTargetTypeSchema,
    targetValue: z.number(),
    currentValue: z.number().nullable(),
    achieved: z.boolean(),
});
export type Goal = z.infer<typeof GoalSchema>;

/** El Mesociclo es obligatorio al crear y no se puede quitar a mano: solo queda en `null` si se borra. */
export const CreateGoalSchema = z
    .object({
        exerciseId: IdSchema,
        mesocycleId: IdSchema,
        targetType: GoalTargetTypeSchema,
        targetValue: z.number().positive(),
    })
    .strict();
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;

export const UpdateGoalSchema = CreateGoalSchema.partial();
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

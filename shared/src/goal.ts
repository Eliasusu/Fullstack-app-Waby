import { z } from 'zod';
import { DateOnlySchema, IdSchema } from './common.js';
import { GoalTargetTypeSchema } from './enums.js';
import { ExerciseRefSchema } from './exercise.js';

/**
 * Meta sobre un Ejercicio. `currentValue` y `achieved` son derivados: salen de
 * los Ítems completados del Ejercicio entre `startDate` y `endDate`.
 * `targetType` tiene que ser compatible con el `metricType` del Ejercicio
 * (ver `isGoalTargetTypeValidFor` en rules.ts).
 */
export const GoalSchema = z.object({
    id: z.number().int(),
    exercise: ExerciseRefSchema,
    targetType: GoalTargetTypeSchema,
    targetValue: z.number(),
    startDate: DateOnlySchema,
    endDate: DateOnlySchema.nullable(),
    currentValue: z.number().nullable(),
    achieved: z.boolean(),
});
export type Goal = z.infer<typeof GoalSchema>;

const GoalFieldsSchema = z
    .object({
        exerciseId: IdSchema,
        targetType: GoalTargetTypeSchema,
        targetValue: z.number().positive(),
        startDate: DateOnlySchema,
        endDate: DateOnlySchema.optional(),
    })
    .strict();

const endAfterStart = (value: { startDate?: string; endDate?: string }) =>
    value.startDate == null || value.endDate == null || value.endDate >= value.startDate;
const endAfterStartMessage = { message: 'La fecha de fin no puede ser anterior a la de inicio', path: ['endDate'] };

export const CreateGoalSchema = GoalFieldsSchema.refine(endAfterStart, endAfterStartMessage);
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;

export const UpdateGoalSchema = GoalFieldsSchema.partial().refine(endAfterStart, endAfterStartMessage);
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

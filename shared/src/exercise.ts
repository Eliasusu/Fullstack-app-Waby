import { z } from 'zod';
import { DateTimeSchema, IdSchema, RefSchema } from './common.js';
import { DifficultySchema, MetricTypeSchema, MovementPatternSchema } from './enums.js';

/** Ejercicio tal como lo devuelve la API. */
export const ExerciseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string().nullable(),
    trainingMethod: RefSchema,
    muscleGroups: z.array(RefSchema),
    difficulty: DifficultySchema,
    movementPattern: MovementPatternSchema,
    metricType: MetricTypeSchema,
    image: z.string().nullable(),
    createdAt: DateTimeSchema,
});
export type Exercise = z.infer<typeof ExerciseSchema>;

/** Referencia a un Ejercicio dentro de otra respuesta (Ítem, Meta). */
export const ExerciseRefSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    metricType: MetricTypeSchema,
});
export type ExerciseRef = z.infer<typeof ExerciseRefSchema>;

/** El nombre es único para cada usuario: lo controla la API. */
export const CreateExerciseSchema = z
    .object({
        name: z.string().trim().min(1).max(100),
        description: z.string().trim().max(1000).optional(),
        trainingMethodId: IdSchema,
        muscleGroupIds: z.array(IdSchema).min(1, 'Elegí al menos un grupo muscular'),
        difficulty: DifficultySchema,
        movementPattern: MovementPatternSchema,
        metricType: MetricTypeSchema,
        image: z.string().trim().max(255).optional(),
    })
    .strict();
export type CreateExerciseInput = z.infer<typeof CreateExerciseSchema>;

export const UpdateExerciseSchema = CreateExerciseSchema.partial();
export type UpdateExerciseInput = z.infer<typeof UpdateExerciseSchema>;

import { z } from 'zod';

export const RoleSchema = z.enum(['USER', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

export const DifficultySchema = z.enum(['EASY', 'MEDIUM', 'HARD']);
export type Difficulty = z.infer<typeof DifficultySchema>;

/** Patrón de movimiento de un Ejercicio. */
export const MovementPatternSchema = z.enum(['PUSH', 'PULL', 'LEGS', 'CORE']);
export type MovementPattern = z.infer<typeof MovementPatternSchema>;

/**
 * Forma de medir un Ejercicio. Define qué campo llevan sus Ítems y Progresiones:
 * `REPS` → `reps`, `TIME` → `seconds`.
 */
export const MetricTypeSchema = z.enum(['REPS', 'TIME']);
export type MetricType = z.infer<typeof MetricTypeSchema>;

export const MesocycleTypeSchema = z.enum(['STRENGTH', 'HYPERTROPHY', 'DELOAD']);
export type MesocycleType = z.infer<typeof MesocycleTypeSchema>;

export const GoalTargetTypeSchema = z.enum(['REPS', 'WEIGHT', 'SECONDS']);
export type GoalTargetType = z.infer<typeof GoalTargetTypeSchema>;

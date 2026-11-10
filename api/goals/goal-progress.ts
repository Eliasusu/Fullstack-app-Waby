import type { EntityManager } from '@mikro-orm/core';
import type { Goal } from './goal.entity.js';

export type GoalProgress = { currentValue: number | null; achieved: boolean };

/**
 * Progreso de una Meta (sobrecarga progresiva), derivado y nunca guardado.
 *
 * TODO(cu): núcleo del CU "Registrar una meta". Falta definir quién lo implementa (nota 110).
 * Contrato (docs/api.md, "Metas", y los tests `todo` de api/test/goals.test.ts):
 * - `currentValue`: el mejor valor entre los Ítems **completados** del Ejercicio de la Meta,
 *   de Entrenamientos del mismo usuario con día entre `startDate` y `endDate` (si tiene).
 *   Según `targetType`: `REPS` → `reps`, `WEIGHT` → `weightKg`, `SECONDS` → `seconds`.
 *   `null` si no hay ninguno.
 * - `achieved`: `currentValue >= targetValue`.
 */
export async function computeGoalProgress(_em: EntityManager, _goal: Goal): Promise<GoalProgress> {
    return { currentValue: null, achieved: false };
}

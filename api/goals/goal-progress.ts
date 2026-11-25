import type { EntityManager } from '@mikro-orm/core';
import type { GoalTargetType } from "@waby/shared";
import { TrainingItem } from "../trainingItems/trainingItem.entity.js";
import type { Goal } from './goal.entity.js';

export type GoalProgress = { currentValue: number | null; achieved: boolean };

/** Campo del Ítem que mide cada tipo de Meta. */
const FIELD_BY_TARGET: Record<
  GoalTargetType,
  keyof Pick<TrainingItem, "reps" | "weightKg" | "seconds">
> = {
  REPS: "reps",
  WEIGHT: "weightKg",
  SECONDS: "seconds",
};

/**
 * Progreso de una Meta (sobrecarga progresiva), derivado y nunca guardado (ADR-0004).
 *
 * Núcleo del CU "Registrar una meta". La spec ejecutable son los tests de
 * "metas: progreso" en api/test/goals.test.ts.
 * Contrato (docs/api.md, "Metas"):
 * - Sin Mesociclo (se borró): `{ currentValue: null, achieved: false }`.
 * - `currentValue`: el mejor valor (máximo) entre los Ítems **completados** del Ejercicio de la
 *   Meta, en Entrenamientos del mismo usuario que pertenecen al Mesociclo de la Meta (por la
 *   clave foránea, sin mirar fechas). Según `targetType`: `REPS` → `reps`, `WEIGHT` → `weightKg`,
 *   `SECONDS` → `seconds`. Los Ítems sin ese campo se ignoran. `null` si no queda ninguno.
 * - `achieved`: `currentValue >= targetValue` (`false` si `currentValue` es `null`).
 */
export async function computeGoalProgress(
  em: EntityManager,
  goal: Goal,
): Promise<GoalProgress> {
  // Paso 1: Meta sin Mesociclo
  if (!goal.mesocycle) {
    return { currentValue: null, achieved: false };
  }

  // Paso 2: qué campo del Ítem mirar
  const field = FIELD_BY_TARGET[goal.targetType];

  // Paso 3: traer los Ítems completados del Ejercicio, en Entrenamientos del Mesociclo y del usuario
  const items = await em.find(TrainingItem, {
    exercise: goal.exercise,
    completed: true,
    training: { mesocycle: goal.mesocycle, user: goal.user },
  });

  // Paso 4: mejor valor y achieved
  const values = items
    .map((item) => item[field])
    .filter((value): value is number => value !== null && value !== undefined);
  const currentValue = values.length > 0 ? Math.max(...values) : null;

  return {
    currentValue,
    achieved: currentValue !== null && currentValue >= goal.targetValue,
  };
}

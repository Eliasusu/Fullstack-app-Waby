import type { Difficulty, GoalTargetType, MesocycleType, MetricType, MovementPattern } from "@waby/shared";

/** Textos de la UI para los enums del contrato. */
export const difficultyLabels: Record<Difficulty, string> = { EASY: 'Fácil', MEDIUM: 'Media', HARD: 'Difícil' };
export const movementPatternLabels: Record<MovementPattern, string> = { PUSH: 'Empuje', PULL: 'Tracción', LEGS: 'Piernas', CORE: 'Core' };
export const metricTypeLabels: Record<MetricType, string> = { REPS: 'Repeticiones', TIME: 'Tiempo' };
export const mesocycleTypeLabels: Record<MesocycleType, string> = { STRENGTH: 'Fuerza', HYPERTROPHY: 'Hipertrofia', DELOAD: 'Descarga' };
export const goalTargetTypeLabels: Record<GoalTargetType, string> = { REPS: 'Repeticiones', WEIGHT: 'Peso (kg)', SECONDS: 'Segundos' };

/** Unidad corta para mostrar un valor de Meta: "12 reps", "20 kg", "10 s". */
export const goalTargetUnit: Record<GoalTargetType, string> = { REPS: 'reps', WEIGHT: 'kg', SECONDS: 's' };

export const options = <T extends string>(labels: Record<T, string>) =>
    (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

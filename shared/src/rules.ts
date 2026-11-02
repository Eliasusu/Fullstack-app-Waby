import type { GoalTargetType, MetricType } from './enums.js';

/**
 * Reglas del dominio que dependen del `metricType` del Ejercicio.
 * Viven acá para que la API y el client validen lo mismo.
 */

/** Campo que lleva el volumen de un Ítem o una Progresión según la forma de medir. */
export function volumeFieldFor(metricType: MetricType): 'reps' | 'seconds' {
    return metricType === 'REPS' ? 'reps' : 'seconds';
}

/** Tipos de objetivo que admite una Meta según la forma de medir su Ejercicio. */
export function goalTargetTypesFor(metricType: MetricType): GoalTargetType[] {
    return metricType === 'REPS' ? ['REPS', 'WEIGHT'] : ['SECONDS'];
}

export function isGoalTargetTypeValidFor(metricType: MetricType, targetType: GoalTargetType): boolean {
    return goalTargetTypesFor(metricType).includes(targetType);
}

/**
 * Valida que un Ítem o una Progresión tenga el campo de volumen que corresponde
 * a la forma de medir de su Ejercicio, y no el otro.
 * Devuelve el mensaje de error, o `null` si está bien.
 */
export function volumeError(
    metricType: MetricType,
    volume: { reps?: number | null; seconds?: number | null },
): string | null {
    const hasReps = volume.reps != null;
    const hasSeconds = volume.seconds != null;
    if (metricType === 'REPS') {
        if (!hasReps) return 'Un ejercicio por repeticiones necesita reps';
        if (hasSeconds) return 'Un ejercicio por repeticiones no lleva segundos';
    } else {
        if (!hasSeconds) return 'Un ejercicio por tiempo necesita segundos';
        if (hasReps) return 'Un ejercicio por tiempo no lleva reps';
    }
    return null;
}

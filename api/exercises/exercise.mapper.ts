import type { Exercise as ExerciseDto, ExerciseRef } from '@waby/shared';
import type { Exercise } from './exercise.entity.js';

/** Requiere `trainingMethod` y `muscleGroups` cargados. */
export function toExerciseDto(exercise: Exercise): ExerciseDto {
    return {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description ?? null,
        trainingMethod: { id: exercise.trainingMethod.id, name: exercise.trainingMethod.name },
        muscleGroups: exercise.muscleGroups
            .getItems()
            .map((group) => ({ id: group.id, name: group.name }))
            .sort((a, b) => a.id - b.id),
        difficulty: exercise.difficulty,
        movementPattern: exercise.movementPattern,
        metricType: exercise.metricType,
        image: exercise.image ?? null,
        createdAt: exercise.createdAt.toISOString(),
    };
}

export function toExerciseRef(exercise: Exercise): ExerciseRef {
    return { id: exercise.id, name: exercise.name, metricType: exercise.metricType };
}

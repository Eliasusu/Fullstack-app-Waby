import type { EntityManager } from '@mikro-orm/core';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { invalid, notFound } from '../shared/http.js';
import { Exercise } from './exercise.entity.js';

/** Ejercicio del usuario. Uno ajeno responde igual que uno inexistente (404). */
export async function findOwnExercise(em: EntityManager, userId: number, id: number, populate = true) {
    const exercise = await em.findOne(
        Exercise,
        { id, user: userId },
        populate ? { populate: ['trainingMethod', 'muscleGroups'] } : {},
    );
    if (!exercise) throw notFound('El ejercicio no existe');
    return exercise;
}

/** Ejercicio del usuario referenciado desde un body (Ítem, Meta). Si no es suyo, 400 en ese campo. */
export async function findOwnExerciseForReference(em: EntityManager, userId: number, id: number, field = 'exerciseId') {
    const exercise = await em.findOne(Exercise, { id, user: userId });
    if (!exercise) throw invalid(field, 'El ejercicio no existe');
    return exercise;
}

export async function findTrainingMethod(em: EntityManager, id: number) {
    const method = await em.findOne(TrainingMethod, { id });
    if (!method) throw invalid('trainingMethodId', 'El método de entrenamiento no existe');
    return method;
}

export async function findMuscleGroups(em: EntityManager, ids: number[]) {
    const unique = [...new Set(ids)];
    const groups = await em.find(MuscleGroup, { id: { $in: unique } });
    if (groups.length !== unique.length) throw invalid('muscleGroupIds', 'Hay grupos musculares que no existen');
    return groups;
}

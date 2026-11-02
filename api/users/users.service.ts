import type { EntityManager } from '@mikro-orm/core';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { conflict, invalid } from '../shared/http.js';
import { User } from './user.entity.js';

/** Busca los Métodos de entrenamiento por id. Si falta alguno, 400. */
export async function findTrainingMethods(em: EntityManager, ids: number[]) {
    const unique = [...new Set(ids)];
    const methods = await em.find(TrainingMethod, { id: { $in: unique } });
    if (methods.length !== unique.length) throw invalid('trainingMethodIds', 'Hay métodos de entrenamiento que no existen');
    return methods;
}

/** 409 si el usuario o el email ya los usa otra cuenta. */
export async function assertUniqueCredentials(em: EntityManager, data: { username?: string; email?: string }, exceptId?: number) {
    if (data.username) {
        const other = await em.findOne(User, { username: data.username });
        if (other && other.id !== exceptId) throw conflict('El nombre de usuario ya está en uso');
    }
    if (data.email) {
        const other = await em.findOne(User, { email: data.email });
        if (other && other.id !== exceptId) throw conflict('El email ya está en uso');
    }
}

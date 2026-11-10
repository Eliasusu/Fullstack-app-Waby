import type { EntityManager } from '@mikro-orm/core';
import { notFound } from '../shared/http.js';
import { Training } from './training.entity.js';

/** Entrenamiento del usuario con sus Ítems. Uno ajeno responde 404. */
export async function findOwnTraining(em: EntityManager, userId: number, id: number) {
    const training = await em.findOne(
        Training,
        { id, user: userId },
        { populate: ['mesocycle', 'items', 'items.exercise'] },
    );
    if (!training) throw notFound('El entrenamiento no existe');
    return training;
}

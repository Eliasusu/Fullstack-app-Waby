import type { EntityManager } from '@mikro-orm/core';
import { invalid, notFound } from '../shared/http.js';
import { Mesocycle } from './mesocycle.entity.js';

export async function findOwnMesocycle(em: EntityManager, userId: number, id: number) {
    const mesocycle = await em.findOne(Mesocycle, { id, user: userId });
    if (!mesocycle) throw notFound('El mesociclo no existe');
    return mesocycle;
}

/** Mesociclo del usuario referenciado desde el body de un Entrenamiento. Si no es suyo, 400. */
export async function findOwnMesocycleForReference(em: EntityManager, userId: number, id: number) {
    const mesocycle = await em.findOne(Mesocycle, { id, user: userId });
    if (!mesocycle) throw invalid('mesocycleId', 'El mesociclo no existe');
    return mesocycle;
}

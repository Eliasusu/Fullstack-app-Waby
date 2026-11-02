import type { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTrainingSchema, DateOnlySchema, UpdateTrainingSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { idParam, parse } from '../shared/http.js';
import { currentUserId } from '../middlewares/auth.js';
import { findOwnMesocycleForReference } from '../mesocycles/mesocycles.service.js';
import { Training } from './training.entity.js';
import { toTrainingDto, toTrainingWithItemsDto } from './training.mapper.js';
import { findOwnTraining } from './trainings.service.js';

const ListQuerySchema = z.object({
    from: DateOnlySchema.optional(),
    to: DateOnlySchema.optional(),
});

/**
 * Resuelve el `mesocycleId` del body: `undefined` no cambia nada, `null` desasocia.
 * TODO(cu): reglas del CU "Crear rutina para un mesociclo" al asociar un Entrenamiento
 * (por ejemplo, que el día caiga dentro del Mesociclo). Hoy solo se controla que sea del usuario.
 */
async function resolveMesocycle(userId: number, mesocycleId: number | null | undefined) {
    if (mesocycleId === undefined) return undefined;
    if (mesocycleId === null) return null;
    return findOwnMesocycleForReference(orm.em, userId, mesocycleId);
}

export async function getAll(req: Request, res: Response) {
    const { from, to } = parse(ListQuerySchema, req.query);
    const day = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
    const trainings = await orm.em.find(
        Training,
        { user: currentUserId(req), ...(from || to ? { day } : {}) },
        { populate: ['mesocycle'], orderBy: { day: 'asc', id: 'asc' } },
    );
    res.json(trainings.map(toTrainingDto));
}

export async function getOne(req: Request, res: Response) {
    res.json(toTrainingWithItemsDto(await findOwnTraining(orm.em, currentUserId(req), idParam(req))));
}

export async function create(req: Request, res: Response) {
    const userId = currentUserId(req);
    const { mesocycleId, ...data } = parse(CreateTrainingSchema, req.body);
    const mesocycle = await resolveMesocycle(userId, mesocycleId);
    const training = orm.em.create(Training, { ...data, completed: data.completed ?? false, mesocycle: mesocycle ?? null, user: userId });
    await orm.em.flush();
    res.status(201).json(toTrainingWithItemsDto(await findOwnTraining(orm.em, userId, training.id)));
}

export async function update(req: Request, res: Response) {
    const userId = currentUserId(req);
    const training = await findOwnTraining(orm.em, userId, idParam(req));
    const { mesocycleId, ...data } = parse(UpdateTrainingSchema, req.body);
    const mesocycle = await resolveMesocycle(userId, mesocycleId);
    orm.em.assign(training, data);
    if (mesocycle !== undefined) training.mesocycle = mesocycle;
    await orm.em.flush();
    res.json(toTrainingWithItemsDto(training));
}

/** Sus Ítems se borran por la clave foránea en cascada. */
export async function remove(req: Request, res: Response) {
    const training = await findOwnTraining(orm.em, currentUserId(req), idParam(req));
    await orm.em.nativeDelete(Training, { id: training.id });
    res.status(204).end();
}

import type { Request, Response } from 'express';
import { CreateMesocycleSchema, UpdateMesocycleSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { idParam, parse } from '../shared/http.js';
import { currentUserId } from '../middlewares/auth.js';
import { Training } from '../trainings/training.entity.js';
import { toTrainingDto } from '../trainings/training.mapper.js';
import { Mesocycle } from './mesocycle.entity.js';
import { toMesocycleDto } from './mesocycle.mapper.js';
import { findOwnMesocycle } from './mesocycles.service.js';

const withCount = async (mesocycle: Mesocycle) =>
    toMesocycleDto(mesocycle, await orm.em.count(Training, { mesocycle: mesocycle.id }));

export async function getAll(req: Request, res: Response) {
    const mesocycles = await orm.em.find(Mesocycle, { user: currentUserId(req) }, { orderBy: { startDate: 'asc', id: 'asc' } });
    res.json(await Promise.all(mesocycles.map(withCount)));
}

export async function getOne(req: Request, res: Response) {
    res.json(await withCount(await findOwnMesocycle(orm.em, currentUserId(req), idParam(req))));
}

export async function getTrainings(req: Request, res: Response) {
    const mesocycle = await findOwnMesocycle(orm.em, currentUserId(req), idParam(req));
    const trainings = await orm.em.find(
        Training,
        { mesocycle: mesocycle.id },
        { populate: ['mesocycle'], orderBy: { day: 'asc', id: 'asc' } },
    );
    res.json(trainings.map(toTrainingDto));
}

export async function create(req: Request, res: Response) {
    const data = parse(CreateMesocycleSchema, req.body);
    const mesocycle = orm.em.create(Mesocycle, { ...data, user: currentUserId(req) });
    await orm.em.flush();
    res.status(201).json(toMesocycleDto(mesocycle, 0));
}

export async function update(req: Request, res: Response) {
    const mesocycle = await findOwnMesocycle(orm.em, currentUserId(req), idParam(req));
    orm.em.assign(mesocycle, parse(UpdateMesocycleSchema, req.body));
    await orm.em.flush();
    res.json(await withCount(mesocycle));
}

/** Sus Entrenamientos quedan sueltos: la clave foránea es `ON DELETE SET NULL`. */
export async function remove(req: Request, res: Response) {
    const mesocycle = await findOwnMesocycle(orm.em, currentUserId(req), idParam(req));
    await orm.em.nativeDelete(Mesocycle, { id: mesocycle.id });
    res.status(204).end();
}

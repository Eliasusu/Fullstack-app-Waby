import type { Request, Response } from 'express';
import { CreateTrainingMethodSchema, UpdateTrainingMethodSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { conflict, idParam, notFound, parse } from '../shared/http.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { TrainingMethod } from './trainingMethod.entity.js';
import { toTrainingMethodDto } from './trainingMethod.mapper.js';

async function findOr404(id: number) {
    const method = await orm.em.findOne(TrainingMethod, { id });
    if (!method) throw notFound('El método de entrenamiento no existe');
    return method;
}

async function assertNameFree(name: string | undefined, exceptId?: number) {
    if (!name) return;
    const other = await orm.em.findOne(TrainingMethod, { name });
    if (other && other.id !== exceptId) throw conflict('Ya existe un método de entrenamiento con ese nombre');
}

export async function getAll(_req: Request, res: Response) {
    const methods = await orm.em.find(TrainingMethod, {}, { orderBy: { name: 'asc' } });
    res.json(methods.map(toTrainingMethodDto));
}

export async function getOne(req: Request, res: Response) {
    res.json(toTrainingMethodDto(await findOr404(idParam(req))));
}

export async function create(req: Request, res: Response) {
    const data = parse(CreateTrainingMethodSchema, req.body);
    await assertNameFree(data.name);
    const method = orm.em.create(TrainingMethod, data);
    await orm.em.flush();
    res.status(201).json(toTrainingMethodDto(method));
}

export async function update(req: Request, res: Response) {
    const method = await findOr404(idParam(req));
    const data = parse(UpdateTrainingMethodSchema, req.body);
    await assertNameFree(data.name, method.id);
    orm.em.assign(method, data);
    await orm.em.flush();
    res.json(toTrainingMethodDto(method));
}

export async function remove(req: Request, res: Response) {
    const method = await findOr404(idParam(req));
    if (await orm.em.count(Exercise, { trainingMethod: method.id })) {
        throw conflict('Hay ejercicios que usan este método de entrenamiento');
    }
    await orm.em.removeAndFlush(method);
    res.status(204).end();
}

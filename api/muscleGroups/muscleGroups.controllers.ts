import type { Request, Response } from 'express';
import { CreateMuscleGroupSchema, UpdateMuscleGroupSchema, type MuscleGroup as MuscleGroupDto } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { conflict, idParam, notFound, parse } from '../shared/http.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { MuscleGroup } from './muscleGroup.entity.js';

const toDto = ({ id, name, description, image }: MuscleGroup): MuscleGroupDto => ({ id, name, description, image: image ?? null });

async function findOr404(id: number) {
    const group = await orm.em.findOne(MuscleGroup, { id });
    if (!group) throw notFound('El grupo muscular no existe');
    return group;
}

async function assertNameFree(name: string | undefined, exceptId?: number) {
    if (!name) return;
    const other = await orm.em.findOne(MuscleGroup, { name });
    if (other && other.id !== exceptId) throw conflict('Ya existe un grupo muscular con ese nombre');
}

export async function getAll(_req: Request, res: Response) {
    const groups = await orm.em.find(MuscleGroup, {}, { orderBy: { name: 'asc' } });
    res.json(groups.map(toDto));
}

export async function getOne(req: Request, res: Response) {
    res.json(toDto(await findOr404(idParam(req))));
}

export async function create(req: Request, res: Response) {
    const data = parse(CreateMuscleGroupSchema, req.body);
    await assertNameFree(data.name);
    const group = orm.em.create(MuscleGroup, { ...data, image: data.image ?? null });
    await orm.em.flush();
    res.status(201).json(toDto(group));
}

export async function update(req: Request, res: Response) {
    const group = await findOr404(idParam(req));
    const data = parse(UpdateMuscleGroupSchema, req.body);
    await assertNameFree(data.name, group.id);
    orm.em.assign(group, data);
    await orm.em.flush();
    res.json(toDto(group));
}

export async function remove(req: Request, res: Response) {
    const group = await findOr404(idParam(req));
    if (await orm.em.count(Exercise, { muscleGroups: group.id })) {
        throw conflict('Hay ejercicios que usan este grupo muscular');
    }
    await orm.em.removeAndFlush(group);
    res.status(204).end();
}

import type { Request, Response } from 'express';
import { CreateProgressionSchema, UpdateProgressionSchema, volumeError, volumeFieldFor } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { conflict, idParam, invalid, notFound, parse } from '../shared/http.js';
import { currentUserId } from '../middlewares/auth.js';
import { findOwnExercise } from '../exercises/exercises.service.js';
import type { Exercise } from '../exercises/exercise.entity.js';
import { Progression } from './progression.entity.js';
import { toProgressionDto } from './progression.mapper.js';

const ownExercise = (req: Request) => findOwnExercise(orm.em, currentUserId(req), idParam(req), false);

function assertVolume(exercise: Exercise, volume: { reps?: number | null; seconds?: number | null }) {
    const error = volumeError(exercise.metricType, volume);
    if (error) throw invalid(volumeFieldFor(exercise.metricType), error);
}

async function assertUniqueInExercise(exercise: Exercise, data: { name?: string; order?: number }, exceptId?: number) {
    if (data.name) {
        const other = await orm.em.findOne(Progression, { exercise: exercise.id, name: data.name });
        if (other && other.id !== exceptId) throw conflict('El ejercicio ya tiene una progresión con ese nombre');
    }
    if (data.order != null) {
        const other = await orm.em.findOne(Progression, { exercise: exercise.id, order: data.order });
        if (other && other.id !== exceptId) throw conflict('El ejercicio ya tiene una progresión en ese orden');
    }
}

export async function getAll(req: Request, res: Response) {
    const exercise = await ownExercise(req);
    const progressions = await orm.em.find(Progression, { exercise: exercise.id }, { orderBy: { order: 'asc' } });
    res.json(progressions.map(toProgressionDto));
}

export async function create(req: Request, res: Response) {
    const exercise = await ownExercise(req);
    const data = parse(CreateProgressionSchema, req.body);
    assertVolume(exercise, data);
    await assertUniqueInExercise(exercise, data);
    const progression = orm.em.create(Progression, { ...data, reps: data.reps ?? null, seconds: data.seconds ?? null, exercise });
    await orm.em.flush();
    res.status(201).json(toProgressionDto(progression));
}

async function findProgression(req: Request) {
    const exercise = await ownExercise(req);
    const progression = await orm.em.findOne(Progression, { id: idParam(req, 'progressionId'), exercise: exercise.id });
    if (!progression) throw notFound('La progresión no existe');
    return { exercise, progression };
}

export async function update(req: Request, res: Response) {
    const { exercise, progression } = await findProgression(req);
    const data = parse(UpdateProgressionSchema, req.body);
    assertVolume(exercise, { reps: data.reps ?? progression.reps, seconds: data.seconds ?? progression.seconds });
    await assertUniqueInExercise(exercise, data, progression.id);
    orm.em.assign(progression, data);
    await orm.em.flush();
    res.json(toProgressionDto(progression));
}

export async function remove(req: Request, res: Response) {
    const { progression } = await findProgression(req);
    await orm.em.removeAndFlush(progression);
    res.status(204).end();
}

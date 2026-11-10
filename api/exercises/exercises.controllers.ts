import type { Request, Response } from 'express';
import { PopulateHint } from '@mikro-orm/core';
import { z } from 'zod';
import { CreateExerciseSchema, IdParamSchema, UpdateExerciseSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { conflict, idParam, parse } from '../shared/http.js';
import { currentUserId } from '../middlewares/auth.js';
import { TrainingItem } from '../trainingItems/trainingItem.entity.js';
import { Goal } from '../goals/goal.entity.js';
import { Progression } from '../progressions/progression.entity.js';
import { Exercise } from './exercise.entity.js';
import { toExerciseDto } from './exercise.mapper.js';
import { findMuscleGroups, findOwnExercise, findTrainingMethod } from './exercises.service.js';

const ListQuerySchema = z.object({
    muscleGroupId: IdParamSchema.optional(),
    trainingMethodId: IdParamSchema.optional(),
});

async function assertNameFree(userId: number, name: string | undefined, exceptId?: number) {
    if (!name) return;
    const other = await orm.em.findOne(Exercise, { user: userId, name });
    if (other && other.id !== exceptId) throw conflict('Ya tenés un ejercicio con ese nombre');
}

async function isInUse(exerciseId: number) {
    const [items, goals] = await Promise.all([
        orm.em.count(TrainingItem, { exercise: exerciseId }),
        orm.em.count(Goal, { exercise: exerciseId }),
    ]);
    return items + goals > 0;
}

export async function getAll(req: Request, res: Response) {
    const { muscleGroupId, trainingMethodId } = parse(ListQuerySchema, req.query);
    const exercises = await orm.em.find(
        Exercise,
        {
            user: currentUserId(req),
            ...(muscleGroupId ? { muscleGroups: muscleGroupId } : {}),
            ...(trainingMethodId ? { trainingMethod: trainingMethodId } : {}),
        },
        { populate: ['trainingMethod', 'muscleGroups'], populateWhere: PopulateHint.ALL, orderBy: { name: 'asc' } },
    );
    res.json(exercises.map(toExerciseDto));
}

export async function getOne(req: Request, res: Response) {
    res.json(toExerciseDto(await findOwnExercise(orm.em, currentUserId(req), idParam(req))));
}

export async function create(req: Request, res: Response) {
    const em = orm.em;
    const userId = currentUserId(req);
    const { trainingMethodId, muscleGroupIds, ...data } = parse(CreateExerciseSchema, req.body);
    await assertNameFree(userId, data.name);
    const trainingMethod = await findTrainingMethod(em, trainingMethodId);
    const muscleGroups = await findMuscleGroups(em, muscleGroupIds);

    const exercise = em.create(Exercise, {
        ...data,
        description: data.description ?? null,
        image: data.image ?? null,
        user: userId,
        trainingMethod,
    });
    exercise.muscleGroups.set(muscleGroups);
    await em.flush();
    res.status(201).json(toExerciseDto(exercise));
}

export async function update(req: Request, res: Response) {
    const em = orm.em;
    const userId = currentUserId(req);
    const exercise = await findOwnExercise(em, userId, idParam(req));
    const { trainingMethodId, muscleGroupIds, ...data } = parse(UpdateExerciseSchema, req.body);

    if (data.metricType && data.metricType !== exercise.metricType) {
        const progressions = await em.count(Progression, { exercise: exercise.id });
        if (progressions > 0 || (await isInUse(exercise.id))) {
            throw conflict('No se puede cambiar la forma de medir de un ejercicio que ya tiene ítems, progresiones o metas');
        }
    }
    await assertNameFree(userId, data.name, exercise.id);
    if (trainingMethodId) exercise.trainingMethod = await findTrainingMethod(em, trainingMethodId);
    if (muscleGroupIds) exercise.muscleGroups.set(await findMuscleGroups(em, muscleGroupIds));
    em.assign(exercise, data);
    await em.flush();
    res.json(toExerciseDto(exercise));
}

export async function remove(req: Request, res: Response) {
    const exercise = await findOwnExercise(orm.em, currentUserId(req), idParam(req), false);
    if (await isInUse(exercise.id)) {
        throw conflict('El ejercicio está en entrenamientos o metas: no se puede borrar');
    }
    await orm.em.nativeDelete(Exercise, { id: exercise.id });
    res.status(204).end();
}

import type { Request, Response } from 'express';
import { CreateTrainingItemSchema, UpdateTrainingItemSchema, volumeError, volumeFieldFor } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { idParam, invalid, notFound, parse } from '../shared/http.js';
import { currentUserId } from '../middlewares/auth.js';
import { findOwnExerciseForReference } from '../exercises/exercises.service.js';
import type { Exercise } from '../exercises/exercise.entity.js';
import { findOwnTraining } from '../trainings/trainings.service.js';
import { TrainingItem } from './trainingItem.entity.js';
import { toTrainingItemDto } from './trainingItem.mapper.js';

function assertVolume(exercise: Exercise, volume: { reps?: number | null; seconds?: number | null }) {
    const error = volumeError(exercise.metricType, volume);
    if (error) throw invalid(volumeFieldFor(exercise.metricType), error);
}

export async function create(req: Request, res: Response) {
    const userId = currentUserId(req);
    const training = await findOwnTraining(orm.em, userId, idParam(req));
    const { exerciseId, ...data } = parse(CreateTrainingItemSchema, req.body);
    const exercise = await findOwnExerciseForReference(orm.em, userId, exerciseId);
    assertVolume(exercise, data);

    const item = orm.em.create(TrainingItem, {
        sets: data.sets,
        reps: data.reps ?? null,
        seconds: data.seconds ?? null,
        weightKg: data.weightKg ?? null,
        restSeconds: data.restSeconds ?? null,
        comment: data.comment ?? null,
        completed: data.completed ?? false,
        training,
        exercise,
    });
    await orm.em.flush();
    res.status(201).json(toTrainingItemDto(item));
}

async function findOwnItem(req: Request) {
    const userId = currentUserId(req);
    const training = await findOwnTraining(orm.em, userId, idParam(req));
    const item = training.items.getItems().find((i) => i.id === idParam(req, 'itemId'));
    if (!item) throw notFound('El ítem no existe');
    return { userId, item };
}

export async function update(req: Request, res: Response) {
    const { userId, item } = await findOwnItem(req);
    const { exerciseId, ...data } = parse(UpdateTrainingItemSchema, req.body);
    const exercise = exerciseId ? await findOwnExerciseForReference(orm.em, userId, exerciseId) : item.exercise;
    assertVolume(exercise, {
        reps: 'reps' in data ? data.reps : item.reps,
        seconds: 'seconds' in data ? data.seconds : item.seconds,
    });
    orm.em.assign(item, data);
    item.exercise = exercise;
    await orm.em.flush();
    res.json(toTrainingItemDto(item));
}

export async function remove(req: Request, res: Response) {
    const { item } = await findOwnItem(req);
    await orm.em.removeAndFlush(item);
    res.status(204).end();
}

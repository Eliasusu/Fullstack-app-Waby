import type { Request, Response } from 'express';
import { CreateGoalSchema, isGoalTargetTypeValidFor, UpdateGoalSchema, type Goal as GoalDto, type GoalTargetType } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { idParam, invalid, notFound, parse } from '../shared/http.js';
import { findOwnMesocycleForReference } from '../mesocycles/mesocycles.service.js';
import { currentUserId } from '../middlewares/auth.js';
import { findOwnExerciseForReference } from '../exercises/exercises.service.js';
import type { Exercise } from '../exercises/exercise.entity.js';
import { Goal } from './goal.entity.js';
import { computeGoalProgress } from './goal-progress.js';
import { toGoalDto } from './goal.mapper.js';

/** Calcula el progreso (consulta la base) y arma la respuesta. */
async function withProgress(goal: Goal): Promise<GoalDto> {
    return toGoalDto(goal, await computeGoalProgress(orm.em, goal));
}

function assertTargetType(exercise: Exercise, targetType: GoalTargetType) {
    if (!isGoalTargetTypeValidFor(exercise.metricType, targetType)) {
        throw invalid('targetType', `Un ejercicio ${exercise.metricType === 'REPS' ? 'por repeticiones' : 'por tiempo'} no admite una meta de tipo ${targetType}`);
    }
}

async function findOwnGoal(req: Request) {
    const goal = await orm.em.findOne(Goal, { id: idParam(req), user: currentUserId(req) }, { populate: ['exercise', 'mesocycle'] });
    if (!goal) throw notFound('La meta no existe');
    return goal;
}

export async function getAll(req: Request, res: Response) {
    const goals = await orm.em.find(Goal, { user: currentUserId(req) }, { populate: ['exercise', 'mesocycle'], orderBy: { id: 'asc' } });
    res.json(await Promise.all(goals.map(withProgress)));
}

export async function getOne(req: Request, res: Response) {
    res.json(await withProgress(await findOwnGoal(req)));
}

export async function create(req: Request, res: Response) {
    const userId = currentUserId(req);
    const { exerciseId, mesocycleId, ...data } = parse(CreateGoalSchema, req.body);
    const exercise = await findOwnExerciseForReference(orm.em, userId, exerciseId);
    const mesocycle = await findOwnMesocycleForReference(orm.em, userId, mesocycleId);
    assertTargetType(exercise, data.targetType);
    const goal = orm.em.create(Goal, { ...data, exercise, mesocycle, user: userId });
    await orm.em.flush();
    res.status(201).json(await withProgress(goal));
}

export async function update(req: Request, res: Response) {
    const userId = currentUserId(req);
    const goal = await findOwnGoal(req);
    const { exerciseId, mesocycleId, ...data } = parse(UpdateGoalSchema, req.body);
    const exercise = exerciseId ? await findOwnExerciseForReference(orm.em, userId, exerciseId) : goal.exercise;
    assertTargetType(exercise, data.targetType ?? goal.targetType);
    if (mesocycleId) goal.mesocycle = await findOwnMesocycleForReference(orm.em, userId, mesocycleId);
    orm.em.assign(goal, data);
    goal.exercise = exercise;
    await orm.em.flush();
    res.json(await withProgress(goal));
}

export async function remove(req: Request, res: Response) {
    const goal = await findOwnGoal(req);
    await orm.em.removeAndFlush(goal);
    res.status(204).end();
}

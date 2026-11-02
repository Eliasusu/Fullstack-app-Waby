import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { GoalSchema } from '@waby/shared';
import {
    assertStatus,
    assertValidationError,
    createExercise,
    createTraining,
    setup,
    type ApiClient,
    type TestContext,
} from './helpers.js';

let ctx: TestContext;
let ana: ApiClient;
let beto: ApiClient;
let pullUpsId: number;
let frontLeverId: number;
before(async () => {
    ctx = await setup();
    ana = await ctx.user('ana');
    beto = await ctx.user('beto');
    pullUpsId = await createExercise(ana, ctx.catalog, { name: 'Dominadas' });
    frontLeverId = await createExercise(ana, ctx.catalog, { name: 'Front lever', metricType: 'TIME', difficulty: 'HARD' });
});
after(() => ctx.close());

describe('metas: CRUD', () => {
    test('alta: devuelve la meta con el ejercicio y sin progreso todavía', async () => {
        const res = await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'REPS', targetValue: 15, startDate: '2026-11-01' });
        assertStatus(res, 201);
        const goal = GoalSchema.parse(res.body);
        assert.deepEqual(goal.exercise, { id: pullUpsId, name: 'Dominadas', metricType: 'REPS' });
        assert.equal(goal.endDate, null);
        assert.equal(goal.currentValue, null);
        assert.equal(goal.achieved, false);
    });

    test('alta vacía → 400; fin antes del inicio → 400', async () => {
        assertValidationError(await ana.post('/goals', {}), 'exerciseId', 'targetType', 'targetValue', 'startDate');
        assertValidationError(
            await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'REPS', targetValue: 10, startDate: '2026-11-10', endDate: '2026-11-01' }),
            'endDate',
        );
    });

    test('targetType incompatible con el metricType del ejercicio → 400', async () => {
        assertValidationError(await ana.post('/goals', { exerciseId: frontLeverId, targetType: 'WEIGHT', targetValue: 10, startDate: '2026-11-01' }), 'targetType');
        assertValidationError(await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'SECONDS', targetValue: 10, startDate: '2026-11-01' }), 'targetType');
        assertStatus(await ana.post('/goals', { exerciseId: frontLeverId, targetType: 'SECONDS', targetValue: 12, startDate: '2026-11-01' }), 201);
        assertStatus(await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'WEIGHT', targetValue: 20, startDate: '2026-11-01' }), 201);
    });

    test('editar y borrar', async () => {
        const created = await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'REPS', targetValue: 20, startDate: '2026-11-01' });
        const updated = await ana.patch(`/goals/${created.body.id}`, { targetValue: 25, endDate: '2026-12-31' });
        assertStatus(updated, 200);
        assert.equal(updated.body.targetValue, 25);
        assert.equal(updated.body.endDate, '2026-12-31');
        assertValidationError(await ana.patch(`/goals/${created.body.id}`, { targetType: 'SECONDS' }), 'targetType');
        assertStatus(await ana.delete(`/goals/${created.body.id}`), 204);
        assertStatus(await ana.get(`/goals/${created.body.id}`), 404);
    });

    test('propiedad: metas ajenas → 404; meta sobre un ejercicio ajeno → 400 (nota 49)', async () => {
        const betoExercise = await createExercise(beto, ctx.catalog, { name: 'Dominadas' });
        const betoGoal = await beto.post('/goals', { exerciseId: betoExercise, targetType: 'REPS', targetValue: 10, startDate: '2026-11-01' });
        assertStatus(betoGoal, 201);
        assertStatus(await ana.get(`/goals/${betoGoal.body.id}`), 404);
        assertStatus(await ana.patch(`/goals/${betoGoal.body.id}`, { targetValue: 1 }), 404);
        assertStatus(await ana.delete(`/goals/${betoGoal.body.id}`), 404);
        assertValidationError(await ana.post('/goals', { exerciseId: betoExercise, targetType: 'REPS', targetValue: 10, startDate: '2026-11-01' }), 'exerciseId');
        const list = await ana.get('/goals');
        assert.ok(list.body.every((g: { id: number }) => g.id !== betoGoal.body.id));
        assertStatus(await ctx.anon().get('/goals'), 401);
    });
});

/**
 * Progreso de la Meta (núcleo del CU "Registrar una meta"). Quedan como `todo`
 * hasta definir quién lo implementa (nota 110, TODO(cu) en goals.controllers.ts):
 * corren, pero si fallan no rompen la suite.
 */
const TODO_CU = { todo: 'TODO(cu): cálculo del progreso de la Meta (goals/goal-progress.ts)' };

describe('metas: progreso derivado de los ítems completados', () => {
    test('currentValue es el mejor valor entre los ítems completados dentro de las fechas', TODO_CU, async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Fondos' });
        const goal = await ana.post('/goals', { exerciseId, targetType: 'REPS', targetValue: 12, startDate: '2026-11-01', endDate: '2026-11-30' });

        const inside = await createTraining(ana, '2026-11-10');
        const done = await ana.post(`/trainings/${inside}/items`, { exerciseId, sets: 3, reps: 10, completed: true });
        assertStatus(done, 201);
        await ana.post(`/trainings/${inside}/items`, { exerciseId, sets: 3, reps: 14 });
        const outside = await createTraining(ana, '2026-12-05');
        await ana.post(`/trainings/${outside}/items`, { exerciseId, sets: 3, reps: 20, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 10);
        assert.equal(res.body.achieved, false);
    });

    test('achieved cuando el mejor valor llega al objetivo', TODO_CU, async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Dominadas lastradas' });
        const goal = await ana.post('/goals', { exerciseId, targetType: 'WEIGHT', targetValue: 20, startDate: '2026-11-01' });
        const trainingId = await createTraining(ana, '2026-11-15');
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 5, weightKg: 22.5, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 22.5);
        assert.equal(res.body.achieved, true);
    });

    test('meta por segundos usa los segundos de los ítems', TODO_CU, async () => {
        const goal = await ana.post('/goals', { exerciseId: frontLeverId, targetType: 'SECONDS', targetValue: 15, startDate: '2026-11-01' });
        const trainingId = await createTraining(ana, '2026-11-20');
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId: frontLeverId, sets: 4, seconds: 8, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 8);
        assert.equal(res.body.achieved, false);
    });
});

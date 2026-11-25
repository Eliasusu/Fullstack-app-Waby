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
let anaMesocycleId: number;

async function createMesocycle(client: ApiClient, name = 'Bloque de fuerza') {
    const res = await client.post('/mesocycles', { name, type: 'STRENGTH', startDate: '2026-11-02', weeks: 4 });
    assertStatus(res, 201);
    return res.body.id as number;
}

before(async () => {
    ctx = await setup();
    ana = await ctx.user('ana');
    beto = await ctx.user('beto');
    pullUpsId = await createExercise(ana, ctx.catalog, { name: 'Dominadas' });
    frontLeverId = await createExercise(ana, ctx.catalog, { name: 'Front lever', metricType: 'TIME', difficulty: 'HARD' });
    anaMesocycleId = await createMesocycle(ana);
});
after(() => ctx.close());

describe('metas: CRUD', () => {
    test('alta: devuelve la meta con el ejercicio, el mesociclo y sin progreso todavía', async () => {
        const res = await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: anaMesocycleId, targetType: 'REPS', targetValue: 15 });
        assertStatus(res, 201);
        const goal = GoalSchema.parse(res.body);
        assert.deepEqual(goal.exercise, { id: pullUpsId, name: 'Dominadas', metricType: 'REPS' });
        assert.deepEqual(goal.mesocycle, { id: anaMesocycleId, name: 'Bloque de fuerza' });
        assert.equal(goal.currentValue, null);
        assert.equal(goal.achieved, false);
    });

    test('alta vacía → 400; sin mesociclo → 400; con fechas → 400 (ya no existen)', async () => {
        assertValidationError(await ana.post('/goals', {}), 'exerciseId', 'mesocycleId', 'targetType', 'targetValue');
        assertValidationError(await ana.post('/goals', { exerciseId: pullUpsId, targetType: 'REPS', targetValue: 10 }), 'mesocycleId');
        assertValidationError(await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: null, targetType: 'REPS', targetValue: 10 }), 'mesocycleId');
        assertStatus(
            await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: anaMesocycleId, targetType: 'REPS', targetValue: 10, startDate: '2026-11-01' }),
            400,
        );
    });

    test('targetType incompatible con el metricType del ejercicio → 400', async () => {
        const base = { mesocycleId: anaMesocycleId, targetValue: 10 };
        assertValidationError(await ana.post('/goals', { ...base, exerciseId: frontLeverId, targetType: 'WEIGHT' }), 'targetType');
        assertValidationError(await ana.post('/goals', { ...base, exerciseId: pullUpsId, targetType: 'SECONDS' }), 'targetType');
        assertStatus(await ana.post('/goals', { ...base, exerciseId: frontLeverId, targetType: 'SECONDS' }), 201);
        assertStatus(await ana.post('/goals', { ...base, exerciseId: pullUpsId, targetType: 'WEIGHT' }), 201);
    });

    test('editar (incluido cambiar de mesociclo, pero no quitarlo) y borrar', async () => {
        const created = await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: anaMesocycleId, targetType: 'REPS', targetValue: 20 });
        const otherMesocycleId = await createMesocycle(ana, 'Hipertrofia');
        const updated = await ana.patch(`/goals/${created.body.id}`, { targetValue: 25, mesocycleId: otherMesocycleId });
        assertStatus(updated, 200);
        assert.equal(updated.body.targetValue, 25);
        assert.deepEqual(updated.body.mesocycle, { id: otherMesocycleId, name: 'Hipertrofia' });
        assertValidationError(await ana.patch(`/goals/${created.body.id}`, { mesocycleId: null }), 'mesocycleId');
        assertValidationError(await ana.patch(`/goals/${created.body.id}`, { targetType: 'SECONDS' }), 'targetType');
        assertStatus(await ana.delete(`/goals/${created.body.id}`), 204);
        assertStatus(await ana.get(`/goals/${created.body.id}`), 404);
    });

    test('propiedad: metas ajenas → 404; ejercicio o mesociclo ajeno en el body → 400', async () => {
        const betoExercise = await createExercise(beto, ctx.catalog, { name: 'Dominadas' });
        const betoMesocycle = await createMesocycle(beto);
        const betoGoal = await beto.post('/goals', { exerciseId: betoExercise, mesocycleId: betoMesocycle, targetType: 'REPS', targetValue: 10 });
        assertStatus(betoGoal, 201);
        assertStatus(await ana.get(`/goals/${betoGoal.body.id}`), 404);
        assertStatus(await ana.patch(`/goals/${betoGoal.body.id}`, { targetValue: 1 }), 404);
        assertStatus(await ana.delete(`/goals/${betoGoal.body.id}`), 404);
        assertValidationError(await ana.post('/goals', { exerciseId: betoExercise, mesocycleId: anaMesocycleId, targetType: 'REPS', targetValue: 10 }), 'exerciseId');
        assertValidationError(await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: betoMesocycle, targetType: 'REPS', targetValue: 10 }), 'mesocycleId');
        const own = await ana.post('/goals', { exerciseId: pullUpsId, mesocycleId: anaMesocycleId, targetType: 'REPS', targetValue: 10 });
        assertValidationError(await ana.patch(`/goals/${own.body.id}`, { mesocycleId: betoMesocycle }), 'mesocycleId');
        const list = await ana.get('/goals');
        assert.ok(list.body.every((g: { id: number }) => g.id !== betoGoal.body.id));
        assertStatus(await ctx.anon().get('/goals'), 401);
    });

    test('borrar el mesociclo deja la meta sin mesociclo y sin progreso', async () => {
        const mesocycleId = await createMesocycle(ana, 'Descarga');
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Remo invertido' });
        const goal = await ana.post('/goals', { exerciseId, mesocycleId, targetType: 'REPS', targetValue: 12 });
        const trainingId = await createTraining(ana, '2026-11-10', { mesocycleId });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 15, completed: true });

        assertStatus(await ana.delete(`/mesocycles/${mesocycleId}`), 204);
        const res = await ana.get(`/goals/${goal.body.id}`);
        assertStatus(res, 200);
        assert.equal(res.body.mesocycle, null);
        assert.equal(res.body.currentValue, null);
        assert.equal(res.body.achieved, false);
    });
});

/**
 * Progreso de la Meta: núcleo del CU "Registrar una meta" (TODO(elias) en goals/goal-progress.ts).
 * Es la spec ejecutable del cálculo: hasta que se implemente, los que esperan un valor fallan.
 */
describe('metas: progreso derivado de los ítems completados del mesociclo', () => {
    test('REPS: el mejor valor entre los ítems completados de entrenamientos de ese mesociclo', async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Fondos' });
        const mesocycleId = await createMesocycle(ana, 'Fuerza empuje');
        const otherMesocycleId = await createMesocycle(ana, 'Otro bloque');
        const goal = await ana.post('/goals', { exerciseId, mesocycleId, targetType: 'REPS', targetValue: 12 });
createMesocycle
        const inside = await createTraining(ana, '2026-11-10', { mesocycleId });
        assertStatus(await ana.post(`/trainings/${inside}/items`, { exerciseId, sets: 3, reps: 8, completed: true }), 201);
        await ana.post(`/trainings/${inside}/items`, { exerciseId, sets: 3, reps: 10, completed: true });
        await ana.post(`/trainings/${inside}/items`, { exerciseId, sets: 3, reps: 14 }); // no completado
        const otherMesocycle = await createTraining(ana, '2026-11-11', { mesocycleId: otherMesocycleId });
        await ana.post(`/trainings/${otherMesocycle}/items`, { exerciseId, sets: 3, reps: 20, completed: true });
        const loose = await createTraining(ana, '2026-11-12');
        await ana.post(`/trainings/${loose}/items`, { exerciseId, sets: 3, reps: 18, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 10);
        assert.equal(res.body.achieved, false);
    });

    test('WEIGHT: achieved cuando el mejor valor llega al objetivo; los ítems sin peso se ignoran', async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Dominadas lastradas' });
        const mesocycleId = await createMesocycle(ana, 'Lastre');
        const goal = await ana.post('/goals', { exerciseId, mesocycleId, targetType: 'WEIGHT', targetValue: 20 });
        const trainingId = await createTraining(ana, '2026-11-15', { mesocycleId });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 12, completed: true }); // sin peso
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 5, weightKg: 15, completed: true });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 5, weightKg: 20, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 20);
        assert.equal(res.body.achieved, true);
    });

    test('SECONDS: usa los segundos de los ítems', async () => {
        const mesocycleId = await createMesocycle(ana, 'Estáticos');
        const goal = await ana.post('/goals', { exerciseId: frontLeverId, mesocycleId, targetType: 'SECONDS', targetValue: 15 });
        const trainingId = await createTraining(ana, '2026-11-20', { mesocycleId });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId: frontLeverId, sets: 4, seconds: 6, completed: true });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId: frontLeverId, sets: 4, seconds: 8, completed: true });

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, 8);
        assert.equal(res.body.achieved, false);
    });

    test('sin ítems completados del ejercicio en el mesociclo → currentValue null', async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Muscle up' });
        const mesocycleId = await createMesocycle(ana, 'Técnica');
        const goal = await ana.post('/goals', { exerciseId, mesocycleId, targetType: 'REPS', targetValue: 3 });
        const trainingId = await createTraining(ana, '2026-11-21', { mesocycleId });
        await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, reps: 10, completed: true }); // otro ejercicio

        const res = await ana.get(`/goals/${goal.body.id}`);
        assert.equal(res.body.currentValue, null);
        assert.equal(res.body.achieved, false);
    });
});

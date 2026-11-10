import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { ExerciseSchema, ProgressionSchema } from '@waby/shared';
import {
    assertStatus,
    assertValidationError,
    createExercise,
    createTraining,
    exerciseData,
    setup,
    type ApiClient,
    type TestContext,
} from './helpers.js';

let ctx: TestContext;
let ana: ApiClient;
let beto: ApiClient;
before(async () => {
    ctx = await setup();
    ana = await ctx.user('ana');
    beto = await ctx.user('beto');
});
after(() => ctx.close());

describe('ejercicios', () => {
    test('alta: devuelve el ejercicio con método y grupos como objetos', async () => {
        const res = await ana.post('/exercises', exerciseData(ctx.catalog, { muscleGroupIds: [ctx.catalog.backId, ctx.catalog.coreId] }));
        assertStatus(res, 201);
        const exercise = ExerciseSchema.parse(res.body);
        assert.deepEqual(exercise.trainingMethod, { id: ctx.catalog.calisthenicsId, name: 'Calistenia' });
        assert.deepEqual(exercise.muscleGroups.map((g) => g.name).sort(), ['Core', 'Espalda']);
        assert.equal(exercise.metricType, 'REPS');
        assert.equal(exercise.image, null);
    });

    test('dos usuarios pueden tener un ejercicio con el mismo nombre (nota 06)', async () => {
        const res = await beto.post('/exercises', exerciseData(ctx.catalog));
        assertStatus(res, 201);
    });

    test('el mismo usuario no puede repetir el nombre → 409', async () => {
        assertStatus(await ana.post('/exercises', exerciseData(ctx.catalog)), 409);
    });

    test('alta vacía → 400 con los obligatorios (nota 26)', async () => {
        assertValidationError(await ana.post('/exercises', {}), 'name', 'trainingMethodId', 'muscleGroupIds', 'difficulty', 'movementPattern', 'metricType');
    });

    test('valores fuera del enum o campos de más → 400 (nota 27)', async () => {
        assertValidationError(await ana.post('/exercises', exerciseData(ctx.catalog, { name: 'X', difficulty: 'Imposible' as never })), 'difficulty');
        assertValidationError(await ana.post('/exercises', { ...exerciseData(ctx.catalog, { name: 'Y' }), user: 'otro' }));
    });

    test('método o grupo muscular inexistente → 400', async () => {
        assertValidationError(await ana.post('/exercises', exerciseData(ctx.catalog, { name: 'Z', trainingMethodId: 9999 })), 'trainingMethodId');
        assertValidationError(await ana.post('/exercises', exerciseData(ctx.catalog, { name: 'Z', muscleGroupIds: [9999] })), 'muscleGroupIds');
    });

    test('listado: solo los propios, con filtros por grupo y método', async () => {
        await createExercise(ana, ctx.catalog, { name: 'Flexiones', muscleGroupIds: [ctx.catalog.chestId], movementPattern: 'PUSH' });
        await createExercise(ana, ctx.catalog, { name: 'Press de banca', trainingMethodId: ctx.catalog.gymId, muscleGroupIds: [ctx.catalog.chestId], movementPattern: 'PUSH' });

        const all = await ana.get('/exercises');
        assertStatus(all, 200);
        assert.deepEqual(all.body.map((e: { name: string }) => e.name).sort(), ['Dominadas', 'Flexiones', 'Press de banca']);

        const chest = await ana.get(`/exercises?muscleGroupId=${ctx.catalog.chestId}`);
        assert.deepEqual(chest.body.map((e: { name: string }) => e.name).sort(), ['Flexiones', 'Press de banca']);

        const chestGym = await ana.get(`/exercises?muscleGroupId=${ctx.catalog.chestId}&trainingMethodId=${ctx.catalog.gymId}`);
        assert.deepEqual(chestGym.body.map((e: { name: string }) => e.name), ['Press de banca']);

        const betos = await beto.get('/exercises');
        assert.deepEqual(betos.body.map((e: { name: string }) => e.name), ['Dominadas']);

        assertValidationError(await ana.get('/exercises?muscleGroupId=abc'), 'muscleGroupId');
    });

    test('editar: cambia campos y grupos sin perder los demás (nota 70)', async () => {
        const id = await createExercise(ana, ctx.catalog, { name: 'Remo invertido', muscleGroupIds: [ctx.catalog.backId] });
        const res = await ana.patch(`/exercises/${id}`, { difficulty: 'EASY', muscleGroupIds: [ctx.catalog.backId, ctx.catalog.coreId] });
        assertStatus(res, 200);
        const exercise = ExerciseSchema.parse(res.body);
        assert.equal(exercise.difficulty, 'EASY');
        assert.equal(exercise.name, 'Remo invertido');
        assert.equal(exercise.muscleGroups.length, 2);
        const again = await ana.patch(`/exercises/${id}`, { name: 'Remo australiano' });
        assert.equal(again.body.muscleGroups.length, 2);
    });

    test('propiedad: A no ve, no edita ni borra los ejercicios de B → 404 (nota 14)', async () => {
        const id = await createExercise(beto, ctx.catalog, { name: 'Muscle up' });
        assertStatus(await ana.get(`/exercises/${id}`), 404);
        assertStatus(await ana.patch(`/exercises/${id}`, { name: 'Robado' }), 404);
        assertStatus(await ana.delete(`/exercises/${id}`), 404);
        assertStatus(await beto.get(`/exercises/${id}`), 200);
    });

    test('borrar: sin uso → 204; inexistente → 404', async () => {
        const id = await createExercise(ana, ctx.catalog, { name: 'Para borrar' });
        assertStatus(await ana.delete(`/exercises/${id}`), 204);
        assertStatus(await ana.get(`/exercises/${id}`), 404);
        assertStatus(await ana.delete('/exercises/9999'), 404);
    });

    test('borrar o cambiar metricType de un ejercicio en uso → 409', async () => {
        const exerciseId = await createExercise(ana, ctx.catalog, { name: 'Fondos' });
        const trainingId = await createTraining(ana, '2026-11-10');
        assertStatus(await ana.post(`/trainings/${trainingId}/items`, { exerciseId, sets: 3, reps: 10 }), 201);
        assertStatus(await ana.delete(`/exercises/${exerciseId}`), 409);
        assertStatus(await ana.patch(`/exercises/${exerciseId}`, { metricType: 'TIME' }), 409);
    });

    test('sin sesión → 401', async () => {
        assertStatus(await ctx.anon().get('/exercises'), 401);
    });
});

describe('progresiones', () => {
    let frontLeverId: number;
    let pullUpId: number;
    before(async () => {
        frontLeverId = await createExercise(ana, ctx.catalog, { name: 'Front lever', metricType: 'TIME', difficulty: 'HARD' });
        pullUpId = await createExercise(ana, ctx.catalog, { name: 'Dominadas progresión' });
    });

    test('alta en un ejercicio por tiempo: lleva segundos', async () => {
        const res = await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 1, name: 'Tuck', sets: 3, seconds: 10 });
        assertStatus(res, 201);
        const progression = ProgressionSchema.parse(res.body);
        assert.equal(progression.exerciseId, frontLeverId);
        assert.equal(progression.reps, null);
    });

    test('el volumen tiene que coincidir con el metricType del ejercicio → 400', async () => {
        assertValidationError(await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 2, name: 'Advanced tuck', sets: 3, reps: 5 }));
        assertValidationError(await ana.post(`/exercises/${pullUpId}/progressions`, { order: 1, name: 'Negativas', sets: 3, seconds: 5 }));
    });

    test('alta vacía o con valores negativos → 400 (nota 27)', async () => {
        assertValidationError(await ana.post(`/exercises/${pullUpId}/progressions`, {}), 'order', 'name', 'sets');
        assertValidationError(await ana.post(`/exercises/${pullUpId}/progressions`, { order: -1.5, name: '', sets: -3, reps: 0 }), 'order', 'name', 'sets', 'reps');
    });

    test('listado ordenado por order; nombre u orden repetido → 409', async () => {
        await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 3, name: 'One leg', sets: 3, seconds: 8 });
        await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 2, name: 'Advanced tuck', sets: 3, seconds: 8 });
        const res = await ana.get(`/exercises/${frontLeverId}/progressions`);
        assertStatus(res, 200);
        assert.deepEqual(res.body.map((p: { name: string }) => p.name), ['Tuck', 'Advanced tuck', 'One leg']);
        assertStatus(await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 9, name: 'Tuck', sets: 3, seconds: 8 }), 409);
        assertStatus(await ana.post(`/exercises/${frontLeverId}/progressions`, { order: 1, name: 'Otra', sets: 3, seconds: 8 }), 409);
    });

    test('editar y borrar', async () => {
        const created = await ana.post(`/exercises/${pullUpId}/progressions`, { order: 1, name: 'Negativas', sets: 3, reps: 5 });
        const path = `/exercises/${pullUpId}/progressions/${created.body.id}`;
        const updated = await ana.patch(path, { reps: 8 });
        assertStatus(updated, 200);
        assert.equal(updated.body.reps, 8);
        assertValidationError(await ana.patch(path, { seconds: 10 }));
        assertStatus(await ana.delete(path), 204);
        assertStatus(await ana.delete(path), 404);
    });

    test('propiedad: progresiones de un ejercicio ajeno → 404 (nota 16)', async () => {
        assertStatus(await beto.get(`/exercises/${frontLeverId}/progressions`), 404);
        assertStatus(await beto.post(`/exercises/${frontLeverId}/progressions`, { order: 5, name: 'Full', sets: 1, seconds: 5 }), 404);
        assertStatus(await ctx.anon().get(`/exercises/${frontLeverId}/progressions`), 401);
    });

    test('borrar el ejercicio borra sus progresiones', async () => {
        const id = await createExercise(ana, ctx.catalog, { name: 'Planche', metricType: 'TIME', movementPattern: 'PUSH' });
        await ana.post(`/exercises/${id}/progressions`, { order: 1, name: 'Tuck planche', sets: 3, seconds: 10 });
        assertStatus(await ana.delete(`/exercises/${id}`), 204);
    });
});

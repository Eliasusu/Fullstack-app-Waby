import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { MesocycleSchema, TrainingItemSchema, TrainingSchema, TrainingWithItemsSchema } from '@waby/shared';
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
let plankId: number;
before(async () => {
    ctx = await setup();
    ana = await ctx.user('ana');
    beto = await ctx.user('beto');
    pullUpsId = await createExercise(ana, ctx.catalog, { name: 'Dominadas' });
    plankId = await createExercise(ana, ctx.catalog, { name: 'Plancha', metricType: 'TIME', movementPattern: 'CORE', muscleGroupIds: [ctx.catalog.coreId] });
});
after(() => ctx.close());

describe('entrenamientos', () => {
    test('alta: devuelve el entrenamiento con items vacío y el día sin hora', async () => {
        const res = await ana.post('/trainings', { name: 'Tirón', day: '2026-11-02' });
        assertStatus(res, 201);
        const training = TrainingWithItemsSchema.parse(res.body);
        assert.equal(training.day, '2026-11-02');
        assert.equal(training.completed, false);
        assert.equal(training.mesocycle, null);
        assert.deepEqual(training.items, []);
    });

    test('alta vacía o con fecha inválida → 400 (nota 26)', async () => {
        assertValidationError(await ana.post('/trainings', {}), 'name', 'day');
        assertValidationError(await ana.post('/trainings', { name: 'X', day: '02/11/2026' }), 'day');
    });

    test('varios entrenamientos el mismo día: el rango los devuelve todos (nota 28)', async () => {
        await createTraining(ana, '2026-11-03', { name: 'Mañana' });
        await createTraining(ana, '2026-11-03', { name: 'Tarde' });
        await createTraining(ana, '2026-11-20');
        const day = await ana.get('/trainings?from=2026-11-03&to=2026-11-03');
        assertStatus(day, 200);
        assert.deepEqual(day.body.map((t: { name: string }) => t.name).sort(), ['Mañana', 'Tarde']);
        for (const training of day.body) TrainingSchema.parse(training);

        const all = await ana.get('/trainings');
        assert.deepEqual(all.body.map((t: { day: string }) => t.day), ['2026-11-02', '2026-11-03', '2026-11-03', '2026-11-20']);

        assertValidationError(await ana.get('/trainings?from=ayer'), 'from');
    });

    test('editar: cambia nombre, día y completado', async () => {
        const id = await createTraining(ana, '2026-11-04');
        const res = await ana.patch(`/trainings/${id}`, { name: 'Empuje', day: '2026-11-05', completed: true });
        assertStatus(res, 200);
        assert.equal(res.body.name, 'Empuje');
        assert.equal(res.body.day, '2026-11-05');
        assert.equal(res.body.completed, true);
    });

    test('propiedad: A no ve ni toca los entrenamientos de B → 404', async () => {
        const id = await createTraining(beto, '2026-11-06');
        assertStatus(await ana.get(`/trainings/${id}`), 404);
        assertStatus(await ana.patch(`/trainings/${id}`, { name: 'Robado' }), 404);
        assertStatus(await ana.delete(`/trainings/${id}`), 404);
        const anas = await ana.get('/trainings?from=2026-11-06&to=2026-11-06');
        assert.deepEqual(anas.body, []);
    });

    test('borrar: borra también sus ítems; inexistente → 404 (nota 11)', async () => {
        const id = await createTraining(ana, '2026-11-07');
        await ana.post(`/trainings/${id}/items`, { exerciseId: pullUpsId, sets: 3, reps: 8 });
        assertStatus(await ana.delete(`/trainings/${id}`), 204);
        assertStatus(await ana.get(`/trainings/${id}`), 404);
        assertStatus(await ana.delete(`/trainings/${id}`), 404);
    });

    test('sin sesión → 401', async () => {
        assertStatus(await ctx.anon().get('/trainings'), 401);
    });
});

describe('ítems de entrenamiento', () => {
    let trainingId: number;
    before(async () => {
        trainingId = await createTraining(ana, '2026-11-08');
    });

    test('alta por reps, con peso en kg; el detalle del entrenamiento lo trae', async () => {
        const res = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 4, reps: 6, weightKg: 10, restSeconds: 120 });
        assertStatus(res, 201);
        const item = TrainingItemSchema.parse(res.body);
        assert.deepEqual(item.exercise, { id: pullUpsId, name: 'Dominadas', metricType: 'REPS' });
        assert.equal(item.weightKg, 10);
        assert.equal(item.seconds, null);
        assert.equal(item.completed, false);

        const training = await ana.get(`/trainings/${trainingId}`);
        assert.equal(TrainingWithItemsSchema.parse(training.body).items.length, 1);
    });

    test('alta por tiempo: lleva segundos y el peso vacío es peso corporal', async () => {
        const res = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: plankId, sets: 3, seconds: 45 });
        assertStatus(res, 201);
        assert.equal(res.body.seconds, 45);
        assert.equal(res.body.weightKg, null);
    });

    test('el volumen tiene que coincidir con el metricType → 400', async () => {
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, { exerciseId: plankId, sets: 3, reps: 10 }));
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, seconds: 10 }));
    });

    test('alta vacía, sets decimales o peso como texto → 400 (nota 27)', async () => {
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, {}), 'exerciseId', 'sets');
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 1.5, reps: 5 }), 'sets');
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, reps: 5, weightKg: 'mucho' }), 'weightKg');
    });

    test('editar: marca completado el ítem indicado y no otro (nota 65)', async () => {
        const first = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, reps: 5 });
        const second = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, reps: 7 });
        const res = await ana.patch(`/trainings/${trainingId}/items/${second.body.id}`, { completed: true, comment: 'Salió bien' });
        assertStatus(res, 200);
        assert.equal(res.body.completed, true);
        const training = await ana.get(`/trainings/${trainingId}`);
        const byId = new Map(training.body.items.map((i: { id: number; completed: boolean }) => [i.id, i.completed]));
        assert.equal(byId.get(first.body.id), false);
        assert.equal(byId.get(second.body.id), true);
    });

    test('borrar un ítem', async () => {
        const created = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 1, reps: 1 });
        assertStatus(await ana.delete(`/trainings/${trainingId}/items/${created.body.id}`), 204);
        assertStatus(await ana.delete(`/trainings/${trainingId}/items/${created.body.id}`), 404);
    });

    test('propiedad: ítems en entrenamientos ajenos o con ejercicios ajenos (nota 15)', async () => {
        const betoTraining = await createTraining(beto, '2026-11-09');
        assertStatus(await ana.post(`/trainings/${betoTraining}/items`, { exerciseId: pullUpsId, sets: 3, reps: 5 }), 404);
        const betoExercise = await createExercise(beto, ctx.catalog, { name: 'Muscle up' });
        assertValidationError(await ana.post(`/trainings/${trainingId}/items`, { exerciseId: betoExercise, sets: 3, reps: 5 }), 'exerciseId');
        const anaItem = await ana.post(`/trainings/${trainingId}/items`, { exerciseId: pullUpsId, sets: 3, reps: 5 });
        assertStatus(await beto.patch(`/trainings/${trainingId}/items/${anaItem.body.id}`, { completed: true }), 404);
        assertStatus(await beto.delete(`/trainings/${trainingId}/items/${anaItem.body.id}`), 404);
    });
});

describe('mesociclos', () => {
    test('alta: calcula la fecha de fin y la cantidad de entrenamientos', async () => {
        const res = await ana.post('/mesocycles', { name: 'Bloque de fuerza', type: 'STRENGTH', startDate: '2026-11-02', weeks: 4 });
        assertStatus(res, 201);
        const mesocycle = MesocycleSchema.parse(res.body);
        assert.equal(mesocycle.endDate, '2026-11-29');
        assert.equal(mesocycle.trainingsCount, 0);
    });

    test('alta vacía o con semanas inválidas → 400', async () => {
        assertValidationError(await ana.post('/mesocycles', {}), 'name', 'type', 'startDate', 'weeks');
        assertValidationError(await ana.post('/mesocycles', { name: 'X', type: 'STRENGTH', startDate: '2026-11-02', weeks: 0 }), 'weeks');
        assertValidationError(await ana.post('/mesocycles', { name: 'X', type: 'VOLUMEN', startDate: '2026-11-02', weeks: 4 }), 'type');
    });

    test('asociar entrenamientos: al crearlos o editarlos; el mesociclo los lista', async () => {
        const meso = await ana.post('/mesocycles', { name: 'Hipertrofia', type: 'HYPERTROPHY', startDate: '2026-12-01', weeks: 3 });
        const first = await ana.post('/trainings', { name: 'Día 1', day: '2026-12-01', mesocycleId: meso.body.id });
        assertStatus(first, 201);
        assert.deepEqual(first.body.mesocycle, { id: meso.body.id, name: 'Hipertrofia' });
        const second = await createTraining(ana, '2026-12-03');
        assertStatus(await ana.patch(`/trainings/${second}`, { mesocycleId: meso.body.id }), 200);

        const trainings = await ana.get(`/mesocycles/${meso.body.id}/trainings`);
        assertStatus(trainings, 200);
        assert.deepEqual(trainings.body.map((t: { day: string }) => t.day), ['2026-12-01', '2026-12-03']);
        const detail = await ana.get(`/mesocycles/${meso.body.id}`);
        assert.equal(detail.body.trainingsCount, 2);

        const detached = await ana.patch(`/trainings/${second}`, { mesocycleId: null });
        assert.equal(detached.body.mesocycle, null);
    });

    test('editar', async () => {
        const meso = await ana.post('/mesocycles', { name: 'Descarga', type: 'DELOAD', startDate: '2027-01-04', weeks: 1 });
        const res = await ana.patch(`/mesocycles/${meso.body.id}`, { weeks: 2 });
        assertStatus(res, 200);
        assert.equal(res.body.endDate, '2027-01-17');
    });

    test('borrar: los entrenamientos quedan sueltos', async () => {
        const meso = await ana.post('/mesocycles', { name: 'Para borrar', type: 'STRENGTH', startDate: '2027-02-01', weeks: 2 });
        const trainingId = await createTraining(ana, '2027-02-02', { mesocycleId: meso.body.id });
        assertStatus(await ana.delete(`/mesocycles/${meso.body.id}`), 204);
        assertStatus(await ana.get(`/mesocycles/${meso.body.id}`), 404);
        const training = await ana.get(`/trainings/${trainingId}`);
        assertStatus(training, 200);
        assert.equal(training.body.mesocycle, null);
    });

    test('propiedad: mesociclos ajenos → 404; asociar a un mesociclo ajeno → 400', async () => {
        const meso = await beto.post('/mesocycles', { name: 'De Beto', type: 'STRENGTH', startDate: '2026-11-02', weeks: 4 });
        assertStatus(await ana.get(`/mesocycles/${meso.body.id}`), 404);
        assertStatus(await ana.get(`/mesocycles/${meso.body.id}/trainings`), 404);
        assertStatus(await ana.patch(`/mesocycles/${meso.body.id}`, { name: 'Robado' }), 404);
        assertStatus(await ana.delete(`/mesocycles/${meso.body.id}`), 404);
        assertValidationError(await ana.post('/trainings', { name: 'X', day: '2026-11-02', mesocycleId: meso.body.id }), 'mesocycleId');
        const list = await ana.get('/mesocycles');
        assert.ok(list.body.every((m: { name: string }) => m.name !== 'De Beto'));
    });
});

import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { MuscleGroupSchema, TrainingMethodSchema } from '@waby/shared';
import { assertStatus, assertValidationError, createExercise, setup, type ApiClient, type TestContext } from './helpers.js';

let ctx: TestContext;
let user: ApiClient;
let admin: ApiClient;
before(async () => {
    ctx = await setup();
    user = await ctx.user('ana');
    admin = await ctx.admin();
});
after(() => ctx.close());

describe('métodos de entrenamiento', () => {
    test('el listado es público (lo usa el registro)', async () => {
        const res = await ctx.anon().get('/training-methods');
        assertStatus(res, 200);
        const methods = res.body.map((m: unknown) => TrainingMethodSchema.parse(m));
        assert.deepEqual(methods.map((m: { name: string }) => m.name).sort(), ['Calistenia', 'Gimnasio']);
    });

    test('GET por id; inexistente → 404; id inválido → 400', async () => {
        assertStatus(await ctx.anon().get(`/training-methods/${ctx.catalog.gymId}`), 200);
        assertStatus(await ctx.anon().get('/training-methods/9999'), 404);
        assertStatus(await ctx.anon().get('/training-methods/abc'), 400);
    });

    test('escribir: sin sesión 401, usuario común 403 (nota 20)', async () => {
        const body = { name: 'Streetlifting', description: 'Calistenia con lastre' };
        assertStatus(await ctx.anon().post('/training-methods', body), 401);
        assertStatus(await user.post('/training-methods', body), 403);
        assertStatus(await user.patch(`/training-methods/${ctx.catalog.gymId}`, { name: 'x' }), 403);
        assertStatus(await user.delete(`/training-methods/${ctx.catalog.gymId}`), 403);
    });

    test('admin: crea, edita y borra', async () => {
        const created = await admin.post('/training-methods', { name: 'Streetlifting', description: 'Calistenia con lastre' });
        assertStatus(created, 201);
        const { id } = TrainingMethodSchema.parse(created.body);
        const updated = await admin.patch(`/training-methods/${id}`, { description: 'Dominadas y fondos lastrados' });
        assertStatus(updated, 200);
        assert.equal(updated.body.description, 'Dominadas y fondos lastrados');
        assertStatus(await admin.delete(`/training-methods/${id}`), 204);
        assertStatus(await ctx.anon().get(`/training-methods/${id}`), 404);
    });

    test('admin: alta vacía → 400, nombre repetido → 409', async () => {
        assertValidationError(await admin.post('/training-methods', {}), 'name', 'description');
        assertStatus(await admin.post('/training-methods', { name: 'Gimnasio', description: 'Otra vez' }), 409);
    });

    test('borrar un método en uso → 409', async () => {
        await createExercise(user, ctx.catalog, { name: 'Press de banca', trainingMethodId: ctx.catalog.gymId, muscleGroupIds: [ctx.catalog.chestId], movementPattern: 'PUSH' });
        assertStatus(await admin.delete(`/training-methods/${ctx.catalog.gymId}`), 409);
    });
});

describe('grupos musculares', () => {
    test('el listado pide sesión', async () => {
        assertStatus(await ctx.anon().get('/muscle-groups'), 401);
        const res = await user.get('/muscle-groups');
        assertStatus(res, 200);
        for (const group of res.body) MuscleGroupSchema.parse(group);
        assert.equal(res.body.length, 3);
    });

    test('GET por id; inexistente → 404', async () => {
        const res = await user.get(`/muscle-groups/${ctx.catalog.backId}`);
        assertStatus(res, 200);
        assert.equal(res.body.name, 'Espalda');
        assertStatus(await user.get('/muscle-groups/9999'), 404);
    });

    test('escribir: usuario común 403', async () => {
        assertStatus(await user.post('/muscle-groups', { name: 'Piernas', description: 'Cuádriceps e isquios' }), 403);
    });

    test('admin: crea, edita y borra; un grupo nuevo se puede usar enseguida (nota 89)', async () => {
        const created = await admin.post('/muscle-groups', { name: 'Piernas', description: 'Cuádriceps e isquios' });
        assertStatus(created, 201);
        const { id } = MuscleGroupSchema.parse(created.body);
        assert.equal(created.body.image, null);

        await createExercise(user, ctx.catalog, { name: 'Sentadilla búlgara', muscleGroupIds: [id], movementPattern: 'LEGS' });
        const filtered = await user.get(`/exercises?muscleGroupId=${id}`);
        assert.deepEqual(filtered.body.map((e: { name: string }) => e.name), ['Sentadilla búlgara']);

        assertStatus(await admin.patch(`/muscle-groups/${id}`, { image: 'piernas.png' }), 200);
        assertStatus(await admin.delete(`/muscle-groups/${id}`), 409);
    });

    test('admin: borra un grupo sin ejercicios', async () => {
        const created = await admin.post('/muscle-groups', { name: 'Antebrazos', description: 'Flexores y extensores' });
        assertStatus(await admin.delete(`/muscle-groups/${created.body.id}`), 204);
        assertStatus(await user.get(`/muscle-groups/${created.body.id}`), 404);
    });
});

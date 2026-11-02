import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { UserSchema } from '@waby/shared';
import { assertStatus, assertValidationError, registerData, setup, type TestContext } from './helpers.js';

let ctx: TestContext;
before(async () => { ctx = await setup(); });
after(() => ctx.close());

describe('salud', () => {
    test('GET /health responde sin sesión', async () => {
        const res = await ctx.anon().get('/health');
        assertStatus(res, 200);
        assert.deepEqual(res.body, { status: 'ok' });
    });
});

describe('auth', () => {
    test('registro: crea un USER, deja la cookie y no devuelve la contraseña', async () => {
        const client = ctx.anon();
        const res = await client.post('/auth/register', registerData('ana', ctx.catalog));
        assertStatus(res, 201);
        const user = UserSchema.strict().parse(res.body);
        assert.equal(user.role, 'USER');
        assert.deepEqual(user.trainingMethods, [{ id: ctx.catalog.calisthenicsId, name: 'Calistenia' }]);
        assert.match(res.setCookie ?? '', /token=.+HttpOnly/i);
    });

    test('registro: un segundo usuario sin teléfono también se registra (nota 51)', async () => {
        const res = await ctx.anon().post('/auth/register', registerData('beto', ctx.catalog));
        assertStatus(res, 201);
        assert.equal(res.body.phone, null);
    });

    test('registro: usuario o email repetido → 409', async () => {
        const repeatedUsername = await ctx.anon().post('/auth/register', { ...registerData('ana', ctx.catalog), email: 'otra@waby.test' });
        assertStatus(repeatedUsername, 409);
        const repeatedEmail = await ctx.anon().post('/auth/register', { ...registerData('ana2', ctx.catalog), email: 'ana@waby.test' });
        assertStatus(repeatedEmail, 409);
    });

    test('registro: mandar role no crea un admin (nota 17)', async () => {
        const res = await ctx.anon().post('/auth/register', { ...registerData('colado', ctx.catalog), role: 'ADMIN' });
        assertValidationError(res);
    });

    test('registro: datos inválidos → 400 con los campos', async () => {
        const res = await ctx.anon().post('/auth/register', {
            ...registerData('inval', ctx.catalog),
            email: 'no-es-mail',
            birthdate: '2999-01-01',
            password: 'corta',
        });
        assertValidationError(res, 'email', 'birthdate', 'password');
    });

    test('registro: método de entrenamiento inexistente → 400', async () => {
        const res = await ctx.anon().post('/auth/register', { ...registerData('sinmetodo', ctx.catalog), trainingMethodIds: [9999] });
        assertValidationError(res, 'trainingMethodIds');
    });

    test('login: credenciales correctas dejan la cookie', async () => {
        const client = ctx.anon();
        const res = await client.post('/auth/login', { username: 'ana', password: 'una-contraseña-segura' });
        assertStatus(res, 200);
        UserSchema.strict().parse(res.body);
        assert.ok(client.cookie);
    });

    test('login: contraseña incorrecta o usuario inexistente → 401', async () => {
        assertStatus(await ctx.anon().post('/auth/login', { username: 'ana', password: 'mal' }), 401);
        assertStatus(await ctx.anon().post('/auth/login', { username: 'nadie', password: 'mal' }), 401);
    });

    test('login: body vacío → 400 (nota 22)', async () => {
        assertValidationError(await ctx.anon().post('/auth/login', {}), 'username', 'password');
    });

    test('logout: borra la cookie y la sesión deja de valer', async () => {
        const client = await ctx.user('carla');
        assertStatus(await client.post('/auth/logout'), 204);
        assert.equal(client.cookie, null);
        assertStatus(await client.get('/users/me'), 401);
    });

    test('un token inválido → 401 y no ejecuta el controller (nota 10)', async () => {
        const client = ctx.anon();
        client.cookie = 'token=esto-no-es-un-jwt';
        assertStatus(await client.get('/users/me'), 401);
    });
});

describe('usuarios', () => {
    test('GET /users/me devuelve el usuario de la sesión', async () => {
        const client = await ctx.user('dani');
        const res = await client.get('/users/me');
        assertStatus(res, 200);
        assert.equal(UserSchema.strict().parse(res.body).username, 'dani');
    });

    test('sin sesión → 401', async () => {
        assertStatus(await ctx.anon().get('/users/me'), 401);
    });

    test('PATCH /users/me edita y hashea la contraseña nueva (nota 18)', async () => {
        const client = await ctx.user('edu');
        const res = await client.patch('/users/me', { name: 'Eduardo', bodyWeightKg: 80, password: 'contraseña-nueva-123' });
        assertStatus(res, 200);
        assert.equal(res.body.name, 'Eduardo');
        assert.equal(res.body.bodyWeightKg, 80);
        assert.equal(res.body.password, undefined);
        assertStatus(await ctx.anon().post('/auth/login', { username: 'edu', password: 'contraseña-nueva-123' }), 200);
        assertStatus(await ctx.anon().post('/auth/login', { username: 'edu', password: 'una-contraseña-segura' }), 401);
    });

    test('PATCH /users/me no deja cambiar el rol', async () => {
        const client = await ctx.user('fede');
        assertValidationError(await client.patch('/users/me', { role: 'ADMIN' }));
    });

    test('DELETE /users/me borra la cuenta y la sesión', async () => {
        const client = await ctx.user('gabi');
        assertStatus(await client.delete('/users/me'), 204);
        assertStatus(await client.get('/users/me'), 401);
        assertStatus(await ctx.anon().post('/auth/login', { username: 'gabi', password: 'una-contraseña-segura' }), 401);
    });

    test('GET /users: solo admin (nota 42)', async () => {
        const user = await ctx.user('hugo');
        assertStatus(await user.get('/users'), 403);
        const admin = await ctx.admin();
        const res = await admin.get('/users');
        assertStatus(res, 200);
        assert.ok(res.body.length >= 2);
        for (const item of res.body) UserSchema.strict().parse(item);
    });
});

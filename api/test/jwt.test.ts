/**
 * Test unitario de `verifySession` (#44): no levanta la API ni toca la base.
 * Cada caso es una forma de intentar colarse con un token que no emitió la API.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { env } from '../shared/env.js';
import { signSession, verifySession } from '../shared/jwt.js';

const OTHER_SECRET = 'otra-clave-que-no-es-la-de-la-api-0123456789';

/** Firma un token a mano, para armar los que `signSession` nunca emitiría. */
function forge(payload: object, secret: string = env.JWT_SECRET) {
    return jwt.sign(payload, secret);
}

/** Codifica una parte del JWT (header o payload) en base64url. */
function encodePart(part: object) {
    return Buffer.from(JSON.stringify(part)).toString('base64url');
}

describe('verifySession', () => {
    test('acepta un token emitido por la API y devuelve solo id y rol', () => {
        const token = signSession({ id: 1, role: 'USER' });

        assert.deepEqual(verifySession(token), { id: 1, role: 'USER' });
    });

    test('rechaza algo que no es un JWT', () => {
        assert.equal(verifySession('no-es-un-jwt'), null);
    });

    test('rechaza un token firmado con otra clave', () => {
        const token = forge({ id: 1, role: 'USER' }, OTHER_SECRET);

        assert.equal(verifySession(token), null);
    });

    test('rechaza un token vencido', () => {
        const anHourAgo = Math.floor(Date.now() / 1000) - 60 * 60;
        const token = forge({ id: 1, role: 'USER', exp: anHourAgo });

        assert.equal(verifySession(token), null);
    });

    test('rechaza un token al que le cambiaron el payload sin volver a firmar', () => {
        const [header, payload, signature] = signSession({ id: 1, role: 'USER' }).split('.');
        const original = JSON.parse(Buffer.from(payload, 'base64url').toString());
        const tampered = [header, encodePart({ ...original, role: 'ADMIN' }), signature].join('.');

        assert.equal(verifySession(tampered), null);
    });

    test('rechaza un token bien firmado pero con un payload que no es una sesión', () => {
        assert.equal(verifySession(forge({ id: 1, role: 'ROOT' })), null);
        assert.equal(verifySession(forge({ id: -1, role: 'USER' })), null);
    });

    test('rechaza un token sin firma (alg: none)', () => {
        const token = [encodePart({ alg: 'none', typ: 'JWT' }), encodePart({ id: 1, role: 'ADMIN' }), ''].join('.');

        assert.equal(verifySession(token), null);
    });
});

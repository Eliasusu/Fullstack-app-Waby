import jwt from 'jsonwebtoken';
import { RoleSchema, type Role } from '@waby/shared';
import { z } from 'zod';
import { env } from './env.js';

export type SessionPayload = { id: number; role: Role };

const PayloadSchema = z.object({ id: z.number().int().positive(), role: RoleSchema });

export const SESSION_MAX_AGE_MS = 60 * 60 * 1000;

export function signSession(payload: SessionPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: SESSION_MAX_AGE_MS / 1000 });
}

/** Devuelve el payload si el token es válido y no venció, o `null`. */
export function verifySession(token: string): SessionPayload | null {
    try {
        const parsed = PayloadSchema.safeParse(jwt.verify(token, env.JWT_SECRET));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
}

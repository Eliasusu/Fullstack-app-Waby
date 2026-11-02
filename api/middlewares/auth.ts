import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../shared/http.js';
import { SESSION_MAX_AGE_MS, signSession, verifySession, type SessionPayload } from '../shared/jwt.js';
import { env } from '../shared/env.js';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            /** Usuario de la sesión. Lo completa `requireAuth` (nota 40: la identidad no va en req.body). */
            auth?: SessionPayload;
        }
    }
}

const COOKIE = 'token';

export function setSessionCookie(res: Response, session: SessionPayload) {
    res.cookie(COOKIE, signSession(session), {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.isProd,
        maxAge: SESSION_MAX_AGE_MS,
    });
}

export function clearSessionCookie(res: Response) {
    res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: env.isProd });
}

/** Exige sesión válida (401). El rol sale del token, que dura 1 hora. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.[COOKIE];
    const session = token ? verifySession(token) : null;
    if (!session) return next(new HttpError(401, 'Sesión inválida o vencida'));
    req.auth = session;
    next();
}

/** Exige rol ADMIN (403). Va después de `requireAuth`. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
    if (req.auth?.role !== 'ADMIN') return next(new HttpError(403, 'Necesitás permisos de administrador'));
    next();
}

/** Id del usuario de la sesión. Solo en rutas con `requireAuth`. */
export function currentUserId(req: Request): number {
    if (!req.auth) throw new HttpError(401, 'Sesión inválida o vencida');
    return req.auth.id;
}

import type { Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { HttpError, parse } from '../shared/http.js';
import { clearSessionCookie, setSessionCookie } from '../middlewares/auth.js';
import { User } from '../users/user.entity.js';
import { toUserDto } from '../users/user.mapper.js';
import { assertUniqueCredentials, findTrainingMethods } from '../users/users.service.js';
import { hashPassword, verifyPassword } from './password.js';

export async function register(req: Request, res: Response) {
    const em = orm.em;
    const { trainingMethodIds, password, ...data } = parse(RegisterSchema, req.body);
    await assertUniqueCredentials(em, data);
    const trainingMethods = await findTrainingMethods(em, trainingMethodIds);

    const user = em.create(User, { ...data, phone: data.phone ?? null, password: await hashPassword(password), role: 'USER' });
    user.trainingMethods.set(trainingMethods);
    await em.flush();

    setSessionCookie(res, { id: user.id, role: user.role });
    res.status(201).json(toUserDto(user));
}

export async function login(req: Request, res: Response) {
    const em = orm.em;
    const { username, password } = parse(LoginSchema, req.body);
    const user = await em.findOne(User, { username }, { populate: ['trainingMethods'] });
    if (!user || !(await verifyPassword(password, user.password))) {
        throw new HttpError(401, 'Usuario o contraseña incorrectos');
    }
    setSessionCookie(res, { id: user.id, role: user.role });
    res.json(toUserDto(user));
}

export async function logout(_req: Request, res: Response) {
    clearSessionCookie(res);
    res.status(204).end();
}

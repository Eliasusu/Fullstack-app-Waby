import type { Request, Response } from 'express';
import { UpdateUserSchema } from '@waby/shared';
import { orm } from '../shared/db/orm.js';
import { notFound, parse } from '../shared/http.js';
import { clearSessionCookie, currentUserId } from '../middlewares/auth.js';
import { hashPassword } from '../auth/password.js';
import { User } from './user.entity.js';
import { toUserDto } from './user.mapper.js';
import { assertUniqueCredentials, findTrainingMethods } from './users.service.js';

async function findCurrentUser(req: Request) {
    const user = await orm.em.findOne(User, { id: currentUserId(req) }, { populate: ['trainingMethods'] });
    if (!user) throw notFound('El usuario ya no existe');
    return user;
}

export async function getMe(req: Request, res: Response) {
    res.json(toUserDto(await findCurrentUser(req)));
}

export async function updateMe(req: Request, res: Response) {
    const em = orm.em;
    const user = await findCurrentUser(req);
    const { trainingMethodIds, password, ...data } = parse(UpdateUserSchema, req.body);
    await assertUniqueCredentials(em, data, user.id);
    em.assign(user, data);
    if (password) user.password = await hashPassword(password);
    if (trainingMethodIds) user.trainingMethods.set(await findTrainingMethods(em, trainingMethodIds));
    await em.flush();
    res.json(toUserDto(user));
}

/** Borra la cuenta y, por las claves foráneas en cascada, todos sus datos. */
export async function deleteMe(req: Request, res: Response) {
    await orm.em.nativeDelete(User, { id: currentUserId(req) });
    clearSessionCookie(res);
    res.status(204).end();
}

export async function getAll(_req: Request, res: Response) {
    const users = await orm.em.find(User, {}, { populate: ['trainingMethods'], orderBy: { id: 'asc' } });
    res.json(users.map(toUserDto));
}

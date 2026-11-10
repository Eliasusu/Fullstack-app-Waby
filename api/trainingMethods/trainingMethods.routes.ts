import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';
import { create, getAll, getOne, remove, update } from './trainingMethods.controllers.js';

/** Lectura pública (la usa el registro); escritura solo admin. */
export const trainingMethodsRouter = Router();

trainingMethodsRouter.get('/', asyncHandler(getAll));
trainingMethodsRouter.get('/:id', asyncHandler(getOne));
trainingMethodsRouter.post('/', requireAuth, requireAdmin, asyncHandler(create));
trainingMethodsRouter.patch('/:id', requireAuth, requireAdmin, asyncHandler(update));
trainingMethodsRouter.delete('/:id', requireAuth, requireAdmin, asyncHandler(remove));

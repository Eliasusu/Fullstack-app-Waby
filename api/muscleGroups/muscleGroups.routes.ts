import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { requireAdmin } from '../middlewares/auth.js';
import { create, getAll, getOne, remove, update } from './muscleGroups.controllers.js';

/** Montado con `requireAuth`. Escritura solo admin. */
export const muscleGroupsRouter = Router();

muscleGroupsRouter.get('/', asyncHandler(getAll));
muscleGroupsRouter.get('/:id', asyncHandler(getOne));
muscleGroupsRouter.post('/', requireAdmin, asyncHandler(create));
muscleGroupsRouter.patch('/:id', requireAdmin, asyncHandler(update));
muscleGroupsRouter.delete('/:id', requireAdmin, asyncHandler(remove));

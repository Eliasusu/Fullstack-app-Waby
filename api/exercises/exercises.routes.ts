import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { progressionsRouter } from '../progressions/progressions.routes.js';
import { create, getAll, getOne, remove, update } from './exercises.controllers.js';

/** Montado con `requireAuth`. Cada usuario ve y modifica solo sus ejercicios. */
export const exercisesRouter = Router();

exercisesRouter.get('/', asyncHandler(getAll));
exercisesRouter.get('/:id', asyncHandler(getOne));
exercisesRouter.post('/', asyncHandler(create));
exercisesRouter.patch('/:id', asyncHandler(update));
exercisesRouter.delete('/:id', asyncHandler(remove));
exercisesRouter.use('/:id/progressions', progressionsRouter);

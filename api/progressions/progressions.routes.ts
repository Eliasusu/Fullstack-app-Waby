import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { create, getAll, remove, update } from './progressions.controllers.js';

/** Montado en `/exercises/:id/progressions` (hereda `requireAuth` y el `:id` del Ejercicio). */
export const progressionsRouter = Router({ mergeParams: true });

progressionsRouter.get('/', asyncHandler(getAll));
progressionsRouter.post('/', asyncHandler(create));
progressionsRouter.patch('/:progressionId', asyncHandler(update));
progressionsRouter.delete('/:progressionId', asyncHandler(remove));

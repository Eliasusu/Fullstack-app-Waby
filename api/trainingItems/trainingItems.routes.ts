import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { create, remove, update } from './trainingItems.controllers.js';

/** Montado en `/trainings/:id/items` (hereda `requireAuth` y el `:id` del Entrenamiento). */
export const trainingItemsRouter = Router({ mergeParams: true });

trainingItemsRouter.post('/', asyncHandler(create));
trainingItemsRouter.patch('/:itemId', asyncHandler(update));
trainingItemsRouter.delete('/:itemId', asyncHandler(remove));

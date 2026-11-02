import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { trainingItemsRouter } from '../trainingItems/trainingItems.routes.js';
import { create, getAll, getOne, remove, update } from './trainings.controllers.js';

/** Montado con `requireAuth`. */
export const trainingsRouter = Router();

trainingsRouter.get('/', asyncHandler(getAll));
trainingsRouter.get('/:id', asyncHandler(getOne));
trainingsRouter.post('/', asyncHandler(create));
trainingsRouter.patch('/:id', asyncHandler(update));
trainingsRouter.delete('/:id', asyncHandler(remove));
trainingsRouter.use('/:id/items', trainingItemsRouter);

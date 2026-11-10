import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { create, getAll, getOne, getTrainings, remove, update } from './mesocycles.controllers.js';

/** Montado con `requireAuth`. */
export const mesocyclesRouter = Router();

mesocyclesRouter.get('/', asyncHandler(getAll));
mesocyclesRouter.get('/:id', asyncHandler(getOne));
mesocyclesRouter.get('/:id/trainings', asyncHandler(getTrainings));
mesocyclesRouter.post('/', asyncHandler(create));
mesocyclesRouter.patch('/:id', asyncHandler(update));
mesocyclesRouter.delete('/:id', asyncHandler(remove));

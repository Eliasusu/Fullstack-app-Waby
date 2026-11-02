import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { create, getAll, getOne, remove, update } from './goals.controllers.js';

/** Montado con `requireAuth`. */
export const goalsRouter = Router();

goalsRouter.get('/', asyncHandler(getAll));
goalsRouter.get('/:id', asyncHandler(getOne));
goalsRouter.post('/', asyncHandler(create));
goalsRouter.patch('/:id', asyncHandler(update));
goalsRouter.delete('/:id', asyncHandler(remove));

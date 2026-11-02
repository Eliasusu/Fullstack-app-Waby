import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { requireAdmin } from '../middlewares/auth.js';
import { deleteMe, getAll, getMe, updateMe } from './users.controllers.js';

/** Montado con `requireAuth`. */
export const usersRouter = Router();

usersRouter.get('/me', asyncHandler(getMe));
usersRouter.patch('/me', asyncHandler(updateMe));
usersRouter.delete('/me', asyncHandler(deleteMe));
usersRouter.get('/', requireAdmin, asyncHandler(getAll));

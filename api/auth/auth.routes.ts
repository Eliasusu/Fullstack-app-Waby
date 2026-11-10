import { Router } from 'express';
import { asyncHandler } from '../shared/http.js';
import { login, logout, register } from './auth.controllers.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/logout', asyncHandler(logout));

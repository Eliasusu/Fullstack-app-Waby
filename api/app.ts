import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import { RequestContext } from '@mikro-orm/core';
import { orm } from './shared/db/orm.js';
import { errorHandler } from './shared/http.js';
import { corsMiddleware } from './middlewares/cors.js';
import { requireAuth } from './middlewares/auth.js';
import { authRouter } from './auth/auth.routes.js';
import { usersRouter } from './users/users.routes.js';
import { trainingMethodsRouter } from './trainingMethods/trainingMethods.routes.js';
import { muscleGroupsRouter } from './muscleGroups/muscleGroups.routes.js';
import { exercisesRouter } from './exercises/exercises.routes.js';
import { mesocyclesRouter } from './mesocycles/mesocycles.routes.js';
import { trainingsRouter } from './trainings/trainings.routes.js';
import { goalsRouter } from './goals/goals.routes.js';

/**
 * Arma la app de Express sin abrir el puerto ni tocar el esquema (nota 31),
 * así los tests la pueden levantar contra la base de test.
 */
export function createApp(): Express {
    const app = express();
    app.disable('x-powered-by');
    app.use(corsMiddleware());
    app.use(cookieParser());
    app.use(express.json());
    app.use((_req, _res, next) => RequestContext.create(orm.em, next));

    const api = express.Router();
    api.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    api.use('/auth', authRouter);
    api.use('/training-methods', trainingMethodsRouter);
    api.use('/users', requireAuth, usersRouter);
    api.use('/muscle-groups', requireAuth, muscleGroupsRouter);
    api.use('/exercises', requireAuth, exercisesRouter);
    api.use('/mesocycles', requireAuth, mesocyclesRouter);
    api.use('/trainings', requireAuth, trainingsRouter);
    api.use('/goals', requireAuth, goalsRouter);
    api.use((_req, res) => {
        res.status(404).json({ message: 'Ruta inexistente' });
    });

    app.use('/api/v1', api);
    app.use(errorHandler);
    return app;
}

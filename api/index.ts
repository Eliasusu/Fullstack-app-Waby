import 'reflect-metadata';
import express from 'express';
import process from 'process';
import { orm, syncSchema } from './shared/db/orm.js';
import { usersRouter } from "./users/users.routes.js";
import { exercisesRouter } from "./exercises/exercises.routes.js";
import { corsMiddleware } from './middlewares/cors.js';
import { muscleGroupsRouter } from './muscleGroups/muscleGroups.routes.js';
import { trainingsRouter } from './trainings/trainings.routes.js';
//import { indexRouter } from './routes/index.routes.js';
import { authRouter } from './auth/auth.routes.js';
import { routinesRouter } from './exercises_trainings/exercises_trainings.routes.js';
import { mesocyclesRouter } from './mesocycles/mesocycles.routes.js';
import { RequestContext } from '@mikro-orm/core';



// eslint-disable-next-line no-undef
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
app.disable('x-powered-by');
app.use(corsMiddleware());

app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});

app.use('/api/v1/', authRouter);
app.use('/api/v1/users', usersRouter);
//app.use('/index', indexRouter);
//app.use('/api/v1/exercises', exercisesRouter);
//app.use('/api/v1/trainings', trainingsRouter);
//app.use('/routines', routinesRouter);
//app.use('/api/v1/muscleGroups', muscleGroupsRouter);
//app.use('/api/v1/mesocycles', mesocyclesRouter);

await syncSchema() //This will create the schema in the database if it doesn't exist yet, no need to run this in production;
app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
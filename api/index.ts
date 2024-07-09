import express from 'express';
import process from 'process';
import { usersRouter } from "./routes/users.routes.js";
import { exercisesRouter } from "./routes/exercises.routes.js";
import { corsMiddleware } from './middlewares/cors.js';
import { muscleGroupsRouter } from './routes/muscleGroups.routes.js';
import { trainingsRouter } from './routes/trainings.routes.js';
//import { indexRouter } from './routes/index.routes.mjs';
//import { authRouter } from './routes/auth.routes.mjs';
//import { routinesRouter } from './routes/routines.routes.mjs';
//import { muscleGroupsRouter } from './routes/muscleGroups.routes.mjs';
//import { mesocyclesRouter } from './routes/mesocycles.routes.mjs';



// eslint-disable-next-line no-undef
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use(corsMiddleware());

app.use('/api/v1/exercises', exercisesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/trainings', trainingsRouter);
//app.use('/index', indexRouter);
//app.use('/auth', authRouter);
//app.use('/routines', routinesRouter);
app.use('/api/v1/muscleGroups', muscleGroupsRouter);
//app.use('/mesocycles', mesocyclesRouter);


app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
import express from 'express';
import process from 'process';
import { usersRouter } from "./routes/users.routes.mjs";
import { exercisesRouter } from "./routes/exercises.routes.mjs";
import { corsMiddleware } from './middlewares/cors.mjs';
//import { trainingsRouter } from './routes/trainings.routes.mjs';
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

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
//app.use('/trainings', trainingsRouter);
//app.use('/index', indexRouter);
//app.use('/auth', authRouter);
//app.use('/routines', routinesRouter);
//app.use('/muscleGroups', muscleGroupsRouter);
//app.use('/mesocycles', mesocyclesRouter);


app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
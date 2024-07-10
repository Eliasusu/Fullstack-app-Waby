import express from 'express';
import process from 'process';
import { usersRouter } from "./routes/users.routes.js";
import { exercisesRouter } from "./routes/exercises.routes.js";
import { corsMiddleware } from './middlewares/cors.js';
import { muscleGroupsRouter } from './routes/muscleGroups.routes.js';
import { trainingsRouter } from './routes/trainings.routes.js';
<<<<<<< HEAD
//import { indexRouter } from './routes/index.routes.mjs';
//import { authRouter } from './routes/auth.routes.mjs';
import { routinesRouter } from './routes/routines.routes.js';
//import { muscleGroupsRouter } from './routes/muscleGroups.routes.mjs';
=======
//import { indexRouter } from './routes/index.routes.js';
import { authRouter } from './routes/auth.routes.js';
//import { routinesRouter } from './routes/routines.routes.js';
//import { muscleGroupsRouter } from './routes/muscleGroups.routes.js';
>>>>>>> origin/feature/Elias_dia3
import { mesocyclesRouter } from './routes/mesocycles.routes.js';



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
<<<<<<< HEAD
//app.use('/auth', authRouter);
app.use('/api/v1/routines', routinesRouter);
=======
app.use('/api/v1/', authRouter);
//app.use('/routines', routinesRouter);
>>>>>>> origin/feature/Elias_dia3
app.use('/api/v1/muscleGroups', muscleGroupsRouter);
app.use('/api/v1/mesocycles', mesocyclesRouter);


app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
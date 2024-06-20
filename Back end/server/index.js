import express from 'express';
import process from 'process';
import { usersRouter } from "../routes/users.mjs";
import { corsMiddleware } from '../middleware/cors.mjs';


// eslint-disable-next-line no-undef
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use(corsMiddleware());
app.use('/api/v1/users',usersRouter);


app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
import cors from 'cors';
import { env } from '../shared/env.js';

/** Solo los orígenes de `CORS_ORIGINS` pueden llamar a la API con credenciales (nota 08, #21). */
export const corsMiddleware = () =>
    cors({
        origin: (origin, callback) => {
            if (!origin || env.CORS_ORIGINS.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });

import cors from 'cors'

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000', 
            'http://localhost:3001',
            'http://localhost:5173',
        ]
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
    }
});
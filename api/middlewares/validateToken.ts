import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { KEY } from '../shared/config.js';

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, KEY, (err: any, decoded: any) => {
            if (err) return res.status(401).json({ error: 'Invalid token' });
            return decoded;
        });
        req.body.user = decoded;
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    console.log('Validating token');
    next();
};
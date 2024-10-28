import { KEY } from "./config.js";
import jwt from 'jsonwebtoken';

export function createToken(payload: any) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) reject(err);
            resolve (token);
        })
    });
}
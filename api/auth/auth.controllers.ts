import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { validateUser, validateParcialUser } from "../users/users.schema.js";
import { User } from "../users/user.entity.js";
import { orm } from "../shared/db/orm.js";
import { createToken } from "../shared/jwt.js";
import jwt from 'jsonwebtoken';
import { KEY } from "../shared/config.js";

const em = orm.em;

//Register user === Add user === Create user 
async function register(req: Request, res: Response) { 
    try {
        const trainingMethods = [req.body.trainingMethods];
        console.log(trainingMethods);
        const height = Number(req.body.height);
        const bodyWeight = Number(req.body.bodyWeight);
        const user = { ...req.body, height, bodyWeight, trainingMethods };
        const result = validateUser(user);
        if (result.error) return res.status(400).json(result.error.issues.map((issue: any) => issue.message));
        if (result.success) {
            if (await em.findOne(User, { username: req.body.username })) {
                return res.status(400).json({ error: ['Username already exists'] });
            }
            if (await em.findOne(User, { email: req.body.email })) {
                return res.status(400).json({ error: ['Email already exists'] });
            }
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            const user = em.create(User, req.body);
            await em.persistAndFlush(user);
            const token = await createToken({ id: user.idUser, username: user.username });
            res.cookie('token', token, { httpOnly: false, sameSite: 'none', secure: true });
            const userName = user.username;
            res.status(201).json([userName]);
        } else {
            res.status(400).json({ error: 'User not created' });
        }
    } catch (error: any) {
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error creating user' });
    }
}

//Login user
async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const user = await em.findOne(User, { username }, { populate: ['password'] });
        if (!user) return res.status(400).json(['Username incorrect']);
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json( ['Password incorrect']);
        const token = await createToken({ id: user.idUser, username: user.username });
        res.cookie('token', token, { httpOnly: false, sameSite: 'none', secure: true});
        const userName = user.username;
        res.status(200).json([userName]);
    } catch (error: any) { 
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error loging in' });
    }
}

async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out succesfully' });
    } catch (error: any) {
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error logging out' });
    }
}

async function profile(req: Request, res: Response) {
    try {
        const idUser = req.body.user.id;
        const user = await em.findOneOrFail(User, { idUser }, { populate: ['password'] });
        if (!user) return res.status(400).json({ error: 'User not found' });
        res.status(200).json({ message: 'User profile', id: idUser, username: user.username, email: user.email });
    } catch (error: any) {
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error in protected route' });
    }
}

async function verifyToken(req: Request, res: Response) {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const payload = jwt.verify(token, KEY, (err: any, payload: any) => {
            if (err) return res.status(401).json({ error: 'Invalid token' });
            const userFound = em.findOne(User, { idUser: payload.id });
            if (!userFound) return res.status(401).json({ error: 'User not found' });
            return res.status(200).json({ id: payload.id, username: payload.username });
        });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
}

export  { register, login, logout, profile, verifyToken }

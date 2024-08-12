import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { KEY } from "../shared/config.js";
import { validateUser, validateParcialUser } from "../users/users.schema.js";
import { User } from "../users/user.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

//Register user === Add user === Create user 
async function register(req: Request, res: Response) { 
    try {
        const result = validateUser(req.body);
        if (result.error) return res.status(400).json(result.error);
        if (result.success) {
            if (await em.findOne(User, { username: req.body.username })) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            if (await em.findOne(User, { email: req.body.email })) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            const user = em.create(User, req.body); 
            await em.persistAndFlush(user);
            res.status(201).json({ message: 'User created succesfully' });
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
        if (!user) return res.status(400).json({ error: 'Username incorrect' });
        const token = jwt.sign({ user: user.idUser, username: user.username }, KEY, {
            expiresIn: '1h'
        });
        res.cookie('token', token, { httpOnly: true });
        if (user.password !== password) return res.status(400).json({ error: 'Password incorrect' });
        res.status(200).json({ message: 'User logged in succesfully' });
    } catch (error: any) { 
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error loging in' });
    }
}

export  { register, login }

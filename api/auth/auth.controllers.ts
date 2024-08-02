import { Request, Response } from "express";
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
        const { username, email, password } = req.body;
        const user = await em.findOne(User, { username, email });
        if (!user) return res.status(400).json({ error: 'Username, email or password incorrect' });
        if (user.password !== password) return res.status(400).json({ error: 'Username, email or password incorrect' });
        res.status(200).json({ message: 'User logged in succesfully' });
    } catch (error: any) { 
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error loging in' });
    }
}

export  { register, login }

import { Request, Response } from "express";
import { validateUser, validateParcialUser } from "../users/users.schema.js";
import { User } from "../users/user.entity.js";

//Register user === Add user === Create user 
async function register(req: Request, res: Response) { 
    res.status(500).json({ message: 'Not implemented' });
}

//Login user
async function login(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export  { register, login }

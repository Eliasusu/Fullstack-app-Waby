import { Request, Response } from "express";
import { validateUser, validateParcialUser } from "../schemas/users.schema.js";
import { UserRepository } from "../repository/users.repository.js";
import { User } from "../entity/user.entity.js";

const repository = new UserRepository();

//Register user === Add user === Create user 
async function register(req: Request, res: Response) { 
    const result = validateUser(req.body);
    console.log(req.body)
    if(result.success){
        const newUser = new User(
            result.data.username,
            result.data.password,
            result.data.email,
            result.data.name,
            result.data.birthdate,
            result.data.phone,
            result.data.bodyWeight,
            result.data.height,
        );

    try {
        console.log('Entre al try del auth.routes')
        const user = await repository.add(newUser);
        console.log('Despues del add del repository')
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        res.json({error: 'Error creating user'});
    } 
    } else {
        res.status(400).json(result.error);
    }
}

//Login user
async function login(req: Request, res: Response) {
    const { username, password, email } = req.body;
    const result = validateParcialUser(req.body);
    
    if(result.success){
        try {
            const user = await repository.getOne({username: username});
            if(user && user.password === password){
                res.status(200).json(user);
            } else {
                res.status(401).json({error: 'Invalid credentials'});
            }
            if(user && user.email === email && user.password === password){
                res.status(200).json(user);
            } else {
                res.status(401).json({error: 'Invalid credentials'});
            }
        } catch (error) {
            res.status(500).json({error: 'Error getting user'});
        }
    } else {
        res.status(400).json(result.error);
    }
}

export  { register, login }

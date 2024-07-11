import { Router } from "express";
import { validateUser, validateParcialUser } from "../schemas/users.schema.js";
import { UserRepository } from "../repository/users.repository.js";
import { User } from "../entity/user.entity.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";

export const authRouter = Router();
const repository = new UserRepository();

//Register user 
authRouter.post('/register', async (req, res) => {
    const result = validateUser(req.body);
    
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
        res.status(200).json(user);
    } catch (error) {
        res.json({error: 'Error creating user'});
    } 
    } else {
        res.status(400).json(result.error);
    }
});


//Login user 
authRouter.post('/login', async (req, res) => {
    console.log('Entre al login')
    const { username, password, email } = req.body;
    const result = validateParcialUser(req.body);
    console.log(result)
    
    if(result.success){
        try {
            const user = await repository.getOne({username: username});
            console.log(user)
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
});


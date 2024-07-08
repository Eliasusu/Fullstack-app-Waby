import { Router } from "express";
import { validateUser, validateParcialUser } from '../schemas/users.schema.js';
import { generateId } from '../shared/generateId.js';
import { UserRepository } from "../repository/users.repository.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";
import { PassThrough } from "stream";
import { User } from "../entity/user.entity.js";


export const usersRouter = Router();
const repository = new UserRepository();
console.log('Entre PAPU')

//Get de todos los user
usersRouter.get('/', async (req, res) => {
    console.log('Entre PAPU2')
    const users = await repository.getAll();
    res.status(200).json(users);
});

//Get de un user en particular
usersRouter.get('/:idUser', async (req, res) => {
    
    const { idUser } = req.params;
    const user = await repository.getOne({id: idUser});
    if (user) return res.json(user);
    res.status(404).json({ error: 'User not found'});
});

//Post de un user
usersRouter.post('/', async  (req, res) => {
    const result = validateUser(req.body);

    if(result.success){ 
        //Esto se hace en base de datos
        const exerciseInput = new User(
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.name,
            new Date(req.body.birthdate),
            req.body.phone,
            req.body.bodyWeight,
            req.body.height,
            new TrainingMethod(
                req.body.trainingMethod.name,
                req.body.trainingMethod.description
            )
        );
        const newExercise = await repository.add(exerciseInput);
        if (newExercise) return res.status(201).json(newExercise);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un user
usersRouter.put('/:idUser', async (req, res) => {
    const { idUser } = req.params;
    const user = await repository.getOne({id: idUser});
    if (user) {
    if (user) {
        const result = validateParcialUser(req.body);
        if(result.success){
            const updatedUser = await repository.update({
                ...user,
                ...req.body
            });
            if (updatedUser) return res.json(updatedUser);
            const updatedUser = await repository.update({
                ...user,
                ...req.body
            });
            if (updatedUser) return res.json(updatedUser);
        } else{
            res.status(400).json({ error: result.error });
        }
    }
});

//Delete de un user
usersRouter.delete('/:name', async (req, res) => {
    console.log('Entre al delete')
    const { name } = req.params;
    console.log(name)
    const user = await repository.delete({name: name});
    console.log(user)
    if (user) return res.status(200).json(user);  
    res.status(404).json({ error: 'User not found' });
}); 

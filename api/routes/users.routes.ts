import { Router } from "express";
import { validateUser, validateParcialUser } from '../schemas/users.schema.js';
import { generateId } from '../shared/generateId.js';
import { UserRepository } from "../repository/users.repository.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";


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
    const { birthdate, trainingMethod, ...rest } = req.body;
    const parsedBirthdate = new Date(birthdate);
    const parsedMethod = new TrainingMethod(trainingMethod);
    const result = validateUser({ ...rest, birthdate: parsedBirthdate });

    if(result.success){
        //Esto se hace en base de datos
        const user = result.data;
        user.idUser = generateId();
        const newUser = await repository.add(user);
        res.status(201).json(user);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un user
usersRouter.put('/:idUser', async (req, res) => {
    const { idUser } = req.params;
    const user = await repository.getOne({id: idUser});
    if (user) {
        const result = validateParcialUser(req.body);
        if(result.success){
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

});

//Delete de un user
usersRouter.delete('/:name', async (req, res) => {
    const { name } = req.params;
    const user = await repository.delete({name: name});
    if (user === user) return res.status(200).json(user);  
    res.status(404).json({ error: 'User not found' });
}); 

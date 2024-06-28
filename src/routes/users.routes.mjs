import { Router } from "express";
import users from '../datos temporales/wabys.json' assert { type: "json" };
import { validateUser, validateParcialUser } from '../schemas/users.schema.mjs';
import { generateId } from '../lib/generateId.js';


export const usersRouter = Router();
console.log('Entre PAPU')

//Get de todos los user
usersRouter.get('/', (req, res) => {
    res.json(users);
});

//Get de un user en particular
usersRouter.get('/:idUser', (req, res) => {
    
    const { idUser } = req.params;
    console.log(idUser);
    const user = users.find((w) => w.idUser === idUser);
    console.log(user);
    if (user){
        res.status(201).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

//Post de un user
usersRouter.post('/', (req, res) => {
    const result = validateUser(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const user = result.data;
        user.idUser = generateId();
        users.push(user);
        res.status(201).json(user);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un user
usersRouter.put('/:idUser',  (req, res) => {
    const { idUser } = req.params;
    const user = users.find((w) => w.idUser === idUser);
    if (user) {
        const result = validateParcialUser(req.body);

        if(result.success){
            //Esto se hace en base de datos
            const data = result.data;
            Object.assign(user, data);
            res.status(200).json(user);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }

});

//Delete de un user
usersRouter.delete('/:name', (req, res) => {
    const { name } = req.params;
    const index = users.findIndex((w) => w.name === name);
    console.log(index);
    if (index !== -1) {
        //Esto se hace en base de datos
        users.splice(index, 1);
        res.status(204).end().json({ message: 'User deleted' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

import { Router } from "express";
import users from '../server/db/wabys.json' with { type: 'json' };
import { validateUser, validateParcialUser } from '../schemas/users.mjs';

export const usersRouter = Router();


//Get de todos los user
usersRouter.get('/', (req, res) => {
    res.json(users);
});

//Get de un user en particular
usersRouter.get('/:id', (req, res) => {
    
    const { id } = req.params;
    const user = users.find((w) => w.id === id);
    if (user){
        res.json(user);
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
        user.id = (users.length + 1).toString();
        users.push(user);
        res.status(201).json(user);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un user
usersRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const user = users.find((w) => w.id === id);
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
usersRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = users.findIndex((w) => w.id === id);
    if (index !== -1) {
        //Esto se hace en base de datos 
        users.splice(index, 1);
        res.status(204).json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

import { Router } from "express";
import users from '../datos temporales/wabys.json' assert { type: "json" };
import { validateUser, validateParcialUser } from '../schemas/users.schema.mjs';

export const usersRouter = Router();
console.log('Entre PAPU')

//Get de todos los user
usersRouter.get('/', (req, res) => {
    res.json(users);
});

//Get de un user en particular
usersRouter.get('/:id', (req, res) => {
    
    const { idUser } = req.params;
    const user = users.find((w) => w.id === idUser);
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
        user.idUser = (users.length + 1).toString();
        users.push(user);
        res.status(201).json(user);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un user
usersRouter.put('/:id',  (req, res) => {
    const { idUser } = req.params;
    const user = users.find((w) => w.id === idUser);
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
    const { idUser } = req.params;
    const index = users.findIndex((w) => w.id === idUser);
    if (index !== -1) {
        //Esto se hace en base de datos 
        users.splice(index, 1);
        res.status(204).json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

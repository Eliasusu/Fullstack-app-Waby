import { Request, Response } from "express";
import { validateParcialUser } from "./users.schema.js";
import { orm } from "../shared/db/orm.js";
import { User } from "./user.entity.js";


const em = orm.em;


//Get all users
async function getAll (req: Request, res:Response) { 
    try{
        const users = await em.find(User, {}); // El segundo parametro son los filtros
        res.status(200).json({ message: 'Finded all users succesfully', data: users });
    } catch (error: any) {
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error getting users' }); 
    }
};

//Get one user by id
async function getOne(req: Request, res: Response) {
    const { idUser } = req.params;
    try{
        const user = await em.findOneOrFail(User, { idUser }); // El segundo parametro son los filtros
        res.status(200).json({ message: 'Find user succesfully', data: user });
    } catch (error: any) {
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error getting user' }); 
    }
};

//Update a user
async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
    // try {
    //     const { idUser } = req.params;
    //     const userFind = await em.findOne(User, { idUser });
    //     if (userFind !== undefined) {
    //         const result = validateParcialUser(req.body);
    //         if (result.error) return res.status(400).json(result.error);
    //         if (result.success) {
    //             const user = em.getReference(User, idUser);
    //             em.assign(user, result.data);
    //             await em.flush();
    //             res.status(202).json({ message: 'User updated succesfully' });
    //         } else {
    //             res.status(400).json({ error: 'User not updated' });
    //         }
    //     } else {
    //         res.status(404).json({ error: 'User not found' });
    //     }
    // } catch (error: any) { 
    //     console.log(error); // --> Eliminar en produccion
    //     res.status(500).json({ error: 'Error updating user' }); 
    // }
};

//Delete a user
async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
    // try {
    //     const { idUser } = req.params;
    //     const user = em.getReference(User, idUser);
    //     em.removeAndFlush(user);
    //     return res.status(200).json(user);
    // } catch (error: any) { 
    //     console.log(error); // --> Eliminar en produccion
    //     res.status(500).json({ error: 'Error deleting user' }); 
    // }
};

export { getAll, getOne, update, remove}
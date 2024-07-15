import { Request, Response } from "express";
import { validateUser, validateParcialUser } from "../schemas/users.schema.js";
import { UserRepository } from "../repository/users.repository.js";
import { User } from "../entity/user.entity.js";

const repository = new UserRepository();

//Get all users
async function getAll (req: Request, res:Response) { 
    const users = await repository.getAll();
    res.status(200).json(users);
};

//Get one user by id
async function getOne(req: Request, res: Response) {
    const { idUser } = req.params;
    const user = await repository.getOne({id: idUser});
    if (user) return res.json(user);
    res.status(404).json({ error: 'User not found'});
};

//Update a user
async function update (req: Request, res: Response) {
    const { idUser } = req.params;
    const user = await repository.getOne({id: idUser});
    if (user) {
        const result = validateParcialUser(req.body);
        if(result.success){
            const updatedUser = await repository.update({
                ...user,
                ...req.body
            });
            if (updatedUser) return res.status(202).json(updatedUser);
        } else{
            res.status(400).json({ error: 'User not updated' });
        }
    }
}

//Delete a user
async function remove(req: Request, res: Response) {
    const { idUser } = req.params;
    console.log(idUser)
    const user = await repository.delete({id: idUser});
    console.log(user)
    if (user) return res.status(200).json(user);  
    res.status(404).json({ error: 'User not found' })
};

export { getAll, getOne, update, remove}
import { Router } from "express";
import { getAll, getOne, update, remove } from "../controllers/users.controllers.js";

export const usersRouter = Router();

console.log('Entre PAPU')

//Get all users
usersRouter.get('/', getAll);

//Get one user by id
usersRouter.get('/:idUser', getOne);

//Update a user
usersRouter.put('/:idUser', update);

//Delete a user
usersRouter.delete('/:idUser', remove); 

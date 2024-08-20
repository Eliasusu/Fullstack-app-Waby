import { Router } from "express";
import { getAll, getOne, add, update, remove } from "./trainings.controllers.js";

export const trainingsRouter = Router();

//Get all trainings by user
trainingsRouter.get('/user/:idUser', getAll);

//Get one training by id
trainingsRouter.get('/:idTraining/user/:idUser', getOne);

//Create a new training
trainingsRouter.post('/', add);

//Update a training
trainingsRouter.put('/:idTraining/user/:idUser', update);

//Delete a training
trainingsRouter.delete('/:idTraining/user/:idUser', remove);



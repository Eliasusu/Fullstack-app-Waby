import { Router } from "express";
import { getAll, getOne, add, update, remove } from "../controllers/trainings.controllers.js";

export const trainingsRouter = Router();

//Get all trainings by user
trainingsRouter.get('/user/:idUser', getAll);

//Get one training by id
trainingsRouter.get('/:idTraining/user/:idUser', getOne);

//Create a new training
trainingsRouter.post('/', add);

//Update a training
trainingsRouter.put('/:idTraining', update);

//Delete a training
trainingsRouter.delete('/:idTraining', remove);



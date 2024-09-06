import { Router } from "express";
import { getAll, getOne, add, update, remove, getToday } from "./trainings.controllers.js";
import { add as addExerciseTraining } from "../exercises_trainings/exercises_trainings.controllers.js";


export const trainingsRouter = Router();

//Get all trainings by user
trainingsRouter.get('/user', getAll);

// Get today's training
trainingsRouter.get('/today/user', getToday);

//Get one training by id
trainingsRouter.get('/:idTraining/user', getOne);


//Create a new training
trainingsRouter.post('/', add);

trainingsRouter.post('/:idTraining/exercise', addExerciseTraining);

//Update a training
trainingsRouter.put('/:idTraining/user/:idUser', update);

//Delete a training
trainingsRouter.delete('/:idTraining/user/:idUser', remove);




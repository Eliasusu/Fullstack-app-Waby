import { Router } from "express";
import { getAll, getOne, add, update, remove} from "./trainings.controllers.js";
import { add as addExerciseTraining } from "../trainingItems/trainingItems.controllers.js";


export const trainingsRouter = Router();

//Get all trainings by user
trainingsRouter.get('/user', getAll);

//Get one training by id
trainingsRouter.get('/:date/user', getOne);

//Create a new training
trainingsRouter.post('/', add);

trainingsRouter.post('/:idTraining/exercise', addExerciseTraining);

//Update a training
trainingsRouter.put('/:idTraining/user', update);

//Delete a training
trainingsRouter.delete('/:idTraining/user', remove);




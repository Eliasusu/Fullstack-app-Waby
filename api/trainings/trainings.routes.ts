import { Router } from "express";
import { getAll, getOne, add, update, remove} from "./trainings.controllers.js";
import { add as addExerciseTraining, remove as removeTrainingItem, update as updateTrainingItem} from "../trainingItems/trainingItems.controllers.js";


export const trainingsRouter = Router();

//Get all trainings by user
trainingsRouter.get('/user', getAll);

//Get one training by date
trainingsRouter.get('/:date/user', getOne);

//Create a new training
trainingsRouter.post('/', add);

trainingsRouter.post('/:idTraining/trainingItem', addExerciseTraining);

//Update a training
trainingsRouter.put('/:idTraining/user', update);

trainingsRouter.put('/:idTraining/trainingItem/:idTrainingItem', updateTrainingItem);

//Delete a training
trainingsRouter.delete('/:idTraining/user', remove);

trainingsRouter.delete('/:idTraining/trainingItem/:idTrainingItem', removeTrainingItem);




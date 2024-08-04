import { Router } from "express";
import { getAll, getOne, update, remove, add } from "./trainingMethod.controller.js";

export const trainingMethodsRouter = Router();

//Get all training methods
trainingMethodsRouter.get('/', getAll);

//Get one training method by id
trainingMethodsRouter.get('/:idMethod', getOne);

//Add a training method
trainingMethodsRouter.post('/', add);

//Update a training method
trainingMethodsRouter.put('/:idMethod', update);

//Delete a training method
trainingMethodsRouter.delete('/:idMethod', remove);
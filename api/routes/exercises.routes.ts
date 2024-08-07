import { Router } from "express";
import { getAll, getOne, create, update, remove } from "../controllers/exercises.controllers.js";

export const exercisesRouter = Router();

//Get all exercises
exercisesRouter.get('/', getAll);

//Get one exercise
exercisesRouter.get('/:idExercise', getOne);

//Create an exercise
exercisesRouter.post('/', create);

//Update an exercise
exercisesRouter.put('/:idExercise', update);

//Delete of an exercise
exercisesRouter.delete('/:idExercise', remove);

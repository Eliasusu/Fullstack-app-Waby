import { Router } from "express";
import { getOne, add, update, remove } from "../controllers/exercises_trainings.controllers.js";

export const routinesRouter = Router();

routinesRouter.get('/:idTraining/:idExercise', getOne);

routinesRouter.post('/', add);

routinesRouter.put('/:idTraining/:idExercise', update);

routinesRouter.delete('/:idTraining/:idExercise', remove);

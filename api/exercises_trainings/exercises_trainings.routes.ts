import { Router } from "express";
import { getOne, add, update, remove } from "./exercises_trainings.controllers.js";

export const routinesRouter = Router();

routinesRouter.get('/:idTrainingExercise', getOne);

routinesRouter.put('/:idTrainingExercise', update);

routinesRouter.delete('/:idTrainingExercise', remove);

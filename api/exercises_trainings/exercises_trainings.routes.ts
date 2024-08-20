import { Router } from "express";
import { getOne, add, update, remove } from "./exercises_trainings.controllers.js";

export const routinesRouter = Router();

routinesRouter.get('/:idTraining', getOne);

routinesRouter.post('/', add);

routinesRouter.put('/:idTraining', update);

routinesRouter.delete('/:idTraining', remove);

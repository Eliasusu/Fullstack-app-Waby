import { Router } from "express";
import { getOne, add, update, remove } from "./trainingItems.controllers.js";

export const routinesRouter = Router();

routinesRouter.get('/:idTrainingItem', getOne);

routinesRouter.put('/:idTrainingItem', update);

routinesRouter.delete('/:idTrainingItem', remove);

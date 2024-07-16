import { Router } from "express";
import { getAll, getOne, add, update, deleteOne } from "../controllers/mesocycles.controllers.js";

export const mesocyclesRouter = Router();

//Get all trainings from a mesocycle
mesocyclesRouter.get('/:idMesocycle', getAll);

mesocyclesRouter.get('/:idMesocycle', getOne);

mesocyclesRouter.post('/', add);

mesocyclesRouter.patch('/:idMesocycle', update);

mesocyclesRouter.delete('/:idMesocycle', deleteOne);
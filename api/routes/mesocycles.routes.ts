import { Router } from "express";
import { getAll, getOne, add, update, deleteOne } from "../controllers/mesocycles.controllers.js";

export const mesocyclesRouter = Router();

mesocyclesRouter.get('/:idTraining', getAll);

mesocyclesRouter.get('/:idMesocycle', getOne);

mesocyclesRouter.post('/', add);

mesocyclesRouter.patch('/:idMesocycle', update);

mesocyclesRouter.delete('/:idMesocycle', deleteOne);
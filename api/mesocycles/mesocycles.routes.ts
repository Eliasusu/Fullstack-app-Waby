import { Router } from "express";
import { getAll, getOne, add, update, deleteOne, getTrainings, addTraining} from "./mesocycles.controllers.js";

export const mesocyclesRouter = Router();

//Get all trainings from a mesocycle
mesocyclesRouter.get('/', getAll);

mesocyclesRouter.get('/:idMesocycle', getOne);

mesocyclesRouter.post('/', add);

mesocyclesRouter.put('/:idMesocycle', update);

mesocyclesRouter.delete('/:idMesocycle', deleteOne);

mesocyclesRouter.get('/:idMesocycle/trainings', getTrainings); //Get all trainings from a mesocycle

mesocyclesRouter.post('/:idMesocycle/trainings/:idTraining', addTraining); //Add a training to a mesocycle


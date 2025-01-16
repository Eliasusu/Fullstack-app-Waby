import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./progressiveOverload.controllers.js";

export const progressiveOverloadRouter = Router();

//Get all progressiveOverloads
progressiveOverloadRouter.get('/', getAll);

//Get one progressiveOverload
progressiveOverloadRouter.get('/:idProgressiveOverload', getOne);

//Create an progressiveOverload
progressiveOverloadRouter.post('/', create);

//Update an progressiveOverload
progressiveOverloadRouter.put('/:idProgressiveOverload', update);

//Delete of an progressiveOverload
progressiveOverloadRouter.delete('/:idProgressiveOverload', remove);

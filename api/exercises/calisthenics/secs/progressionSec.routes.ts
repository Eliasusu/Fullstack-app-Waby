import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./progressionsPerSec.controllers.js";

export const progressionsSecRouter = Router();

//Get all calisthenics progression per sec
progressionsSecRouter.get('/', getAll);

//Get one calisthenics progression per sec
progressionsSecRouter.get('/:idProgression', getOne);

//Create a calisthenics progression per sec
progressionsSecRouter.post('/', create);

//Update a calisthenics progression per sec
progressionsSecRouter.put('/:idProgression', update);

//Delete a calisthenics progression per sec
progressionsSecRouter.delete('/:idProgression', remove);
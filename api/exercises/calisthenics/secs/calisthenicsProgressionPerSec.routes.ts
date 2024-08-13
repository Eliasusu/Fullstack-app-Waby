import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./calisthenicsProgressionsPerSec.controllers.js";

export const calisthenicsProgressionsPerSegRouter = Router();

//Get all calisthenics progression per sec
calisthenicsProgressionsPerSegRouter.get('/', getAll);

//Get one calisthenics progression per sec
calisthenicsProgressionsPerSegRouter.get('/:idProgression', getOne);

//Create a calisthenics progression per sec
calisthenicsProgressionsPerSegRouter.post('/', create);

//Update a calisthenics progression per sec
calisthenicsProgressionsPerSegRouter.put('/:idProgression', update);

//Delete a calisthenics progression per sec
calisthenicsProgressionsPerSegRouter.delete('/:idProgression', remove);
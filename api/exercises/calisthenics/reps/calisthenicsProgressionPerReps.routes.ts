import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./calisthenicsProgressionsPerReps.controllers.js";

export const calisthenicsProgressPerRepsRouter = Router();

//Get all exercises
calisthenicsProgressPerRepsRouter.get('/', getAll);

//Get one exercise
calisthenicsProgressPerRepsRouter.get('/:idProgression', getOne);

//Create an exercise
calisthenicsProgressPerRepsRouter.post('/', create);

//Update an exercise
calisthenicsProgressPerRepsRouter.put('/:idProgression', update);

//Delete of an exercise
calisthenicsProgressPerRepsRouter.delete('/:idProgression', remove);


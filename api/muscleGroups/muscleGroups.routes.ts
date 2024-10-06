import {Router} from 'express';
import { getAll, getOne, update, remove, add, getOneByName } from './muscleGroups.controller.js';


export const muscleGroupsRouter = Router();

//Get all muscle groups
muscleGroupsRouter.get('/', getAll);

//Get one muscle group by id
muscleGroupsRouter.get('/:idMuscleGroup', getOne);

//Add a muscle group
muscleGroupsRouter.post('/', add);

//Update a muscle group
muscleGroupsRouter.put('/:idMuscleGroup', update);

//Delete a muscle group
muscleGroupsRouter.delete('/:idMuscleGroup', remove);

//Get one by name 
muscleGroupsRouter.get('/name/:name', getOneByName);

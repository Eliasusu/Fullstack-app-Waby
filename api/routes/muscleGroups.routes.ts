import {Router} from 'express';
import { getAll, getOne, update, remove, add } from '../controllers/muscleGroups.controller.js';


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

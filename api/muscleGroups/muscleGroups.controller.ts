import { Request, Response } from 'express';
import { validateMuscleGroup, validatePartialMuscleGroup } from './muscleGroups.schema.js';
import { MuscleGroup } from './muscleGroup.entity.js';


//Get all muscle groups
async function getAll(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

//Get one muscle group by id
async function getOne(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

//Add a muscle group
async function add(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

//Update a muscle group
async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

//Delete a muscle group
async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getAll, getOne, add, update, remove }
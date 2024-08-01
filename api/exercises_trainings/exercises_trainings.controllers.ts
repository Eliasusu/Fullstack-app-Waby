import { Request, Response } from "express";
import { validateRoutine, validatePartialRoutine } from "./exercises_trainings.schema.js";
import { Exercise_Training } from "./exercise_training.entity.js";


async function getOne(req: Request, res: Response) { 
    res.status(500).json({ message: 'Not implemented' });
}

async function add(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function update(req: Request, res: Response) { 
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getOne, add, update, remove };
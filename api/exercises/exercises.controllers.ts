import { Request, Response } from "express";
import { validateExercises, validateParcialExercises } from "./exercises.schema.js";
import { Exercise } from "./exercise.entity.js";


async function getAll(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function getOne(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function create(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getAll, getOne, create, update, remove };
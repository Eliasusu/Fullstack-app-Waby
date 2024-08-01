import { Request, Response } from "express";
import { validateTraining, validateParcialTraining } from "./trainings.schema.js";
import { Training } from "./training.entity.js";

async function getAll(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
 }

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

export { getAll, getOne, add, update, remove };
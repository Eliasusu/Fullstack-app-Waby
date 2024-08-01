import { Request, Response } from "express";
import { validateMesocycles } from "./mesocycles.schema.js";
import { validateParcialMesocycles } from "./mesocycles.schema.js";

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

async function deleteOne(req: Request, res: Response) {
  res.status(500).json({ message: 'Not implemented' });
}


export { getAll, getOne, add, update, deleteOne };

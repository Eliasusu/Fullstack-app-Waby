import { Request, Response } from "express";
import { validateMesocycles } from "../schemas/mesocycles.schema.js";
import { MesocycleRepository } from "../repository/mesocycles.repository.js";
import { validateParcialMesocycles } from "../schemas/mesocycles.schema.js";

const repository = new MesocycleRepository();

async function getAll(req: Request, res: Response) {
  const mesocycles = await repository.getAll({id: req.params.idTraining});
  res.status(200).json(mesocycles);
}

async function getOne(req: Request, res: Response) {
  const { idMesocycle } = req.params;
  const mesocycle = await repository.getOne({ id: idMesocycle });
  if (mesocycle) return res.json(mesocycle);
  res.status(404).json({ error: "Mesocycle not found" });
}

async function add(req: Request, res: Response) {
  const result = validateMesocycles(req.body);
  if (result.success) {
    const mesocycle = result.data;
    const newMesocycle = await repository.add(mesocycle);
    res.status(201).json(newMesocycle);
  } else {
    res.status(400).json({ error: result.error });
  }
}

async function update(req: Request, res: Response) {
  const { idMesocycle } = req.params;
  const mesocycle = await repository.getOne({ id: idMesocycle });
  if (mesocycle) {
    const result = validateParcialMesocycles(req.body);
    if (result.success) {
      const mesocycleUpdate = await repository.update({
        ...mesocycle,
        ...req.body,
      });
      if (mesocycleUpdate) return res.json(mesocycleUpdate);
    } else {
      res.status(400).json({ error: result.error });
    }
  } else {
    res.status(404).json({ error: "Mesocycle not found" });
  }
}

async function deleteOne(req: Request, res: Response) {
  const { idMesocycle } = req.params;
  const mesocycle = await repository.delete({ id: idMesocycle });
  if (mesocycle) return res.json(mesocycle);
  res.status(404).json({ error: "Mesocycle not found" });
}


export { getAll, getOne, add, update, deleteOne };

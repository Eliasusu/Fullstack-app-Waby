import { Request, Response } from "express";
import { validateMesocycles } from "./mesocycles.schema.js";
import { validateParcialMesocycles } from "./mesocycles.schema.js";
import { Mesocycle } from "./mesocycle.entity.js";
import { orm } from "../shared/db/orm.js";
import { Training } from "../trainings/training.entity.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
  try{
      const mesocycles = await em.find(Mesocycle, {}, { populate: ['trainings'] });
      res.status(200).json({ message: 'finded all mesocycles', mesocycles });
  } catch(err:any){
      res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
  }
}

async function getOne(req: Request, res: Response) {
  try{
      const idMesocycle = Number.parseInt(req.params.idMesocycle);
      const mesocycle = await em.findOneOrFail(Mesocycle, {idMesocycle}, { populate: ['trainings'] });
      res.status(200).json({message: 'finded mesocycle', mesocycle});
  } catch(err:any){
      res.status(500).json({message: err.message});
  }
}

async function add(req: Request, res: Response) {
  try{
      const mesocycleValidation = validateMesocycles(req.body);
      if (!mesocycleValidation.success) {
          res.status(400).json({message: mesocycleValidation.error});
          return;
      }
      const mesocycle = em.create(Mesocycle, mesocycleValidation.data);
      await em.flush();
      res.status(201).json({message: 'Mesocycle created', mesocycle});
  } catch(err:any){
      res.status(500).json({message: err.message});
  }
}

async function update(req: Request, res: Response) {
  try {
      const idMesocycle = Number(req.params.idMesocycle);
      const mesocycleFind = await em.findOne(Mesocycle, { idMesocycle }, { populate: ['trainings'] });
      if (mesocycleFind !== undefined) {
          const result = validateParcialMesocycles(req.body);
          if (result.error) return res.status(400).json(result.error);
          if (result.success) {
              const mesocycle = em.getReference(Mesocycle, idMesocycle as never);
              em.assign(mesocycle, result.data);
              await em.flush();
              res.status(202).json({ message: 'Mesocycle updated succesfully' });
          }
      }
  } catch(err:any){
      res.status(500).json({message: err.message});
  }
}

async function deleteOne(req: Request, res: Response) {
  try{
      const idMesocycle = Number.parseInt(req.params.idMesocycle);
      const mesocycle = await em.findOneOrFail(Mesocycle, {idMesocycle});
      em.removeAndFlush(mesocycle);
      res.status(200).json({message: 'Mesocycle deleted'});
  } catch(err:any){
      res.status(500).json({message: err.message});
  }
}

async function getTrainings(req: Request, res: Response) {
try {
    const idMesocycle = Number(req.params.idMesocycle);
    const mesocycle = await em.findOneOrFail(Mesocycle, { idMesocycle }, { populate: ['trainings'] });
    const trainings = mesocycle.trainings;
    res.status(200).json({ message: 'finded all trainings of a mesocycle', trainings });
} catch (err:any) {
    res.status(500).json({ message: err.message });
}
}

//agregar un training ya existente a un mesociclo

async function addTraining(req: Request, res: Response) {
  try {
      const idMesocycle = Number(req.params.idMesocycle);
      const idTraining = Number(req.params.idTraining);
      const mesocycle = await em.findOneOrFail(Mesocycle, { idMesocycle }, { populate: ['trainings'] });
      const training = await em.findOneOrFail(Training, { idTraining });
      if (mesocycle === undefined) {res.status(404).json({ message: 'Mesocycle not found' });}
      if (training === undefined) {res.status(404).json({ message: 'Training not found' });}
      if(mesocycle.trainings?.contains(training)) {res.status(400).json({ message: 'Training already added to mesocycle' });}
      if (mesocycle.trainings) {mesocycle.trainings.add(training);}
      await em.flush();
      res.status(201).json({ message: 'Training added to mesocycle', mesocycle });
  } catch (err:any) {
      res.status(500).json({ message: err.message });
  }
}



export { getAll, getOne, add, update, deleteOne, getTrainings, addTraining };

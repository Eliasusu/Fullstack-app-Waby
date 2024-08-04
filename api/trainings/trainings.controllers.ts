import { Request, Response } from "express";
import { validateTraining, validateParcialTraining } from "./trainings.schema.js";
import { orm } from "../shared/db/orm.js";
import { Training } from "./training.entity.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
        const trainings = await em.find(Training, {}, { populate: ['user.idUser', 'mesocycle.idMesocycle'] });
        res.json(trainings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
 }

async function getOne(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function add(req: Request, res: Response) { 
    // En esta funcionalidad deberia haber un middleware que valide que el usuario que esta creando el training esta logueado
    try {
        const trainingValidation = validateTraining(req.body);
        if (!trainingValidation.success) {
            res.status(400).json({ message: trainingValidation.error });
            return;
        }
        const training = em.create(Training, trainingValidation.data);
        await em.persistAndFlush(training);
        res.status(201).json({ message: 'Training created', training });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) { 
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getAll, getOne, add, update, remove };
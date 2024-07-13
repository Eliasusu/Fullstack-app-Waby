import { Request, Response } from "express";
import { validateTraining, validateParcialTraining } from "../schemas/trainings.schema.js";
import { Training } from "../entity/training.entity.js";
import { TrainingRepository } from "../repository/trainings.repository.js";

const repository = new TrainingRepository();

async function getAll(req: Request, res: Response) {
    const { idUser } = req.params;
    const trainings = await repository.getAll({ id: idUser });
    if (!trainings) return res.status(404).json({ error: 'Trainings not found' });
    res.json(trainings);
 }

async function getOne(req: Request, res: Response) {
    const { idTraining } = req.params;
    const training = await repository.getOne({ id: idTraining });
    if (training) return res.json(training);
    res.status(404).json({ error: 'Training not found' });
}

async function add(req: Request, res: Response) { 
    const result = validateTraining(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const trainingInput = new Training(
            req.body.user,
            req.body.mesocycle,
            req.body.trainingName,
            req.body.trainingType,
            req.body.day,
            req.body.time,
        );
        const newTraining = await repository.add(trainingInput);
        if (!undefined) return res.status(201).json(newTraining);
        
    } else {
        res.status(400).json({ error: 'Training not created' });
    }
}

async function update(req: Request, res: Response) { 
    const { idTraining } = req.params;
    console.log(idTraining);
    const training = await repository.getOne({id: idTraining});
    console.log(training);
    if(training){
        //Esto se hace en base de datos
        const result = validateParcialTraining(req.body);
        console.log(result);
        if (result.success) {
            const updatedTraining = await repository.update({ ...training, ...req.body });
            if (updatedTraining) return res.json(updatedTraining);
        } else {
            res.status(404).json({ error: 'Training not be updated' });
        }
    } else {
        res.status(404).json({ error: 'Training not found'});
        }
}

async function remove(req: Request, res: Response) {
    const { idTraining } = req.params;
    const training = await repository.delete({ id: idTraining });
    if (training) return res.status(200).json(training);
    res.status(404).json({ error: 'Training not found' });
}

export { getAll, getOne, add, update, remove };
import { Request, Response } from "express";
import { validateTraining, validateParcialTraining } from "./trainings.schema.js";
import { orm } from "../shared/db/orm.js";
import { Training } from "./training.entity.js";
import { User } from "../users/user.entity.js";
import { getDateToday } from "../shared/getDateToday.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
        const trainings = await em.find(Training, { user: req.body.user.id }, { populate: ['user.idUser', 'mesocycle.idMesocycle', 'exercisesTrainings.exercise'] });
        res.json(trainings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
 }

async function getOne(req: Request, res: Response) {
    try {
        const trainingFind = await em.findOne(Training, { user: { idUser: req.body.user.id }, day: req.params.date }, { populate: ['user.idUser', 'mesocycle.idMesocycle', 'exercisesTrainings.exercise.name'] });
        res.json(trainingFind);
    } catch (error: any) {
        if (error.name === 'EntityNotFoundError') {
            res.status(404).json({ message: 'Training not found' });
        } else {
            res.status(500).json({ message: 'Internal Server Error'  });
        }
    }
}

async function add(req: Request, res: Response) {
    try {
        const user = await em.findOne(User, { idUser: req.body.user.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const trainingValidation = validateParcialTraining(req.body);
        if (!trainingValidation.success) {
            return res.status(400).json({ message: trainingValidation.error });
        }
        const training = em.create(Training, {
            ...trainingValidation.data,
            user: user, 
        });
        await em.persistAndFlush(training);
        res.status(201).json({ message: 'Training created', training });
        
    } catch (error: any) {
        console.error(error); // eliminar en produccion
        res.status(500).json({ message: error.message });
    }
}


async function update(req: Request, res: Response) {
    try{
        const idTraining = Number.parseInt(req.params.idTraining);
        const userId = req.body.user.id;
        const training = await em.findOneOrFail(Training, {idTraining, user: { idUser: userId }});
        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }
        const trainingValidation = validateParcialTraining(req.body);
        if (!trainingValidation.success) {
            return res.status(400).json({ message: trainingValidation.error });
        }
        em.assign(training, trainingValidation.data);
        await em.flush();
        res.status(202).json({ message: 'Training updated' });
    }catch(error: any){
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try{
        const idTraining = Number.parseInt(req.params.idTraining);
        const userId = req.body.user.id;
        const training = await em.findOneOrFail(Training, {idTraining, user: { idUser: userId }});
        if (!training) return res.status(404).json({ message: 'Training not found' });
        await em.removeAndFlush(training);
        res.status(202).json({ message: 'Training removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { getAll, getOne, add, update, remove };
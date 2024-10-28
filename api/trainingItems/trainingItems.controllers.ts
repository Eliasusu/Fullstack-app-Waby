import { Request, Response } from "express";
import { validateRoutine, validatePartialRoutine } from "./trainingItems.schema.js";
import { trainingItem } from "./trainingItems.entity.js";
import { orm } from "../shared/db/orm.js";
import { Exercise } from "../exercises/exercise.entity.js";
import { Training } from "../trainings/training.entity.js";

const em = orm.em;

async function getOne(req: Request, res: Response) { 
    try {
        const idTrainingItem = parseInt(req.body.idTrainingItem);
        const exerciseTraining = await em.findOne(trainingItem, { idTrainingItem: idTrainingItem, training: { user: { idUser: req.body.user.id } }}, { populate: ['exercise', 'training', 'training.user'] });
        if(!exerciseTraining) return res.status(404).json({ message: 'Exercise training not found' });
        if (exerciseTraining?.training.user.idUser !== req.body.user.id) return res.status(403).json({ message: 'Forbidden' });
        if (exerciseTraining?.training.user.idUser === req.body.user.id) return res.status(200).json(exerciseTraining);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function getAll(req: Request, res: Response) { 
    try {
        const idTrainingItem = parseInt(req.body.idTrainingItem);
        const exerciseTraining = await em.findOne(trainingItem, { idTrainingItem: idTrainingItem, training: { user: { idUser: req.body.user.id } }}, { populate: ['exercise', 'training', 'training.user'] });
        if (exerciseTraining?.training.user.idUser === req.body.user.id) {
            return res.status(200).json(exerciseTraining);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function add(req: Request, res: Response) {
    try {
        const findExercise = await em.findOne(Exercise, { idExercise: req.body.exercise, user: { idUser: req.body.user.id } });
        
        if (!findExercise) return res.status(404).json({ message: 'Exercise not found' });

        const idTraining = parseInt(req.params.idTraining);
        
        const findTraining = await em.findOne(Training, { idTraining });
        
        if (!findTraining) return res.status(404).json({ message: 'Training not found' });
        
        const exerciseTrainingValidation = validatePartialRoutine(req.body);
        
        if (!exerciseTrainingValidation.success) return res.status(400).json({ message: exerciseTrainingValidation.error });
        
        const exerciseTraining = em.create(trainingItem, {
            ...exerciseTrainingValidation.data,
            exercise: findExercise.idExercise,
            training: findTraining.idTraining
        });
        
        await em.persistAndFlush(exerciseTraining);
        
        res.status(201).json({ message: 'Exercise training added', exerciseTraining });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        console.log(req.body);
        const idTrainingItem = parseInt(req.params.idTrainingItem);
        const exerciseTraining = await em.findOne(trainingItem, { idTrainingItem: idTrainingItem, training: { user: { idUser: req.body.user.id } } });
        if (!exerciseTraining) return res.status(404).json({ message: 'Exercise training not found' });
        const result = validatePartialRoutine(req.body);
        if (!result.success) return res.status(400).json({ message: result.error });
        if (result.success) {
            console.log(result.data);
            const routineUpdated = em.getReference(trainingItem, idTrainingItem as never);
            em.assign(routineUpdated, result.data);
            await em.flush();
            res.status(202).json({ message: 'Exercise updated succesfully', routineUpdated });
        } else {
            res.status(400).json({ error: 'Exercise not updated' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}  

async function remove(req: Request, res: Response) {
    try {
        const idTrainingItem = parseInt(req.params.idTrainingItem);
        const exerciseTraining = await em.findOne(trainingItem, { idTrainingItem: idTrainingItem, training: { user: { idUser: req.body.user.id } } });
        if (!exerciseTraining) return res.status(404).json({ message: 'Exercise training not found' });
        const exerciseTrainingRef = em.getReference(trainingItem, idTrainingItem as never);
        await em.removeAndFlush(exerciseTrainingRef);
        res.status(202).json({ message: 'Exercise training removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { getOne, getAll, add, update, remove };
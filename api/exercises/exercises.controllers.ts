import { Request, Response } from "express";
import { validateParcialExercises } from "./exercises.schema.js";
import { Exercise } from "./exercise.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
    console.log(req.body);
    try {
        if (req.body.muscleGroups) { 
            const muscleGroups = req.body.muscleGroups;
            const exercises = await em.find(Exercise, { muscleGroups }, { populate: ['muscleGroups', 'trainingMethod'] });
            res.status(200).json({ message: 'finded all exercises', exercises });
            return;
        }
        const exercises = await em.find(Exercise, {}, { populate: ['muscleGroups', 'trainingMethod'] });
        res.status(200).json({ message: 'finded all exercises', exercises });
    }catch(err:any){
        res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
    }
}

async function getOne(req: Request, res: Response) {
    try{
        const idExercise = Number.parseInt(req.params.idExercise);
        const exercise = await em.findOneOrFail(Exercise, {idExercise}, { populate: ['muscleGroups', 'trainingMethod'] });
        res.status(200).json({message: 'finded exercise', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function create(req: Request, res: Response) {
    try {
        console.log(req.body);
        const exerciseValidation = validateParcialExercises(req.body);
        if (!exerciseValidation.success) {
            res.status(400).json({message: exerciseValidation.error});
            return;
        }
        const exercise = em.create(Exercise, {
            ...exerciseValidation.data,
            user: req.body.user.id
            });
        await em.flush();
        res.status(201).json({message: 'Exercise created', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function update(req: Request, res: Response) {
    try {
        const idExercise = Number(req.params.idExercise);
        const exerciseFind = await em.findOne(Exercise, { idExercise }, { populate: ['muscleGroups', 'trainingMethod' ] });
        if (exerciseFind !== undefined) {
            const result = validateParcialExercises(req.body);
            if (result.error) return res.status(400).json(result.error);
            if (result.success) {
                const exercise = em.getReference(Exercise, idExercise as never);
                em.assign(exercise, result.data);
                await em.flush();
                res.status(202).json({ message: 'Exercise updated succesfully' });
            } else {
                res.status(400).json({ error: 'Exercise not updated' });
            }
        } else {
            res.status(404).json({ error: 'Exercise not found' });
        }
    }   
    catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function remove(req: Request, res: Response) {
    try {
        const idExercise = Number(req.params.idExercise);
        const exerciseFind = await em.findOne(Exercise, { idExercise });
        if(!exerciseFind) return res.status(404).json({message: 'Exercise not found'});
        const exercise = em.getReference(Exercise, idExercise as never);
        em.removeAndFlush(exercise);
        return res.status(200).json(exercise);
    } catch (error: any) { 
        console.log(error); // --> Eliminar en produccion
        res.status(500).json({ error: 'Error deleting exercise' });
    }
}

export { getAll, getOne, create, update, remove };
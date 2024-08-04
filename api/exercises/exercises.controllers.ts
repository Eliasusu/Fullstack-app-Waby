import { Request, Response } from "express";
import { validateExercises, validateParcialExercises } from "./exercises.schema.js";
import { Exercise } from "./exercise.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try{
        const exercises = await em.find(Exercise, {}, { populate: ['muscleGroups'] });
        res.status(200).json({message: 'finded all exercises', exercises});
    }catch(err:any){
        res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
    }
}

async function getOne(req: Request, res: Response) {
    try{
        const idExercise = Number.parseInt(req.params.idExercise);
        const exercise = await em.findOneOrFail(Exercise, {idExercise}, { populate: ['muscleGroups'] });
        res.status(200).json({message: 'finded exercise', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function create(req: Request, res: Response) {
    try{
        const exerciseValidation = validateExercises(req.body);
        if (!exerciseValidation.success) {
            res.status(400).json({message: exerciseValidation.error});
            return;
        }
        const exercise = em.create(Exercise, exerciseValidation.data);
        await em.flush();
        res.status(201).json({message: 'Exercise created', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function update(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getAll, getOne, create, update, remove };
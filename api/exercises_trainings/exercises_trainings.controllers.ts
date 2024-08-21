import { Request, Response } from "express";
import { validateRoutine, validatePartialRoutine } from "./exercises_trainings.schema.js";
import { ExerciseTraining } from "./exercise_training.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

async function getOne(req: Request, res: Response) { 
    try {
        const idTrainingExercise = parseInt(req.body.idTrainingExercise);
        const exerciseTraining = await em.findOne(ExerciseTraining, { idTrainingExercise }, { populate: ['exercise', 'training', 'training.user'] });
        if (exerciseTraining?.training.user.idUser === req.body.idUser) {
            res.status(200).json(exerciseTraining);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
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

export { getOne, add, update, remove };
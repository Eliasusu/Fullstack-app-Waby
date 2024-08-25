import { Request, Response } from "express";
import { validateRoutine, validatePartialRoutine } from "./exercises_trainings.schema.js";
import { ExerciseTraining } from "./exercise_training.entity.js";
import { orm } from "../shared/db/orm.js";
import { Exercise } from "../exercises/exercise.entity.js";
import { Training } from "../trainings/training.entity.js";

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
    try {
        const findExercise = await em.findOne(Exercise, { idExercise: req.body.exercise });
        if (!findExercise) return res.status(404).json({ message: 'Exercise not found' });

        const idTraining = parseInt(req.params.idTraining);
        const findTraining = await em.findOne(Training, { idTraining });
        if (!findTraining) return res.status(404).json({ message: 'Training not found' });

        const exerciseTrainingValidation = validatePartialRoutine(req.body);
        if (!exerciseTrainingValidation.success) return res.status(400).json({ message: exerciseTrainingValidation.error });

        const exerciseTraining = em.create(ExerciseTraining, {
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
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getOne, add, update, remove };
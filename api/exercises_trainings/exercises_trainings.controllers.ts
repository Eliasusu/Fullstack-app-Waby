import { Request, Response } from "express";
import { ExerciseTrainingRoutine } from "./exercises_trainings.repository.js";
import { validateRoutine, validatePartialRoutine } from "./exercises_trainings.schema.js";
import { Exercise_Training } from "./exercise_training.entity.js";

const repository = new ExerciseTrainingRoutine();

async function getOne(req: Request, res: Response) { 
    const { idTraining, idExercise } = req.params;
    const exerciseTraining = await repository.getOne({ id: idTraining, other: idExercise });
    if (exerciseTraining) return res.json(exerciseTraining);
    res.status(404).json({ error: 'Exercise Training not found' });
}

async function add(req: Request, res: Response) {
    const result = validateRoutine(req.body);
    if (result.success) {
        const exerciseTraining = new Exercise_Training(
            req.body.training,
            req.body.exercise,
            req.body.sets,
            req.body.reps,
            req.body.weight,
            req.body.rest,
            req.body.comment
        );
        const newExerciseTraining = await repository.add(exerciseTraining);
        if (newExerciseTraining) return res.status(201).json(newExerciseTraining);
        res.status(404).json({ error: 'Exercise Training not added' });
    } else {
        res.status(400).json({ error: 'Exercise Training not added' });
    }
}

async function update(req: Request, res: Response) { 
    const { idTraining, idExercise } = req.params;
    const exerciseTraining = await repository.getOne({ id: idTraining, other: idExercise });
    if (exerciseTraining) {
        const result = validatePartialRoutine(req.body);
        if (result.success) {
            const updatedExerciseTraining = await repository.update({
                ...exerciseTraining,
                ...req.body
            });
            if (updatedExerciseTraining) return res.json(updatedExerciseTraining);
        } else {
            res.status(400).json({ error: 'Exercise Training not updated' });
        }
    } else {
        res.status(404).json({ error: 'Exercise Training not found' });
    }
}

async function remove(req: Request, res: Response) {
    const { idTraining, idExercise } = req.params;
    const exerciseTraining = await repository.getOne({ id: idTraining, other: idExercise });
    if (exerciseTraining) {
        const deletedExerciseTraining = await repository.delete({ id: idTraining, other: idExercise });
        if (deletedExerciseTraining) return res.json(deletedExerciseTraining);
    }
    res.status(404).json({ error: 'Exercise Training not found' });
}

export { getOne, add, update, remove };
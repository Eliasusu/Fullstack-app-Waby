import { Request, Response } from "express";
import { validateExercises, validateParcialExercises } from "../schemas/exercises.schema.js";
import { ExerciseRepository } from "../repository/exercises.repository.js";
import { Exercise } from "../entity/exercise.entity.js";

const repository = new ExerciseRepository();

async function getAll(req: Request, res: Response) {
    const exercises = await repository.getAll();
    res.json(exercises);
}

async function getOne(req: Request, res: Response) {
    const { idExercise } = req.params;
    const exercise = await repository.getOne({id: idExercise});
    if (exercise) return res.json(exercise);
    res.status(404).json({ error: 'Exercise not found'});
}

async function create(req: Request, res: Response) {
    const result = validateExercises(req.body);

    if(result.success){ 
        const exerciseInput = new Exercise(
            req.body.name,
            req.body.trainingMethod,
            req.body.description,
            req.body.muscleGroups,
            req.body.difficulty,
            req.body.videoUrl,
            req.body.image,
            req.body.idExercise,
            req.body.training,
            req.body.date
        );
        const newExercise = await repository.add(exerciseInput);
        if (newExercise) return res.status(201).json(newExercise);
    } else{
        res.status(400).json({ error: result.error });
    }
}

async function update(req: Request, res: Response) {
    const { idExercise } = req.params;
    const exercise = await repository.getOne({id: idExercise});
    if (exercise) {
        const result = validateParcialExercises(req.body);
        if(result.success){
            const updatedExercise = await repository.update({
                ...exercise,
                ...req.body
            });
            if (updatedExercise) return res.json(updatedExercise);
        } else{
            res.status(400).json({ error: result.error });
        }
    }
}

async function remove(req: Request, res: Response) {
    const { idExercise } = req.params;
    const exercise = await repository.delete({id:idExercise});
    if (exercise === exercise) return res.status(200).json(exercise);
    res.status(404).json({ error: 'Exercise not found' });
}

export { getAll, getOne, create, update, remove };
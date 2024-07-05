import { Router } from "express";
import { validateExercises, validateParcialExercises } from "../schemas/exercises.schema.js";
import { ExerciseRepository } from "../repository/exercises.repository.js";

export const exercisesRouter = Router();

console.log('Entre wacho')

//Get de todos los ejercicios
exercisesRouter.get('/', async (req, res) => {
    const { nameMuscleGroup } = req.query;
    const exercises = await ExerciseRepository.getAll({ nameMuscleGroup });
    res.json(exercises);
});

//Get de un ejercicio en particular
exercisesRouter.get('/:idExercise', async (req, res) => {
    const { idExercise } = req.params;
    const exercise = await ExerciseRepository.getById(idExercise);
    if (exercise) return res.json(exercise);
    res.status(404).json({ error: 'Exercise not found'});
});

//Post de un ejercicio
exercisesRouter.post('/', async (req, res) => {
    const result = validateExercises(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const exercise = result.data;
        const newExercise = await ExerciseRepository.create(exercise);
        if (newExercise) return res.status(201).json(newExercise);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un ejercicio
exercisesRouter.put('/:idExercise',  (req, res) => {
    const { idExercise } = req.params;
    const exercise = ExerciseRepository.getById(idExercise);
    if (exercise !== undefined) {
        const result = validateParcialExercises(req.body);
        if(result.success){
            const exerciseUpdate = ExerciseRepository.update(idExercise, result.data);
            res.status(200).json(exerciseUpdate);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Exercise not found' });
    }
});

//Delete de un ejercicio
exercisesRouter.delete('/:idExercise', async (req, res) => {
    const { idExercise } = req.params;
    const exercise = await ExerciseRepository.delete(idExercise);
    if (exercise) return res.status(200).json(exercise);
    res.status(404).json({ error: 'Exercise not found' });
});

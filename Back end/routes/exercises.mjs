import { Router } from "express";
import users from '../server/wabys.json' with { type: 'json' };
import { validateGymExercises, validateParcialGymExercises } from "../schemas/gymExercises.mjs";

export const gymExercisesRouter = Router();

//Get de todos los ejercicios
gymExercisesRouter.get('/', (req, res) => {
    res.json(exercises);
});

//Get de un ejercicio en particular
gymExercisesRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const exercise = exercises.find((w) => w.id === id);
    if (exercise){
        res.json(exercise);
    } else {
        res.status(404).json({ error: 'Exercise not found' });
    }
});

//Post de un ejercicio
gymExercisesRouter.post('/', (req, res) => {
    const result = validateGymExercises(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const exercise = result.data;
        exercise.id = (exercises.length + 1).toString();
        exercises.push(exercise);
        res.status(201).json(exercise);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un ejercicio
gymExercisesRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const exercise = exercises.find((w) => w.id === id);
    console.log(exercise)
    if (exercise) {
        const result = validateParcialGymExercises(req.body);

        if(result.success){
            //Esto se hace en base de datos
            const data = result.data;
            Object.assign(exercise, data);
            res.status(200).json(exercise);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Exercise not found' });
    }
});

//Delete de un ejercicio
gymExercisesRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const exerciseIndex = exercises.findIndex((w) => w.id === id);
    if (exerciseIndex !== -1) {
        exercises.splice(exerciseIndex, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Exercise not found' });}
});

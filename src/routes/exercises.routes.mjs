import { Router } from "express";
import exercises from '../datos temporales/exercises.json' assert { type: "json" };
import { validateExercises, validateParcialExercises } from "../schemas/exercises.schema.mjs";

export const exercisesRouter = Router();

console.log('Entre wacho')

//Get de todos los ejercicios
exercisesRouter.get('/', (req, res) => {
    console.log("ENTRO TODAAAAA");
    res.json(exercises);
});

//Get de un ejercicio en particular
exercisesRouter.get('/:id', (req, res) => {
    const { idExercise } = req.params;
    const exercise = exercises.find((w) => w.id === idExercise);
    if (exercise){
        res.json(exercise);
    } else {
        res.status(404).json({ error: 'Exercise not found' });
    }
});

//Post de un ejercicio
exercisesRouter.post('/', (req, res) => {
    const result = validateExercises(req.body);

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
exercisesRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const exercise = exercises.find((w) => w.id === id);
    console.log(exercise)
    if (exercise) {
        const result = validateParcialExercises(req.body);

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
exercisesRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const exerciseIndex = exercises.findIndex((w) => w.id === id);
    if (exerciseIndex !== -1) {
        exercises.splice(exerciseIndex, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Exercise not found' });}
});

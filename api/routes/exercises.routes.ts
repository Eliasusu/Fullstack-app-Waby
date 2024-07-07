
import { NextFunction, Router, Request, Response } from "express";
import { validateExercises, validateParcialExercises } from "../schemas/exercises.schema.js";
import { ExerciseRepository } from "../repository/exercises.repository.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";
import { User } from "../entity/user.entity.js";
import { Training } from "../entity/training.entity.js";
import { Mesocycle } from "../entity/mesocycle.entity.js";
import { MuscleGroup } from "../entity/muscleGroup.entity.js";

export const exercisesRouter = Router();
const repository = new ExerciseRepository();

console.log('Entre wacho')

//Sanitize Input Data
function sanitizeInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        name: req.body.name,
        trainingMethod: new TrainingMethod(req.body.trainingMethod.name, req.body.trainingMethod.description),
        training: new Training(
            "1", 
            new User(
                req.body.training.user.username, 
                req.body.training.user.password, 
                req.body.training.user.email, 
                req.body.training.user.name, 
                new Date(req.body.training.user.birthdate),
                req.body.training.user.phone, 
                req.body.training.user.bodyWeight, 
                req.body.training.user.height, 
                new TrainingMethod(
                    req.body.training.user.trainingMethod.name,
                    req.body.training.user.trainingMethod.description
                )),
            new Mesocycle(
                 req.body.training.mesocycle.idMesocycle,
                 req.body.training.mesocycle.typeMesocycle, 
                 new Date(req.body.training.mesocycle.startDate), 
                 new Date(req.body.training.mesocycle.endDate)
                ), 
            req.body.training.trainingName, 
            req.body.training.trainingType, 
            new Date(req.body.training.day), 
            req.body.training.time
            ),
        description: req.body.description,
        muscleGroups: [new MuscleGroup(req.body.muscleGroups.id, req.body.muscleGroups.name, req.body.muscleGroups.description, req.body.muscleGroups.image)],
        difficulty: req.body.difficulty,
        videoUrl: req.body.videoUrl,
        image: req.body.image,
        idExercise: req.body.idExercise,
        date: new Date(req.body.date),
    }
}

//Get de todos los ejercicios
exercisesRouter.get('/', async (req, res) => {
    const exercises = await repository.getAll();
    res.json(exercises);
});

//Get de un ejercicio en particular
exercisesRouter.get('/:idExercise', async (req, res) => {
    const { idExercise } = req.params;
    const exercise = await repository.getOne({id: idExercise});
    if (exercise) return res.json(exercise);
    res.status(404).json({ error: 'Exercise not found'});
});

//Post de un ejercicio
exercisesRouter.post('/', sanitizeInput, async (req, res) => {
    const result = validateExercises(req.body.sanitizedInput);

    if(result.success){
        //Esto se hace en base de datos
        const newExercise = await repository.add(req.body.sanitizedInput);
        if (newExercise) return res.status(201).json(newExercise);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un ejercicio
exercisesRouter.put('/:idExercise', sanitizeInput, async  (req, res) => {
    const { idExercise } = req.params;
    const exercise = repository.getOne({id: idExercise});
    if (exercise !== undefined) {
        const result = validateParcialExercises(req.body.sanitizedInput);
        if(result.success){
            const exerciseUpdate = await repository.update(req.body.sanitizedInput);
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
    const exercise = await repository.delete({id:idExercise});
    if (exercise) return res.status(200).json(exercise);
    res.status(404).json({ error: 'Exercise not found' });
});

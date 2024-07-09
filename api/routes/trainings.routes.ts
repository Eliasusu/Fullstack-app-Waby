import { Router } from "express";
import { validateTraining, validateParcialTraining } from "../schemas/trainings.schema.js";
import { Training } from "../entity/training.entity.js";
import { TrainingRepository } from "../repository/trainings.repository.js";
import { PassThrough } from "stream";
import { User } from "../entity/user.entity.js";


export const trainingsRouter = Router();
const repository = new TrainingRepository();

//Get all trainings for a user --> Cuando hagamos la conexion a la base de datos se filtrara por el id del usuario
trainingsRouter.get('/', async  (req, res) => {
    //Esto se hace en base de datos
    const trainings = await repository.getAll();
    res.json(trainings);
});

//Get de un training en particular
trainingsRouter.get('/:idTraining', async (req, res) => {
    const { idTraining } = req.params;
    const training = await repository.getOne({id: idTraining});
    if (training) return res.json(training);
    res.status(404).json({ error: 'Training not found'});
});

//Post de un training
trainingsRouter.post('/', async (req, res) => {
    const result = validateTraining(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const trainingInput = new Training(
            req.body.user,
            req.body.mesocycle,
            req.body.trainingName,
            req.body.trainingType,
            new Date(req.body.day),
            req.body.time,
            req.body.idTraining
        );
        const newTraining = await repository.add(trainingInput);
        if (newTraining) return res.status(201).json(newTraining);
        
    } else {
        res.status(400).json({ error: result.error });
    }
});

//Put de un training
trainingsRouter.put('/:idTraining',  (req, res) => {
    PassThrough
});

//Delete de un training
trainingsRouter.delete('/:idTraining', (req, res) => {
    PassThrough
});



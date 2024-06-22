import { Router } from "express";
import trainings from '../server/trainings.json' with { type: 'json' };
import { validateTraining, validateParcialTraining } from "../schemas/trainings.mjs";

export const trainingsRouter = Router();

//Get de todos los trainings
trainingsRouter.get('/', (req, res) => {
    res.json(trainings);
});

//Get de un training en particular
trainingsRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const training = trainings.find((w) => w.id === id);
    if (training){
        res.json(training);
    } else {
        res.status(404).json({ error: 'Training not found' });
    }
});

//Post de un training
trainingsRouter.post('/', (req, res) => {
    const result = validateTraining(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const training = result.data;
        training.id = (trainings.length + 1).toString();
        trainings.push(training);
        res.status(201).json(training);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un training
trainingsRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const training = trainings.find((w) => w.id === id);
    console.log(training)
    if (training) {
        const result = validateParcialTraining(req.body);

        if(result.success){
            //Esto se hace en base de datos
            const data = result.data;
            Object.assign(training, data);
            res.status(200).json(training);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Training not found' });
    }
});

//Delete de un training
trainingsRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = trainings.findIndex((w) => w.id === id);
    if (index !== -1) {
        trainings.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Training not found' });
    }
});



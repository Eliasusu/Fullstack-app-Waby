import { Router } from "express";
import mesocycles from '../server/mesocycles.json' with { type: 'json' };
import { validateMesocycles, validateParcialMesocycles } from "../schemas/mesocycles.mjs";

export const mesocyclesRouter = Router();

//Get de todos los mesocycles
mesocyclesRouter.get('/', (req, res) => {
    res.json(mesocycles);
});

//Get de un mesocycle en particular
mesocyclesRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const mesocycle = mesocycles.find((w) => w.id === id);
    if (mesocycle){
        res.json(mesocycle);
    } else {
        res.status(404).json({ error: 'Mesocycle not found' });
    }
});

//Post de un mesocycle
mesocyclesRouter.post('/', (req, res) => {
    const result = validateMesocycles(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const mesocycle = result.data;
        mesocycle.id = (mesocycles.length + 1).toString();
        mesocycles.push(mesocycle);
        res.status(201).json(mesocycle);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un mesocycle
mesocyclesRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const mesocycle = mesocycles.find((w) => w.id === id);
    console.log(mesocycle)
    if (mesocycle) {
        const result = validateParcialMesocycles(req.body);

        if(result.success){
            //Esto se hace en base de datos
            const data = result.data;
            Object.assign(mesocycle, data);
            res.status(200).json(mesocycle);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Mesocycle not found' });
    }
});

//Delete de un mesocycle
mesocyclesRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = mesocycles.findIndex((w) => w.id === id);
    if (index !== -1) {
        mesocycles.splice(index, 1);
        res.status(200).json({ success: true });
    } else {
        res.status(404).json({ error: 'Mesocycle not found' });
    }
});


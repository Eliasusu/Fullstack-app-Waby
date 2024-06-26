import { Router } from "express";
import wabys from '../server/wabys.json' with { type: 'json' };
import { validateWaby, validateParcialWaby } from '../schemas/wabys.mjs';

export const wabysRouter = Router();


//Get de todos los wabys
wabysRouter.get('/', (req, res) => {
    res.json(wabys);
});

//Get de un waby en particular
wabysRouter.get('/:id', (req, res) => {
    
    const { id } = req.params;
    const waby = wabys.find((w) => w.id === id);
    if (waby) {
        res.json(waby);
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }
});

//Post de un waby
wabysRouter.post('/', (req, res) => {
    const result = validateWaby(req.body);

    if(result.success){
        //Esto se hace en base de datos
        const waby = result.data;
        waby.id = (wabys.length + 1).toString();
        wabys.push(waby);
        res.status(201).json(waby);
    } else{
        res.status(400).json({ error: result.error });
    }
});

//Put de un waby
wabysRouter.put('/:id',  (req, res) => {
    const { id } = req.params;
    const waby = wabys.find((w) => w.id === id);
    console.log(waby)
    if (waby) {
        const result = validateParcialWaby(req.body);

        if(result.success){
            //Esto se hace en base de datos
            const data = result.data;
            Object.assign(waby, data);
            res.status(200).json(waby);
            
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }

});

//Delete de un waby
wabysRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = wabys.findIndex((w) => w.id === id);
    console.log(index)
    if (index !== -1) {
        //Esto se hace en base de datos 
        console.log(index)
        wabys.splice(index, 1);
        res.status(204).json(wabys[index]);
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }
});

import {Router} from 'express'
import wabys from '../server/wabys.json' with { type: 'json' };
import { validacionWaby, validacionParcialWaby } from '../schemas/wabys.js';

export const wabysRouter = Router()


wabysRouter.get('/', (req, res) => {
    res.status(200)
    res.send('Waby app');
});


//Get de todos los wabys
wabysRouter('/', (req, res) => {
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
    const resultado = validacionWaby(req.body);

    if(resultado.success){
        //Esto se hace en base de datos
        const waby = resultado.data;
        waby.id = (wabys.length + 1).toString();
        wabys.push(waby);
        res.status(201).json(waby);
    } else{
        res.status(400).json({ error: resultado.error });
    }
});


//Put de un waby
wabysRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    const waby = wabys.find((w) => w.id === id);
    if (waby) {
        const resultado = validacionParcialWaby(req.body);

        if(resultado.success){
            //Esto se hace en base de datos
            const dato = resultado.data;
            Object.assign(waby, dato);
            res.status(200).json(waby);
            
        } else{
            res.status(400).json({ error: resultado.error });
        }
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }

});

wabysRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = wabys.findIndex((w) => w.id === id);
    if (index !== -1) {
        //Esto se hace en base de datos 
        wabys.splice(index, 1);
        res.status(204).json(wabys[index]);
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }
});
    

import express from 'express';
import process from 'process';
import wabys from './wabys.json' with { type: 'json' };
import { validateWaby, validateParcialWaby } from '../schemas/wabys.mjs';


// eslint-disable-next-line no-undef
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.status(200)
    res.send('Waby app');
});

//Get de todos los wabys
app.get('/api/v1/wabys', (req, res) => {
    res.json(wabys);
});

//Get de un waby en particular
app.get('/api/v1/wabys/:id', (req, res) => {
    
    const { id } = req.params;
    const waby = wabys.find((w) => w.id === id);
    if (waby) {
        res.json(waby);
    } else {
        res.status(404).json({ error: 'Waby not found' });
    }
});


//Post de un waby
app.post('/api/v1/wabys', (req, res) => {
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
app.put('/api/v1/wabys/:id', (req, res) => {
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
app.delete('/api/v1/wabys/:id', (req, res) => {
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



app.listen(port, () => {
    console.log(`Server listening in the port http://localhost:${port}`);
});
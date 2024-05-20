import express from 'express';
import process from 'process';
import wabys from './wabys.json' with { type: 'json' };
import { validacionWaby } from '../schemas/wabys.mjs';

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
    const resultado = validacionWaby(req.body);

    if(resultado.success){
        const waby = resultado.data;
        waby.id = wabys.length + 1;
        wabys.push(waby);
        res.status(201).json(waby);
    } else{
        res.status(400).json({ error: resultado.error });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
});
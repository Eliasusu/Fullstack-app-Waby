import { Router } from "express";
import { validateMesocycles } from "../schemas/mesocycles.schema.js";
import { MesocycleRepository } from "../repository/mesocycles.repository.js";
import { validateParcialMesocycles } from "../schemas/mesocycles.schema.js";


export const mesocyclesRouter = Router();
const repository = new MesocycleRepository();

mesocyclesRouter.get('/', async (req, res) => {
    const mesocycles = await repository.getAll();
    res.status(200).json(mesocycles);
});

mesocyclesRouter.get('/:idMesocycle', async (req, res) => {
    const { idMesocycle } = req.params;
    const mesocycle = await repository.getOne({id: idMesocycle});
    if (mesocycle) return res.json(mesocycle);
    res.status(404).json({ error: 'Mesocycle not found'});
});

mesocyclesRouter.post('/', async (req, res) => {
    const result = validateMesocycles(req.body);
    if(result.success){
        const mesocycle = result.data;
        const newMesocycle = await repository.add(mesocycle);
        res.status(201).json(newMesocycle);
    } else {
        res.status(400).json({ error: result.error });
    }
});

mesocyclesRouter.patch('/:idMesocycle', async (req, res) => {
    const { idMesocycle } = req.params;
    const mesocycle = await repository.getOne({id: idMesocycle});
    if (mesocycle) {
        const result = validateParcialMesocycles(req.body);
        if(result.success){
            const mesocycleUpdate = await repository.update({
              ...mesocycle,
              ...req.body
            });
            if (mesocycleUpdate) return res.json(mesocycleUpdate);
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Mesocycle not found'});
    }
});
/*mesocyclesRouter.put('/:idMesocycle', async (req, res) => {
    const { idMesocycle } = req.params;
    const mesocycle = await repository.getOne({id: idMesocycle});
    if (mesocycle) {
        const result = validateMesocycles(req.body);
        if(result.success){
            const mesocycleUpdate = await repository.update({
              ...mesocycle,
              ...req.body
            });
            if (mesocycleUpdate) return res.json(mesocycleUpdate);
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Mesocycle not found'});
    }
});*/

mesocyclesRouter.delete('/:idMesocycle', async (req, res) => {
    const { idMesocycle } = req.params;
    const mesocycle = await repository.delete({id: idMesocycle});
    if (mesocycle) return res.json(mesocycle);
    res.status(404).json({ error: 'Mesocycle not found'});
});
import { Router } from "express";
import { RoutineRepository } from "../repository/routines.repository.js";
import { validateRoutine } from "../schemas/routines.schema.js";
import { validatePartialRoutine } from "../schemas/routines.schema.js";
import { PassThrough } from "stream";

export const routinesRouter = Router();
const repository = new RoutineRepository();

routinesRouter.get('/', async (req, res) => {
    const routines = await repository.getAll();
    res.status(200).json(routines);
});

routinesRouter.get('/', async (req, res) => {
    // const { idRoutine } = req.params;
    // const routine = await repository.getOne({ id: idRoutine });
    // if (routine) return res.json(routine);
    // res.status(404).json({ error: 'Routine not found' });
    PassThrough
});

routinesRouter.post('/', async (req, res) => {
    const result = validateRoutine(req.body);
    if (result.success) {
        const routine = result.data;
        const newRoutine = await repository.add(routine);
        res.status(201).json(newRoutine);
    } else {
        res.status(400).json({ error: result.error });
    }
});

routinesRouter.put('HACER', async (req, res) => {
    // const { idRoutine } = req.params;
    // const routine = await repository.getOne({ id: idRoutine });
    // if (routine) {
    //     const result = validatePartialRoutine(req.body);
    //     if (result.success) {
    //         const routineUpdate = await repository.update({
    //             ...routine,
    //             ...req.body
    //         });
    //         if (routineUpdate) return res.json(routineUpdate);
    //     } else {
    //         res.status(400).json({ error: result.error });
    //     }
    // } else {
    //     res.status(404).json({ error: 'Routine not found' });
    // }
    PassThrough
});
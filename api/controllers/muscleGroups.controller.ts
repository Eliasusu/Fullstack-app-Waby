import { Request, Response } from 'express';
import { validateMuscleGroup, validatePartialMuscleGroup } from '../schemas/muscleGroups.schema.js';
import { MuscleGroupsRepository } from '../repository/muscleGroups.repository.js';
import { MuscleGroup } from '../entity/muscleGroup.entity.js';

const repository = new MuscleGroupsRepository();

//Get all muscle groups

async function getAll(req: Request, res: Response) {
    const muscleGroups = await repository.getAll();
    res.status(200).json(muscleGroups);
}

//Get one muscle group by id

async function getOne(req: Request, res: Response) {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.getOne({ id: idMuscleGroup });
    if (muscleGroup) return res.json(muscleGroup);
    res.status(404).json({ error: 'Muscle Group not found' });
}

//Add a muscle group

async function add(req: Request, res: Response) {
    const result = validateMuscleGroup(req.body);
    if (result.success) {
        const muscleGroup = result.data;
        console.log("");
        try {
            const newMuscleGroup = await repository.add(muscleGroup);
            res.status(201).json(newMuscleGroup);
        } catch (error) {
            res.status(500).json({ error: 'Error creating muscle group' });
        }
    } else {
        res.status(400).json({ error: result.error });
    }
}

//Update a muscle group

async function update(req: Request, res: Response) {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.getOne({ id: idMuscleGroup });
    if (muscleGroup) {
        const result = validatePartialMuscleGroup(req.body);
        console.log("valide el body");
        if (result.success) {
            const muscleGroupUpdate = await repository.update({
                ...muscleGroup,
                ...req.body
            });
            console.log("pase el update");
            if (muscleGroupUpdate) return res.status(202).json(muscleGroupUpdate);
        } else {
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Muscle Group not found' });
    }
}

//Delete a muscle group

async function remove(req: Request, res: Response) {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.delete({ id: idMuscleGroup });
    if (muscleGroup) return res.status(200).json(muscleGroup);
    res.status(404).json({ error: 'Muscle Group not found' });
}

export { getAll, getOne, add, update, remove }
import {Router} from 'express';
import { validateMuscleGroup} from '../schemas/muscleGroups.schema.js';
import {MuscleGroupRepository} from '../repository/muscleGroup.repository.js';


export const muscleGroupsRouter = Router();
const repository = new MuscleGroupRepository();

muscleGroupsRouter.get('/', async (req, res) => {
    const muscleGroups = await repository.getAll();
    res.status(200).json(muscleGroups);
} );

muscleGroupsRouter.get('/:idMuscleGroup', async (req, res) => {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.getOne({id: idMuscleGroup});
    if (muscleGroup) return res.json(muscleGroup);
    res.status(404).json({ error: 'Muscle Group not found'});
});

muscleGroupsRouter.post('/', async (req, res) => {
    const result = validateMuscleGroup(req.body);
    if(result.success){
        const muscleGroup = result.data;
        const newMuscleGroup = await repository.add(muscleGroup);
        res.status(201).json(muscleGroup);
    } else {
        res.status(400).json({ error: result.error });
    }
});

muscleGroupsRouter.put('/:idMuscleGroup', async (req, res) => {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.getOne({id: idMuscleGroup});
    if (muscleGroup) {
        const result = validateMuscleGroup(req.body);
        if(result.success){
            const muscleGroupUpdate = await repository.update({
              ...muscleGroup,
              ...req.body
            });
            if (muscleGroupUpdate) return res.json(muscleGroupUpdate);
        } else{
            res.status(400).json({ error: result.error });
        }
    } else {
        res.status(404).json({ error: 'Muscle Group not found'});
    }
});

muscleGroupsRouter.delete('/:idMuscleGroup', async (req, res) => {
    const { idMuscleGroup } = req.params;
    const muscleGroup = await repository.delete({id: idMuscleGroup});
    if (muscleGroup) return res.json(muscleGroup);
    res.status(404).json({ error: 'Muscle Group not found'});
});

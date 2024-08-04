import { Request, Response } from 'express';
import { validateMuscleGroup, validatePartialMuscleGroup } from './muscleGroups.schema.js';
import { MuscleGroup } from './muscleGroup.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em
//Get all muscle groups

async function getAll(req: Request, res: Response) {
    try{
        const muscleGroups = await em.find(MuscleGroup, {}, { populate: ['exercises'] });
        res.status(200).json({message: 'finded all muscleGroups', muscleGroups});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

//Get one muscle group by id
async function getOne(req: Request, res: Response) {
    try{ 
        const idMuscleGroup = Number.parseInt(req.params.idMuscleGroup);
        const muscleGroup = await em.findOneOrFail(MuscleGroup, {idMuscleGroup}, { populate: ['exercises'] });
        res.status(200).json({message: 'finded muscleGroup', muscleGroup});
    } catch(err:any){
        res.status(500).json({message: err.message})};
}

//Add a muscle group
async function add(req: Request, res: Response) {
    try { 
        const muscleGroupValidation = validateMuscleGroup(req.body);
        if (!muscleGroupValidation.success) {
            res.status(400).json({message: muscleGroupValidation.error});
            return;
        }
        const muscleGroup = em.create(MuscleGroup, muscleGroupValidation.data);
        await em.flush()
        res.status(201).json({message: 'MuscleGroup created', muscleGroup});
    } catch(err:any){
        res.status(500).json({message: err.message})};
}

//Update a muscle group
async function update(req: Request, res: Response) {
    try {
        const idMuscleGroup = Number.parseInt(req.params.idMuscleGroup);
        const muscleGroupToUpdate = await em.findOneOrFail(MuscleGroup, { idMuscleGroup });
        em.assign(muscleGroupToUpdate, req.body);
        await em.flush();
        res.status(202).json({message: 'MuscleGroup updated succesfully'});
    } catch(err:any){
        res.status(500).json({message: err.message});}
}

//Delete a muscle group
async function remove(req: Request, res: Response) {
    try{
        const idMuscleGroup = Number.parseInt(req.params.idMuscleGroup);
        const muscleGroup = em.getReference(MuscleGroup, idMuscleGroup as never);
        await em.removeAndFlush(muscleGroup);
        res.status(204).json({message: 'MuscleGroup deleted succesfully'});
    }catch(err:any){
        res.status(500).json({message: err.message});
    };
}

export { getAll, getOne, add, update, remove }
import { Request, Response } from "express";
import { orm } from "../../../shared/db/orm.js";
import { CalisthenicsProgressionPerReps } from "./calisthenicsProgressionPerReps.entity.js";
import { validateProgressionPerRep, validateProgressionPerRepPartial } from "./calisthenicsProgressionPerReps.schema.js";


const em = orm.em;

async function getAll(req: Request, res: Response) { 
    try{
        const exercises = await em.find(CalisthenicsProgressionPerReps, {}, { populate: ['exercise'] });
        res.status(200).json({message: 'finded all exercises', exercises});
    }catch(err:any){
        res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
    }
}

async function getOne(req: Request, res: Response) {
    try{
        const idProgression = Number.parseInt(req.params.idProgression);
        const exercise = await em.findOneOrFail(CalisthenicsProgressionPerReps, {idProgression}, { populate: ['exercise'] });
        res.status(200).json({message: 'finded exercise', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function create(req: Request, res: Response) {    
    try {
        const exercise = await em.findOneOrFail('Exercise', { idExercise: req.body.exercise });
        if (!exercise) {
            res.status(400).json({message: 'Exercise not found'});
            return;
        }
        console.log(req.body);
        console.log(exercise);
        const progressionPerRepsValidate = validateProgressionPerRepPartial(req.body);
        if (!progressionPerRepsValidate.success) {
            res.status(400).json({message: progressionPerRepsValidate.error});
            return;
        }
        const calisthenicsProgressionPerReps = em.create(CalisthenicsProgressionPerReps, {
            ...progressionPerRepsValidate.data,
            exercise: exercise
        });
        await em.persistAndFlush(calisthenicsProgressionPerReps);
    } catch (error: any) {
        console.log(error);//Quitar mensaje de error en producción
        return res.status(500).json({message: error.message});
    }
}

async function update(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

async function remove(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

export { getAll, getOne, create, update, remove };

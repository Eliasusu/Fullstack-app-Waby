import { Request, Response } from "express";
import { orm } from "../../../shared/db/orm.js";
import { ProgressionReps } from "./progressionReps.entity.js";
import { validateProgressionRepPartial } from "./progressionReps.schema.js";


const em = orm.em;

async function getAll(req: Request, res: Response) { 
    try{
        const exercises = await em.find(ProgressionReps, {}, { populate: ['exercise'] });
        res.status(200).json({message: 'finded all exercises', exercises});
    }catch(err:any){
        res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
    }
}

async function getOne(req: Request, res: Response) {
    try{
        const idProgression = Number.parseInt(req.params.idProgression);
        const exercise = await em.findOneOrFail(ProgressionReps, {idProgression}, { populate: ['exercise'] });
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
        console.log('Req body = ', req.body);
        console.log('const exercise = ', exercise);
        console.log('req.body.exercise = ', req.body.exercise);

        const progressionPerRepsValidate = validateProgressionRepPartial(req.body);
        if (!progressionPerRepsValidate.success) {
            res.status(400).json({message: progressionPerRepsValidate.error});
            return;
        }
        const calisthenicsProgressionPerReps = em.create(ProgressionReps, {
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
    try {
        const idProgression = Number.parseInt(req.params.idProgression);
        const progression = await em.findOneOrFail(ProgressionReps, { idProgression });
        if(!progression){
            res.status(400).json({message: 'Progression not found'});
            return;
        }
        const result = validateProgressionRepPartial(req.body);
        if(result.error) return res.status(400).json(result.error);
        if (result.success) {
            const progressionUpdated = em.getReference(ProgressionReps, idProgression as never);
            em.assign(progressionUpdated, result.data);
            await em.flush();
            res.status(202).json({ message: 'Progression updated succesfully' });
        } else {
            res.status(400).json({ error: 'Progression not updated' });
        }
    } catch (error: any) {
        console.log(error);//Quitar mensaje de error en producción
        return res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

export { getAll, getOne, create, update, remove };

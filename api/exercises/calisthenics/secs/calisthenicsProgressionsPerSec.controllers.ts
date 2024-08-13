import { Request, Response } from "express";
import { orm } from "../../../shared/db/orm.js";
import { CalisthenicsProgressionPerSec } from "./calisthenicsProgressionPerSec.entity.js";

const em = orm.em;

async function getAll(req: Request, res: Response) { 
    try{
        const exercises = await em.find(CalisthenicsProgressionPerSec, {}, { populate: ['exercise'] });
        res.status(200).json({message: 'finded all exercises', exercises});
    }catch(err:any){
        res.status(500).json({message: err.message}); //Quitar mensaje de error en producción
    }
}

async function getOne(req: Request, res: Response) {
    try{
        const idProgression = Number.parseInt(req.params.idProgression);
        const exercise = await em.findOneOrFail(CalisthenicsProgressionPerSec, {idProgression}, { populate: ['exercise'] });
        res.status(200).json({message: 'finded exercise', exercise});
    }catch(err:any){
        res.status(500).json({message: err.message});
    }
}

async function create(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

async function update(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

async function remove(req: Request, res: Response) {
    res.status(501).json({message: 'Not implemented'});
}

export { getAll, getOne, create, update, remove };
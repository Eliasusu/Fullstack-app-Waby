import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { TrainingMethod } from "./trainingMethod.entity.js";

const em = orm.em;

//Get all training methods
async function getAll(req: Request, res: Response) {
    try {
        const trainingMethods = await em.find(TrainingMethod, {});
        res.status(200).json({ message: "finded all trainingMethods", trainingMethods });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

//Get one training method por name
async function getOne(req: Request, res: Response) {
    try {
        const name = req.params.nameMethod;
        const trainingMethod = await em.findOneOrFail(TrainingMethod, {nameMethod: name});
        res.status(200).json({ message: "finded trainingMethod", trainingMethod });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}



//Add a training method
async function add(req: Request, res: Response) {
    try {
        const trainingMethod = em.create(TrainingMethod, req.body);
        await em.flush();
        res.status(201).json({ message: "TrainingMethod created", trainingMethod });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

//Update a training method
async function update(req: Request, res: Response) {
    try {
        const idMethod = req.params.idMethod;
        const trainingMethodToUpdate = await em.findOneOrFail(TrainingMethod, { idMethod });
        em.assign(trainingMethodToUpdate, req.body);
        await em.flush();
        res.status(202).json({ message: "TrainingMethod updated succesfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

//Delete a training method
async function remove(req: Request, res: Response) {
    try {
        const idMethod = req.params.idMethod;
        const trainingMethod = em.getReference(TrainingMethod, idMethod as never);
        await em.removeAndFlush(trainingMethod);
        res.status(200).json({ message: "TrainingMethod deleted succesfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export { getAll, getOne, add, update, remove }
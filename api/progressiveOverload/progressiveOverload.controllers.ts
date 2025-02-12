import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { validateParcialProgressiveOverload } from "./progressiveOverload.schema.js";
import { ProgressiveOverload } from "./progressiveOverload.entity.js";
import { Exercise } from "../exercises/exercise.entity.js";
import { format } from 'date-fns';

const em = orm.em;

async function getAll(req: Request, res: Response) {
    console.log('entre')
    try {
        const progressiveOverloads = await em.find(ProgressiveOverload, { user: req.body.user.id }, { populate: ['exercise'] });
        res.status(200).json({ message: 'finded all progressiveOverloads', progressiveOverloads });
    } catch (err: any) {
        res.status(500)
    }
}

async function getOne(req: Request, res: Response) {
    try {
        const idProgressiveOverload = Number.parseInt(req.params.idProgressiveOverload);
        const progressiveOverload = await em.findOneOrFail(ProgressiveOverload, { idProgressiveOverload, user: { idUser: req.body.user.id } });
        if (!progressiveOverload) return res.status(404).json({ message: 'ProgressiveOverload not found' });
        res.status(200).json({ message: 'finded progressiveOverload', progressiveOverload });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async function create(req: Request, res: Response) {
    try {
        console.log('entro al create')
        const progressiveOverloadValidation = validateParcialProgressiveOverload(req.body);
        if (!progressiveOverloadValidation.success) {
            return res.status(400).json({ message: progressiveOverloadValidation.error });;
        }

        const logDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        const exerciseToOverload = await em.findOneOrFail(Exercise, { idExercise: progressiveOverloadValidation.data.exercise.idExercise });
        if (!exerciseToOverload) return res.status(404).json({ message: 'Exercise not found' });
        const progressiveOverload = em.create(ProgressiveOverload, {
            ...progressiveOverloadValidation.data,
            user: req.body.user.id,
            exercise: exerciseToOverload,
            logDate: logDate
        });
        await em.flush();
        res.status(201).json({ message: 'ProgressiveOverload created', progressiveOverload });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async function update(req: Request, res: Response) {
    try {
        console.log(req.body)
        const idProgressiveOverload = Number.parseInt(req.params.idProgressiveOverload);
        const progressiveOverload = await em.findOneOrFail(ProgressiveOverload, { idProgressiveOverload, user: { idUser: req.body.user.id }, exercise: { idExercise: req.body.exercise.idExercise } });
        if (!progressiveOverload) return res.status(404).json({ message: 'ProgressiveOverload not found' });
        const progressiveOverloadValidation = validateParcialProgressiveOverload(req.body);
        if (!progressiveOverloadValidation.success) {
            res.status(400).json({ message: progressiveOverloadValidation.error });
            return progressiveOverloadValidation.error;
        }

        const logDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        em.assign(progressiveOverload, {
            ...progressiveOverloadValidation.data,
            exercise: req.body.exercise.idExercise,
            logDate: logDate
        });
        await em.flush();
        res.status(200).json({ message: 'ProgressiveOverload updated', progressiveOverload });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const idProgressiveOverload = Number.parseInt(req.params.idProgressiveOverload);
        const progressiveOverload = await em.findOneOrFail(ProgressiveOverload, { idProgressiveOverload, user: { idUser: req.body.user.id } });
        if (!progressiveOverload) return res.status(404).json({ message: 'ProgressiveOverload not found' });
        await em.removeAndFlush(progressiveOverload);
        res.status(200).json({ message: 'ProgressiveOverload removed' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async function getAllByExercise(req: Request, res: Response) {
    try {
        const idExercise = Number.parseInt(req.params.idExercise);
        const progressiveOverloads = await em.find(ProgressiveOverload, { exercise: { idExercise }, user: { idUser: req.body.user.id } });
        res.status(200).json({ message: 'finded all progressiveOverloads', progressiveOverloads });
    } catch (err: any) {
        res.status(500)
    }
}



export { getAll, getOne, create, update, remove, getAllByExercise };
import { Request, Response } from "express";
import { validateTraining, validateParcialTraining } from "./trainings.schema.js";
import { orm } from "../shared/db/orm.js";
import { Training } from "./training.entity.js";
import jwt from 'jsonwebtoken';
import { User } from "../users/user.entity.js";

const em = orm.em;

async function getAll(req: Request, res: Response) {
    try {
        const trainings = await em.find(Training, {user: req.cookies.user}, { populate: ['user.idUser', 'mesocycle.idMesocycle'] });
        res.json(trainings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
 }

async function getOne(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

async function add(req: Request, res: Response) {
    try {
        // Obtener el objeto del usuario desde la cookie
        console.log(req.cookies.user);
        const userCookie = req.cookies.token;
        if (!userCookie || !userCookie.id) {
            return res.status(401).json({ message: "User information not found in cookies" });
        }

        // Extraer el ID del usuario desde la cookie
        const userId = userCookie.id;

        // Buscar el usuario en la base de datos usando el ID proporcionado en la cookie
        const user = await em.findOne(User, { idUser: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validar los datos del training
        const trainingValidation = validateParcialTraining(req.body);
        if (!trainingValidation.success) {
            return res.status(400).json({ message: trainingValidation.error });
        }

        // Crear el nuevo training
        const training = em.create(Training, {
            ...trainingValidation.data,
            user: user,  // Aquí pasas el objeto User completo
        });
        await em.persistAndFlush(training);

        res.status(201).json({ message: 'Training created', training });
    } catch (error: any) {
        console.error(error); // Para depuración
        res.status(500).json({ message: error.message });
    }
}

/*async function add(req: Request, res: Response) { 
    // En esta funcionalidad deberia haber un middleware que valide que el usuario que esta creando el training esta logueado
    try {
        const trainingValidation = validateParcialTraining(req.body);
        if (!trainingValidation.success) {
            res.status(400).json({ message: trainingValidation.error });
            return;
        }
        const training = em.create(Training, {
            ...trainingValidation.data,
        user: req.cookies.user });
        await em.persistAndFlush(training);
        res.status(201).json({ message: 'Training created', training });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}*/

async function update(req: Request, res: Response) { 
    res.status(500).json({ message: 'Not implemented' });
}

async function remove(req: Request, res: Response) {
    res.status(500).json({ message: 'Not implemented' });
}

export { getAll, getOne, add, update, remove };
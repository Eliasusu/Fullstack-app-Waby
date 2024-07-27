import { Repository } from '../shared/repository.js';
import { Exercise } from './exercise.entity.js';
import { pool } from "../conectiondb/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class ExerciseRepository implements Repository<Exercise>{

    public async getAll(): Promise<Exercise[] | undefined> {
        try {
            const [exercises] = await pool.query('SELECT * FROM exercises');
            if (!exercises) return undefined;
            return exercises as Exercise[];
        } catch (err) { 
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }


    public async getOne(item: { id: string }): Promise<Exercise | undefined> {
        try {
            const [exercises] = await pool.query<RowDataPacket[]>('SELECT * FROM exercises WHERE idExercise = ?', [item.id]);
            return exercises[0] as Exercise;
        } catch (err) {
            return undefined;
       }
    }

    public async add(item: Exercise): Promise<Exercise | undefined> {
        try {   

            console.log(item); //--> Eliminar en producción
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO exercises (idTraining, idMethod, name, description, image, typeExercise, difficulty, dateCreated) VALUES ?', [item]);
            console.log(result); //--> Eliminar en producción
            if (result.affectedRows === 1) {
                return item;
            } else {
                throw new Error("Failed to add exercise to the database");
            }
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }

    public async update(item: Exercise): Promise<Exercise | undefined> {
        try {
            const [result] = await pool.query('UPDATE exercises SET ? WHERE idExercise = ?', [item, item.idExercise]);
            return item;
        } catch (err) {
            return undefined;
        }
    }

    public async delete(item: { id: string }): Promise<Exercise | undefined> {
        const exerciseToDelete = await this.getOne(item);
        if (!exerciseToDelete) return undefined;
        try {
            const [result] = await pool.query<RowDataPacket[]>('DELETE FROM exercises WHERE idExercise = ?', [item.id]);
            return exerciseToDelete;
        } catch (err) {
            return undefined;
        }
    }

}

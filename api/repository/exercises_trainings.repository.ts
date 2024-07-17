import {Exercise_Training} from '../entity/exercise_training.entity.js';
import {Repository} from '../shared/repository.js';
import { pool } from '../conectiondb/conn.mysql.js';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PassThrough } from 'stream';


export class ExerciseTrainingRoutine implements Repository<Exercise_Training> { 
    public async getAll(item: { id?: string }): Promise<Exercise_Training[] | undefined> {
       return
    }

    public async getOne(item: { id?: string, other?: string}): Promise<Exercise_Training | undefined> {
        try {
            const query = 'SELECT * FROM exercises_trainings WHERE idTraining = ? AND idExercise = ?';
            const [rows] = await pool.query<RowDataPacket[]>(query, [item.id, item.other]);
            return rows[0] as Exercise_Training;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async add(item: Exercise_Training): Promise<Exercise_Training | undefined> {
        try {
            const newExerciseTraining = [item.training.idTraining, item.exercise.idExercise, item.sets, item.reps, item.weight, item.rest, item.comment];
            const query = 'INSERT INTO exercises_trainings SET ?';
            const [result] = await pool.query<ResultSetHeader>(query, [newExerciseTraining]);
            return result as unknown as Exercise_Training;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async update(item: Exercise_Training): Promise<Exercise_Training | undefined> {
        try {
            const query = 'UPDATE exercises_trainings SET ? WHERE idTraining = ? AND idExercise = ?';
            const [result] = await pool.query(query, [item, item.training.idTraining, item.exercise.idExercise]);
            return item;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async delete(item: { id?: string, other?: string }): Promise<Exercise_Training | undefined> {
        try {
            const query = 'DELETE FROM exercises_trainings WHERE idTraining = ? AND idExercise = ?';
            const [result] = await pool.query(query, [item.id, item.other]);
            return item as Exercise_Training;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }
}
    

 


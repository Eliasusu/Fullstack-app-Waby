import { Repository } from "../shared/repository.js";
import { Training } from "../entity/training.entity.js";
import { pool } from "../conectiondb/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export class TrainingRepository implements Repository<Training>{

    public async getAll(item: { id: string }): Promise<Training[] | undefined> {
        try {
            const [trainings, _] = await pool.query('SELECT * FROM trainings WHERE idUser = ?', [item.id]) as [Training[], any];
            if (trainings.length === 0) return undefined;
            return trainings;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async getOne(item: { id: string, other?: string }): Promise<Training | undefined> {
        try {
            const [trainings] = await pool.query<RowDataPacket[]>('SELECT * FROM trainings WHERE idTraining = ? AND idUser = ?', [item.id, item.other]);
            return trainings[0] as Training;
        } catch(err){
            console.log(err) // --> Eliminar en producción
            return undefined;
        }
    }

    public async add(item: Training): Promise<Training | undefined> {
        const trainingInput = [item.mesocycle.idMesocycle, item.trainingName, item.trainingType, item.day, item.time, item.user.idUser];
        console.log(trainingInput); // --> Eliminar en producción
        try {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO trainings SET ?', [trainingInput]);
            return 
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async update(item: Training): Promise<Training | undefined> {
        try {
            const [result] = await pool.query('UPDATE trainings SET ? WHERE idTraining = ?', [item, item.idTraining]);
            return item;
        } catch (err) {
            console.log(err); // --> Eliminar en producción
            return undefined;
        }
    }

    public async delete(item: { id: string }): Promise<Training | undefined> {
        const training = await this.getOne({ id: item.id });
        if (training) {
            try {
                const [result] = await pool.query('DELETE FROM trainings WHERE idTraining = ?', [item.id]);
                return training;
            } catch (err) {
                console.log(err); // --> Eliminar en producción
                return undefined;
            }
        }
    }

    
}

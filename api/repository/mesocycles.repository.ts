import { Repository } from "../shared/repository.js";
import { Mesocycle } from "../entity/mesocycle.entity.js";
import { pool } from "../conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export class MesocycleRepository implements Repository<Mesocycle> {
    public async getAll(item: { id?: string }): Promise<Mesocycle[] | undefined> {
        try {
            const query = 'SELECT * FROM mesocycles m JOIN trainings t ON ? = t.idTraining';
            const [rows] = await pool.execute(query, [item.id]);
            return rows as Mesocycle[];
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }

    public async getOne(item: { id?: string }): Promise<Mesocycle | undefined> {
        try {
            const query = 'SELECT * FROM mesocycles WHERE idMesocycle = ?';
            const [rows] = await pool.execute<RowDataPacket[]>(query, [item.id]);
            return rows[0] as Mesocycle;
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }

    public async add(item: Mesocycle): Promise<Mesocycle | undefined> {
        try {
            const query = 'INSERT INTO mesocycles SET ?';
            const [result] = await pool.execute<ResultSetHeader>(query, [item]);
            return result as unknown as Mesocycle;
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }

    public async update(item: Mesocycle): Promise<Mesocycle | undefined> {
        try {
            const query = 'UPDATE mesocycles SET ? WHERE idMesocycle = ?';
            const [result] = await pool.execute(query, [item, item.idMesocycle]);
            return result as unknown as Mesocycle;
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }

    public async delete(item: { id?: string }): Promise<Mesocycle | undefined> {
        try {
            const query = 'DELETE FROM mesocycles WHERE idMesocycle = ?';
            const [result] = await pool.execute(query, [item.id]);
            return result as unknown as Mesocycle;
        } catch (err) {
            console.log(err); //--> Eliminar en producción
            return undefined;
        }
    }
}

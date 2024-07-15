import { MuscleGroup } from "../entity/muscleGroup.entity.js";
import { Repository } from "../shared/repository.js";
import {pool} from "../conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export class MuscleGroupsRepository implements Repository<MuscleGroup>{
    public async getAll(): Promise<MuscleGroup[] | undefined> {
        try{
            const [muscleGroups] = await pool.query('SELECT * FROM muscleGroups');
            return muscleGroups as MuscleGroup[];
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    public async getOne(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
        if(item.name){
            try{
                const [muscleGroups] = await pool.query<RowDataPacket[]>('SELECT * FROM muscleGroups WHERE nameMuscleGroup = ?', [item.name]);
                return muscleGroups[0] as MuscleGroup;
            }catch{
                return undefined;
            }
        } if(item.id) { 
            try{
                const [muscleGroups] = await pool.query<RowDataPacket[]>('SELECT * FROM muscleGroups WHERE idMuscleGroup = ?', [item.id]);
                return muscleGroups[0] as MuscleGroup;
            }catch{
            return undefined;
        }
        }
    }

    public async add(item: MuscleGroup): Promise<MuscleGroup | undefined> {
        try {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO muscleGroups SET ?', [item]);
            return item;
        } catch (err) {
            return undefined;
        }
    }

    public async update(item: MuscleGroup): Promise<MuscleGroup | undefined> {
        try{
            const [result] = await pool.query('UPDATE muscleGroups SET ? WHERE idMuscleGroup = ?', [item, item.idMuscleGroup]);
            return item;
        } catch(err){
            return undefined
        }
    }

   public async delete(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
        const muscleGroupToDelete = await this.getOne({id: item.id});
        if(!muscleGroupToDelete) return undefined;
        try {
            const[result] = await pool.query<RowDataPacket[]>('DELETE FROM muscleGroups WHERE idMuscleGroup = ?', [item.id])
            return muscleGroupToDelete;
        } catch(err) {
            return undefined;
        }
    }
}
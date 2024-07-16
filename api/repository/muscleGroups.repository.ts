import { MuscleGroup } from "../entity/muscleGroup.entity.js";
import { Repository } from "../shared/repository.js";
import {pool} from "../conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { query } from "express";


export class MuscleGroupsRepository implements Repository<MuscleGroup>{
    public async getAll(): Promise<MuscleGroup[] | undefined> {
        try{
            const [muscleGroups] = await pool.query('SELECT * FROM muscle_groups');
            return muscleGroups as MuscleGroup[];
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    public async getOne(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
        if(item.name){
            try{
                const [muscleGroups] = await pool.query<RowDataPacket[]>('SELECT * FROM muscle_groups WHERE nameMuscleGroup = ?', [item.name]);
                return muscleGroups[0] as MuscleGroup;
            }catch{
                return undefined;
            }
        } if(item.id) { 
            try{
                const [muscleGroups] = await pool.query<RowDataPacket[]>('SELECT * FROM muscle_groups WHERE idMuscleGroup = ?', [item.id]);
                return muscleGroups[0] as MuscleGroup;
            }catch{
            return undefined;
        }
        }
    }

    public async add(item: MuscleGroup): Promise<MuscleGroup | undefined> {
        try {
            const query = 'INSERT INTO muscle_groups SET ?';
            const [result] = await pool.execute<ResultSetHeader>(query, [item]);
            console.log("pase el query");
            return result as unknown as MuscleGroup;
        } catch (err) {
            return undefined;
        }
    }

    public async update(item: MuscleGroup): Promise<MuscleGroup | undefined> {
        try{
            console.log("pase el try");
            console.log(item);
            const query = 'UPDATE muscle_groups SET ? WHERE idMuscleGroup = ?';
            const [result] = await pool.execute(query, [item, item.idMuscleGroup]);
            console.log("pase el query");
            return item;
        } catch(err){
            console.log(err);
            return undefined
        }
    }

   public async delete(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
        const muscleGroupToDelete = await this.getOne({id: item.id});
        if(!muscleGroupToDelete) return undefined;
        try {
            const[result] = await pool.query<RowDataPacket[]>('DELETE FROM muscle_groups WHERE idMuscleGroup = ?', [item.id])
            return muscleGroupToDelete;
        } catch(err) {
            return undefined;
        }
    }
}
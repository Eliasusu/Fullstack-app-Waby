import { Repository } from "../shared/repository.js";
import { User } from "./user.entity.js";
import { pool } from "../conectiondb/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export class UserRepository implements Repository<User>{
    public async getAll(): Promise<User[] | undefined> {
        try{
            const [users] = await pool.query('SELECT * FROM users');
            return users as User[];
        }catch(err){
            return undefined;
        }
    };

    public async getOne(item: { id?: string, name?: string, other?: string }): Promise<User | undefined> {
        if(item.name){
            try{
                const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [item.name]);
                return users[0] as User;
            }catch{
                return undefined;
            }
        }
        if(item.other){
            try{
                const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [item.other]);
                return users[0] as User;
            }catch{
                return undefined;
            }
        } else { 
            try {
                const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE idUser = ?', [item.id]);
                return users[0] as User;
            }catch  {
                return undefined;
            }
        }

    }

    public async add(item: User): Promise<User | undefined> {
        try {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', [item]);
            return item;
        } catch (err) {
            return undefined;
        }
    }

    public async update(item: User): Promise<User | undefined> {
        try {
            const [result] = await pool.query<ResultSetHeader>('UPDATE users SET ? WHERE idUser = ?', [item, item.idUser]);
            if (result.affectedRows === 0) return undefined;
            return item;
        } catch (err) {
            return undefined;
        }
    }

    public async delete(item: { id: string }): Promise<User | undefined> {
        const userToDelete = await this.getOne({id: item.id});
        if (!userToDelete) return undefined;
        try {
            const [result] = await pool.query<RowDataPacket[]>('DELETE FROM users WHERE idUser = ?', [item.id]);
            return userToDelete;
        } catch (err) {
            return undefined;
        }
    }
    
} 
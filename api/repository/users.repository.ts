import { Repository } from "../shared/repository.js";
import { User } from "../entity/user.entity.js";
import { pool } from "../conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { resourceUsage } from "process";


export class UserRepository implements Repository<User>{
    public async getAll(): Promise<User[] | undefined> {
        try{
            const [users] = await pool.query('SELECT * FROM users');
            return users as User[];
        }catch(err){
            console.log(err);
            return undefined;
        }
    };

    public async getOne(item: { id: string }): Promise<User | undefined> {
        try{
            const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE idUser = ?', [item.id]);
            return users[0] as User;
        }catch{
            return undefined;
        }
    }

    public async add(item: User): Promise<User | undefined> {
        try {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', [item]);
            return
        } catch (err) {
            return undefined;
        }
    }

    public async update(item: User): Promise<User | undefined> {
        try {
            const [result] = await pool.query('UPDATE users SET ? WHERE idUser = ?', [item, item.idUser]);
            return item;
        } catch (err) {
            return undefined;
        }
    }

    public async delete(item: { id: string }): Promise<User | undefined> {
        console.log('Entre al deleted')
        const userToDelete = await this.getOne(item);
        console.log(userToDelete)
        if (!userToDelete) return undefined;
        try {
            console.log('antes de la consulta')
            const [result] = await pool.query<RowDataPacket[]>('DELETE FROM users WHERE idUser = ?', [item.id]);
            console.log('despues de la consulta')
            return userToDelete;
        } catch (err) {
            console.log(err)
            return undefined;
        }
    }
    
} 
import { Repository } from "../shared/repository.js";
import { User } from "../entity/user.entity.js";
import { pool } from "../conn.mysql.js";
import { RowDataPacket } from "mysql2";
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

    public async getOne(item: { id?: string, username?: string }): Promise<User | undefined> {
        try{
            if (item.id) {
                const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE idUser = ?', [item.id]);
                return users[0] as User;
            } else if (item.username) {
                const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE username = ?', [item.username]);
                return users[0] as User;
            }
        }catch{
            return undefined;
        }
    }

    public async add(item: User): Promise<User | undefined> {
        console.log(item)
        try{    
            console.log('Entre al add del repository')
            const [idUser, fullname, birthdate, phone, mail, password, username, bodyWeigth, height] = [item.idUser, item.name, item.birthdate, item.phone, item.email, item.password, item.username, item.bodyWeight, item.height];
            const test = await pool.query('INSERT INTO users SET (idUser, fullname, birthdate, phone, mail, password, username, bodyWeigth, height) VALUES (?,?,?,?,?,?,?,?,?)', [
                idUser, fullname, birthdate, phone, mail, password, username, bodyWeigth, height
            ]);
            console.log(test)
            console.log('Despues del insert')
            return item;
        }catch{
            return undefined;
        }
    }

    public async update(item: User): Promise<User | undefined> {
        const index = users.findIndex((user) => user.idUser === item.idUser);
        if (index > -1) {
            users[index] = {...users[index], ...item};
            return item;
        } else {
            return;
        }
        PassThrough
    }

    public async delete(item: { id?: string, name?: string }): Promise<User | undefined> {
        console.log('Entre al delete del repository')
        console.log(item)
        if( item.id ){
            const index = users.findIndex((user) => user.idUser === item.id);
            console.log(`Este es el index del if con id${index}`)
            if (index > -1) {
                return users.splice(index, 1)[0];
            } else {
                return undefined;
            }
        } else {
            const index = users.findIndex((user) => user.name === item.name);
            console.log(`Este es el index del if con name${index}`)
            if (index > -1) {
                return users.splice(index, 1)[0];
            } else {
                return undefined;
            }
        }
        PassThrough
    }
    
} 
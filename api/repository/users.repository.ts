import { Repository } from "../shared/repository.js";
import { User } from "../entity/user.entity.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";

const users = [
    new User(
        'todoutada',
        'takadachantodo123',
        'todoaoi@gmail.com',
        'Todou Aoi',
        new Date(1990, 1, 1),
        '123456',
        90,
        1.89,
        new TrainingMethod('Gym', '')
    ),

    new User(
        'chihiro',
        'chihirorokuhira123',
        'chihirorokuhira@gmail.com',
        'Chihiro Rokuhira',
        new Date(1992, 1, 1),
        '123456',
        70,
        1.70,
        new TrainingMethod('Calisthenics', '')
    ),

    new User(
        'itadori',
        'itadoriyuji123',
        'itadoyuji@gmail.com',
        'Itadori Yuji',
        new Date(1995, 1, 1),
        '123456',
        80,
        1.76,
        new TrainingMethod('Calisthenics', '')
    ),
]

export class UserRepository implements Repository<User>{
    public async getAll(): Promise<User[] | undefined> {
        return users;
    }

    public async getOne(item: { id?: string, username?: string }): Promise<User | undefined> {
        if (item.id) {
            return users.find((user) => user.idUser === item.id);
        } else if (item.username) {
            return users.find((user) => user.username === item.username);
        } else {
            return undefined;
        }
    }

    public async add(item: User): Promise<User | undefined> {
        users.push(item);
        return item;
    }

    public async update(item: User): Promise<User | undefined> {
        const index = users.findIndex((user) => user.idUser === item.idUser);
        if (index > -1) {
            users[index] = {...users[index], ...item};
            return item;
        } else {
            return;
        }
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
    }
    
} 
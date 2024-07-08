import { Repository } from "../shared/repository.js";
import { User } from "../entity/user.entity.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";

const users = [
    new User(
        'todou',
        'tadakatantodo123',
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

    public async getOne(item: { id?: string, name?: string }): Promise<User | undefined> {
        if (item.id) {
            return users.find((user) => user.idUser === item.id);
        } else if (item.name) {
            return users.find((user) => user.name === item.name);
        } else {
            return undefined;
        }
    }

    public async add(item: User): Promise<User | undefined> {
        item.idUser = (users.length + 1).toString();
        users.push(item);
        return item;
    }

    public async update(item: User): Promise<User | undefined> {
        const user = users.find((user) => user.idUser === item.idUser);
        if (!user) {
            console.log('User not found');
            return;
        }
        Object.assign(user, item);
        return user;
    }

    public async delete(item: { id?: string, name?: string }): Promise<User | undefined> {
        if( item.id ){
            const index = users.findIndex((user) => user.idUser === item.id);
            if (index > -1) {
                return users.splice(index, 1)[0];
            } else {
                return;
            }
        } else {
            const index = users.findIndex((user) => user.name === item.name);
            if (index > -1) {
                return users.splice(index, 1)[0];
            } else {
                return;
            }
        }
    }
    
} 
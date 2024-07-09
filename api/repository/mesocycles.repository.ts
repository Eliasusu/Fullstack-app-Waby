import { Mesocycle } from "../entity/mesocycle.entity.js";
import { Repository } from "../shared/repository.js";

const Mesocycles = [    
    new Mesocycle(
        '1',
        'Strength',
        new Date('2024-01-01'),
        new Date('2024-01-31'),
    ),
    new Mesocycle(
        '2',
        'Hypertrophy',
        new Date('2024-02-01'),
        new Date('2024-02-28'),
    ),
];

export class MesocycleRepository implements Repository<Mesocycle>{
    public async getAll(): Promise<Mesocycle[] | undefined> {
        return Mesocycles;
    }

    public async getOne(item: { id?: string, type?: string }): Promise<Mesocycle | undefined> {
        if (item.id) {
            return Mesocycles.find((mesocycle) => mesocycle.idMesocycle === item.id);
        } else if (item.type) {
            return Mesocycles.find((mesocycle) => mesocycle.typeMesocycle === item.type);
        } else {return undefined;}
    }

    public async add(item: Mesocycle): Promise<Mesocycle | undefined> {
        item.idMesocycle = (Mesocycles.length + 1).toString();
        Mesocycles.push(item);
        return undefined;
    }

    public async update(item: Mesocycle): Promise<Mesocycle | undefined> {
        const mesocycle = Mesocycles.find((mesocycle) => mesocycle.idMesocycle === item.idMesocycle);
        if (!mesocycle) {
            console.log('Mesocycle not found');
            return;
        }
        Object.assign(mesocycle, item);
        return mesocycle;
    }

    public async delete(item: { id?: string, type?: string }): Promise<Mesocycle | undefined> {
        if( item.id ){
            const index = Mesocycles.findIndex((mesocycle) => mesocycle.idMesocycle === item.id);
            if (index > -1) {
                return Mesocycles.splice(index, 1)[0];
            } else {
                return;
            }
        } else {
            const index = Mesocycles.findIndex((mesocycle) => mesocycle.typeMesocycle === item.type);
            if (index > -1) {
                return Mesocycles.splice(index, 1)[0];
            } else {
                return;
            }
        }
    }
}
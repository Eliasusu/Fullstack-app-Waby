import { MuscleGroup } from "../entity/muscleGroup.entity.js";
import { Repository } from "../shared/repository.js";

const MuscleGroups = [
    new MuscleGroup(
        'El pectoral es un grupo múscular que se encuentra en la parte superior del tórax',
        'https://www.ejerciciosconpesas.es/wp-content/uploads/2019/05/pectorales.jpg',
        'Pectoral',
        '1',
    ),
    new MuscleGroup(
        'El deltoides es un grupo múscular que se encuentra en la parte superior del brazo',
        'https://www.ejerciciosconpesas.es/wp-content/uploads/2019/05/deltoides.jpg',
        'Deltoides',
        '2',
    ),
]

export class MuscleGroupRepository implements Repository<MuscleGroup>{
    public async getAll(): Promise<MuscleGroup[] | undefined> {
        return MuscleGroups;
    }

    public async getOne(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
      if (item.id) {
          return MuscleGroups.find((muscleGroup) => muscleGroup.idMuscleGroup === item.id);
      } else if (item.name) {
          return MuscleGroups.find((muscleGroup) => muscleGroup.nameMuscleGroup === item.name);
      } else {return undefined;}
    }

    public async add(item: MuscleGroup): Promise<MuscleGroup | undefined> {
        item.idMuscleGroup = (MuscleGroups.length + 1).toString();
        MuscleGroups.push(item);
        return undefined;
    }

    public async update(item: MuscleGroup): Promise<MuscleGroup | undefined> {
      const muscleGroup = MuscleGroups.find((muscleGroup) => muscleGroup.idMuscleGroup === item.idMuscleGroup);
      if (!muscleGroup) {
            console.log('Muscle Group not found');
            return;
        }
        Object.assign(muscleGroup, item);
        return muscleGroup;
    }

   public async delete(item: { id?: string, name?: string }): Promise<MuscleGroup | undefined> {
        if( item.id ){
            const index = MuscleGroups.findIndex((muscleGroup) => muscleGroup.idMuscleGroup === item.id);
            if (index > -1) {
                return MuscleGroups.splice(index, 1)[0];
            } else {
                return;
            }
        } else {
            const index = MuscleGroups.findIndex((muscleGroup) => muscleGroup.nameMuscleGroup === item.name);
            if (index > -1) {
                return MuscleGroups.splice(index, 1)[0];
            } else {
                return;
            }
        }
    }
}
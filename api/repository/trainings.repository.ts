import { Repository } from "../shared/repository.js";

import { User } from "../entity/user.entity.js";
import { Mesocycle } from "../entity/mesocycle.entity.js";
import { Training } from "../entity/training.entity.js";
import { TrainingMethod } from "../entity/trainingMethod.entity.js";


const Trainings: Training[] = [
    new Training(
        new User(
            "Nobara",
            "1234",
            "nobarakugisaki@gmail.com",
            "Nobara Kugisaki",
            new Date(2002, 20, 12),
            "123456",
            50,
            1.60,
            new TrainingMethod(
                "Gym",
                ""
            )
        ),
        new Mesocycle(
            "1",
            "Strenght",
            new Date(),
            new Date()
        ),
        "Chest day",
        "Pull",
        new Date(),
        "5:00 AM",
        "1"
    ),
    new Training(
        new User(
            "Nobara",
            "1234",
            "nobarakugisaki@gmail.com",
            "Nobara Kugisaki",
            new Date(2002, 20, 12),
            "123456",
            50,
            1.60,
            new TrainingMethod(
                "Gym",
                ""
            )
        ),
        new Mesocycle(
            "1",
            "Strenght",
            new Date(),
            new Date()
        ),
        "Leg day",
        "Push",
        new Date(),
        "5:00 AM",
        "2"
    ),
];

export class TrainingRepository implements Repository<Training>{

    public async getAll(): Promise<Training[] | undefined> {
        return Trainings;
    }


    public async getOne(item: { id: string }): Promise<Training | undefined> {
        return Trainings.find((Training) => Training.idTraining === item.id);
    }

    public async add(item: Training): Promise<Training | undefined> {
        item.idTraining = (Trainings.length + 1).toString();
        Trainings.push(item);
        return item;
    }

    public async update(item: Training): Promise<Training | undefined> {
        const index = Trainings.findIndex((Training) => Training.idTraining === item.idTraining);
        if (index > -1) {
            Trainings[index] = {...Trainings[index], ...item};
            return item;
        } else {
            return;
        }
    }

    public async delete(item: { id: string }): Promise<Training | undefined> {
        const index = Trainings.findIndex((Training) => Training.idTraining === item.id);
        if (index > -1) {
            return Trainings.splice(index, 1)[0];
        } else {
            return;
        }
    }

}

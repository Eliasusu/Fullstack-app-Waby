import { Repository } from '../shared/repository.js';
import { Exercise } from '../entity/exercise.entity.js';
import { TrainingMethod } from '../entity/trainingMethod.entity.js';
import { Training } from '../entity/training.entity.js';
import { Mesocycle } from '../entity/mesocycle.entity.js';
import { User } from '../entity/user.entity.js';
import { MuscleGroup } from '../entity/muscleGroup.entity.js';

const exercises = [
    new Exercise(
        "Bench Press",
        new TrainingMethod("Gym", ""),
        "The bench press is a compound exercise that builds strength and muscle in the chest and triceps. It's one of the most popular exercises in the gym.",
        [new MuscleGroup("1", "Chest", "", "")],
        "Medium",
        "Compound",
        "1",
        new Training(
            "1", 
            new User(
                "theo", 
                "1234", 
                "theo@gmail.com", 
                "Theo", 
                new Date(), 
                "123456", 
                70, 
                1.80, 
                new TrainingMethod(
                    "Gym",
                    ""
                )
            ),
            new Mesocycle(
                "1", 
                "Strenght",
                 new Date(), 
                 new Date()), 
                 "Chest day", 
                 "Pull", 
                 new Date(), 
                 "5:00 AM"
             ),
        "",
        "",
        new Date()
    ),
]



export class ExerciseRepository implements Repository<Exercise>{

    public async getAll(): Promise<Exercise[] | undefined> {
        return exercises;
    }


    public async getOne(item: { id: string }): Promise<Exercise | undefined> {
        return exercises.find((exercise) => exercise.idExercise === item.id);
    }

    public async add(item: Exercise): Promise<Exercise | undefined> {
        item.idExercise = (exercises.length + 1).toString();
        exercises.push(item);
        return item;
    }

    public async update(item: Exercise): Promise<Exercise | undefined> {
        const index = exercises.findIndex((exercise) => exercise.idExercise === item.idExercise);
        if (index > -1) {
            exercises[index] = {...exercises[index], ...item};
            return item;
        } else {
            return;
        }
    }

    public async delete(item: { id: string }): Promise<Exercise | undefined> {
        const index = exercises.findIndex((exercise) => exercise.idExercise === item.id);
        if (index > -1) {
            return exercises.splice(index, 1)[0];
        } else {
            return;
        }
    }

}
